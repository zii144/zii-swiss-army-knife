// Browser-safe entry point (no fs). The fs-based validator lives in ./validate.
export {
  MarketSchema,
  UnitsSchema,
  LocalePackSchema,
  parseLocalePack,
  safeParseLocalePack,
} from './schema';
export type { Market, LocalePack } from './schema';
export { LocaleStore, createLocaleStore, FALLBACK } from './store';
export type { FetchLike, FetchResponse } from './store';
