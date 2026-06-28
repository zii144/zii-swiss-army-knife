# @zii/backend

Thin, **stateless**, **no-retention** backend services for the Zii utility suite
(Module M10). The backend exists only to do the few things a privacy-first
client genuinely cannot do itself; it is deliberately small and forgettable.

## Principles

- **Stateless / no-retention.** Requests are processed in-memory and the result
  is returned; inputs and outputs are never written to disk and never held at
  module scope. The conversion path exposes `retainedCount()` which is always
  `0` — a structural invariant enforced by tests. The only in-memory state is a
  short-TTL cache of **normalized, non-credential** open-data responses
  (`TTLCache`), which self-expires.
- **Gov-auth is never proxied.** Government authentication / login flows are
  never tunneled through this backend. The client **deep-links** to the official
  site so credentials only ever touch the user and the issuing authority.
- **Heavy conversion runs as external workers.** Document conversion uses
  **LibreOffice / Gotenberg**, and media conversion uses **LGPL `ffmpeg`**.
  These are run as **external workers**, not bundled into this package. The
  `convertHandler` simply streams bytes through an injected `doConvert` worker.

## Surface

- `TTLCache<T>` — in-memory cache with per-entry TTL and an **injectable clock**
  (`now()`), so expiry is unit-tested without real timers.
- `GovDataAdapter` + `transitEtaAdapter` — the proxy/cache adapter pattern: a
  pure `normalize(raw)` that turns a messy upstream payload into a uniform shape.
- `convertHandler(req, doConvert)` — no-retention byte conversion pass-through.
- `createBackendServer(handlers)` — a minimal `node:http` factory routing
  `GET /eta` and `POST /convert`. It is returned un-started; the deployment
  layer decides when to `listen()`.
