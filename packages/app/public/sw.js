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
/* global self, caches */
const CACHE = 'zii-shell-dev';
// Prefer concrete HTML files — bare `/` 301s to `/en` in production.
const SHELL = ['/index.html', '/en/index.html', '/manifest.webmanifest'];

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

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Network-first for navigations: serve live prerendered HTML when online.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match('/en/index.html') ?? caches.match('/index.html')),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      });
    }),
  );
});
