// Minimal hand-rolled service worker: caches the app shell for offline use.
// Navigations are network-first so crawlers and returning users get the correct
// prerendered HTML (per-locale / per-tool), falling back to the cached shell
// only when offline. Assets stay cache-first.
//
// The cache name carries a content hash so every deploy that changes any bundle
// gets a fresh cache — otherwise the cache-first navigation handler keeps
// serving returning visitors a stale index.html (and its now-missing hashed
// chunks). `scripts/stamp-sw.mjs` rewrites the `zii-shell-*` token in the built
// copy with a fingerprint of the emitted assets; the literal below is the
// unstamped dev fallback.
/* global self, caches, location */
const CACHE = 'zii-shell-dev';
// Prefer concrete HTML files — bare `/` 301s to `/en` in production.
const SHELL = ['/index.html', '/en/index.html', '/manifest.webmanifest'];
// Offline navigation fallbacks, tried in order once the request itself misses.
const NAV_FALLBACKS = ['/en/index.html', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function cachePut(request, response) {
  const copy = response.clone();
  caches.open(CACHE).then((cache) => cache.put(request, copy));
}

// Offline navigation: the cached page itself, else the app shell. Each lookup
// must be awaited in turn — `caches.match()` returns a promise, which is never
// nullish, so chaining un-awaited matches with `??` always picks the first one
// and silently drops the rest.
async function offlineShell(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  for (const path of NAV_FALLBACKS) {
    const fallback = await caches.match(path);
    if (fallback) return fallback;
  }
  return Response.error();
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Only store successes: a cached 404/5xx would otherwise be served for the
  // whole life of this cache, i.e. until the next deploy re-stamps its name.
  if (response.ok) cachePut(request, response);
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Cross-origin GETs (live FX, optional backend) bypass the worker entirely.
  // They must never go through the cache-first path below, which would pin a
  // "live" rate to whatever value happened to be fetched first.
  if (new URL(request.url).origin !== location.origin) return;

  // Network-first for navigations: serve live prerendered HTML when online.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) cachePut(request, response);
          return response;
        })
        .catch(() => offlineShell(request)),
    );
    return;
  }

  event.respondWith(cacheFirst(request));
});
