import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

// `public/sw.js` ships verbatim to the browser (only its cache token is stamped
// at build time), so there is no module to import — we evaluate the real file
// against stub service-worker globals and drive its `fetch` handler directly.
const SW_SOURCE = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sw.js'),
  'utf8',
);

const ORIGIN = 'https://zii.tools';

type StubResponse = { ok: boolean; status: number; body: string; clone: () => StubResponse };
type StubRequest = { method: string; url: string; mode: string };

function makeResponse(body: string, status = 200): StubResponse {
  const res: StubResponse = {
    ok: status >= 200 && status < 300,
    status,
    body,
    clone: () => res,
  };
  return res;
}

function request(url: string, mode = 'no-cors'): StubRequest {
  return { method: 'GET', url: new URL(url, ORIGIN).href, mode };
}

/**
 * Evaluate the worker with a fake Cache Storage seeded from `cached`, and a
 * network that answers from `network` (a miss throws, standing in for offline).
 */
function loadWorker(options: {
  cached?: Record<string, string>;
  network?: Record<string, StubResponse>;
}) {
  const { cached = {}, network = {} } = options;

  const store = new Map<string, StubResponse>();
  for (const [path, body] of Object.entries(cached)) {
    store.set(new URL(path, ORIGIN).href, makeResponse(body));
  }

  const keyOf = (req: StubRequest | string) =>
    typeof req === 'string' ? new URL(req, ORIGIN).href : req.url;

  const caches = {
    match: async (req: StubRequest | string) => store.get(keyOf(req)),
    open: async () => ({
      put: async (req: StubRequest | string, res: StubResponse) => {
        store.set(keyOf(req), res);
      },
      addAll: async () => {},
    }),
    keys: async () => [],
    delete: async () => true,
  };

  const fetched: string[] = [];
  const fetchStub = async (req: StubRequest) => {
    fetched.push(req.url);
    const hit = network[req.url] ?? network[new URL(req.url).pathname];
    if (!hit) throw new Error('offline');
    return hit;
  };

  const handlers: Record<string, (event: unknown) => void> = {};
  const sandbox = {
    self: {
      addEventListener: (type: string, handler: (event: unknown) => void) => {
        handlers[type] = handler;
      },
      skipWaiting: () => {},
      clients: { claim: () => {} },
    },
    caches,
    fetch: fetchStub,
    location: { origin: ORIGIN },
    Response: { error: () => makeResponse('network error', 0) },
    URL,
  };

  runInContext(SW_SOURCE, createContext(sandbox));

  /** Dispatch a GET through the worker; `null` means it did not intercept. */
  async function handle(req: StubRequest): Promise<StubResponse | null> {
    let responded: Promise<StubResponse> | null = null;
    handlers.fetch?.({
      request: req,
      respondWith: (p: Promise<StubResponse>) => {
        responded = p;
      },
      waitUntil: () => {},
    });
    return responded === null ? null : await responded;
  }

  return { handle, store, fetched };
}

describe('service worker — offline navigation', () => {
  it('falls back to the localized shell when the page itself is not cached', async () => {
    const { handle } = loadWorker({ cached: { '/en/index.html': 'en-shell' } });

    const res = await handle(request('/en/tools/hash', 'navigate'));

    expect(res?.body).toBe('en-shell');
  });

  it('falls through to the root shell when the localized shell is missing', async () => {
    // Regression: the fallbacks were chained with `??` on un-awaited
    // `caches.match()` promises, so this second fallback was unreachable and
    // the navigation resolved to `undefined` — a network error for the user.
    const { handle } = loadWorker({ cached: { '/index.html': 'root-shell' } });

    const res = await handle(request('/ja/tools/hash', 'navigate'));

    expect(res?.body).toBe('root-shell');
  });

  it('prefers the cached page over any shell fallback', async () => {
    const { handle } = loadWorker({
      cached: { '/en/tools/hash': 'the-page', '/en/index.html': 'en-shell' },
    });

    const res = await handle(request('/en/tools/hash', 'navigate'));

    expect(res?.body).toBe('the-page');
  });
});

describe('service worker — asset caching', () => {
  it('caches a successful same-origin asset', async () => {
    const { handle, store } = loadWorker({
      network: { '/assets/index-abc.js': makeResponse('bundle') },
    });

    await handle(request('/assets/index-abc.js'));

    expect(store.get(`${ORIGIN}/assets/index-abc.js`)?.body).toBe('bundle');
  });

  it('does not cache an error response', async () => {
    // Regression: every response was cached unconditionally, so a transient
    // 404/5xx was pinned for the life of the cache — i.e. until the next
    // deploy re-stamped the cache name.
    const { handle, store } = loadWorker({
      network: { '/assets/missing.js': makeResponse('not found', 404) },
    });

    const res = await handle(request('/assets/missing.js'));

    expect(res?.status).toBe(404);
    expect(store.has(`${ORIGIN}/assets/missing.js`)).toBe(false);
  });
});

describe('service worker — request scope', () => {
  it('does not intercept cross-origin requests', async () => {
    // Regression: the live FX API was served cache-first, freezing the "live"
    // rate at whatever value was fetched first.
    const { handle, fetched } = loadWorker({});

    const res = await handle(request('https://api.frankfurter.app/latest?from=USD&to=TWD'));

    expect(res).toBeNull();
    expect(fetched).toEqual([]);
  });

  it('does not intercept non-GET requests', async () => {
    const { handle } = loadWorker({});

    const res = await handle({ method: 'POST', url: `${ORIGIN}/convert`, mode: 'cors' });

    expect(res).toBeNull();
  });
});
