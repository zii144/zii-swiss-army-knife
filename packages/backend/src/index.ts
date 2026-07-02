// @zii/backend — Thin, stateless, no-retention backend services (M10).
//
// Pure, deterministic building blocks (TTL cache, gov-data adapters, a
// no-retention conversion handler) plus a minimal node:http server factory.
// The backend stores nothing about users and proxies no credentials; see
// README.md for the stateless / no-retention / external-worker model.

export { TTLCache } from './cache';
export type { Clock } from './cache';

export { transitEtaAdapter } from './adapter';
export type { GovDataAdapter, NormalizedEta, NormalizedStop } from './adapter';

export { convertHandler, describeConversion, retainedCount } from './convert';
export type { ConvertRequest, DoConvert } from './convert';

export { createGotenbergConverter, GOTENBERG_ROUTES } from './gotenberg';

export { createBackendServer } from './server';
export type { ServerHandlers } from './server';
