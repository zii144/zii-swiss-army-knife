/**
 * Thin node:http server factory.
 *
 * Routes a couple of GET/POST paths to injected handlers. It is intentionally
 * minimal and stateless: there is no session store, no disk I/O, and no shared
 * mutable state beyond the per-request closures. The pure pieces (cache,
 * adapter, convert) are what the tests exercise; this factory only needs to
 * typecheck cleanly and is wired up by the deployment layer.
 */

import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse, Server } from 'node:http';
import { Buffer } from 'node:buffer';
import { transitEtaAdapter } from './adapter';
import { convertHandler } from './convert';
import type { DoConvert } from './convert';
import { TTLCache } from './cache';
import type { NormalizedEta } from './adapter';

/** Handlers the server delegates to (all injectable for testing/wiring). */
export interface ServerHandlers {
  /** Fetch a raw upstream ETA payload for a route id (e.g. from a proxy). */
  fetchEtaRaw: (routeId: string) => Promise<unknown>;
  /** The conversion worker (LibreOffice/Gotenberg/ffmpeg lives behind this). */
  doConvert: DoConvert;
  /** Optional FX rate resolver (units of `to` per 1 unit of `from`). */
  fetchFxRate?: (from: string, to: string) => Promise<number>;
  /** Cache TTL for normalized ETA responses, in ms (default 30s). */
  etaTtlMs?: number;
  /** Cache TTL for FX rates, in ms (default 15 minutes). */
  fxTtlMs?: number;
}

/** Read an entire request body into a single Uint8Array. */
function readBody(req: IncomingMessage): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    req.on('end', () => {
      let total = 0;
      for (const c of chunks) {
        total += c.length;
      }
      const out = new Uint8Array(total);
      let offset = 0;
      for (const c of chunks) {
        out.set(c, offset);
        offset += c.length;
      }
      resolve(out);
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(payload);
}

/**
 * Build a stateless HTTP server. The returned {@link Server} is NOT started;
 * the caller decides when/whether to `listen()`. Routes:
 *  - `GET  /eta?route=<id>`   → normalized, short-TTL-cached transit ETAs
 *  - `POST /convert?from&to`  → no-retention byte conversion
 */
export function createBackendServer(handlers: ServerHandlers): Server {
  const ttl = handlers.etaTtlMs ?? 30_000;
  const fxTtl = handlers.fxTtlMs ?? 15 * 60_000;
  // Cache lives per-server, holds only *normalized* (non-credential) data, and
  // self-expires; it is not durable storage.
  const etaCache = new TTLCache<NormalizedEta>();
  const fxCache = new TTLCache<number>();

  return createServer((req: IncomingMessage, res: ServerResponse): void => {
    void (async () => {
      try {
        const method = req.method ?? 'GET';
        const url = new URL(req.url ?? '/', 'http://localhost');
        const path = url.pathname;

        if (method === 'GET' && path === '/eta') {
          const routeId = url.searchParams.get('route') ?? '';
          if (routeId === '') {
            sendJson(res, 400, { error: 'missing route' });
            return;
          }
          const cached = etaCache.get(routeId);
          if (cached !== undefined) {
            sendJson(res, 200, cached);
            return;
          }
          const raw = await handlers.fetchEtaRaw(routeId);
          const normalized = transitEtaAdapter.normalize(raw) as NormalizedEta;
          etaCache.set(routeId, normalized, ttl);
          sendJson(res, 200, normalized);
          return;
        }

        if (method === 'GET' && path === '/fx') {
          const from = (url.searchParams.get('from') ?? '').toUpperCase();
          const to = (url.searchParams.get('to') ?? '').toUpperCase();
          if (from === '' || to === '') {
            sendJson(res, 400, { error: 'missing from/to' });
            return;
          }
          if (from === to) {
            sendJson(res, 200, { from, to, rate: 1 });
            return;
          }
          const key = `${from}->${to}`;
          const cached = fxCache.get(key);
          if (cached !== undefined) {
            sendJson(res, 200, { from, to, rate: cached });
            return;
          }
          if (handlers.fetchFxRate === undefined) {
            sendJson(res, 501, { error: 'fx not configured' });
            return;
          }
          const rate = await handlers.fetchFxRate(from, to);
          fxCache.set(key, rate, fxTtl);
          sendJson(res, 200, { from, to, rate });
          return;
        }

        if (method === 'POST' && path === '/convert') {
          const from = url.searchParams.get('from') ?? '';
          const to = url.searchParams.get('to') ?? '';
          if (from === '' || to === '') {
            sendJson(res, 400, { error: 'missing from/to' });
            return;
          }
          const bytes = await readBody(req);
          const result = await convertHandler({ bytes, from, to }, handlers.doConvert);
          res.writeHead(200, { 'content-type': 'application/octet-stream' });
          res.end(Buffer.from(result));
          return;
        }

        sendJson(res, 404, { error: 'not found' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'internal error';
        sendJson(res, 500, { error: message });
      }
    })();
  });
}
