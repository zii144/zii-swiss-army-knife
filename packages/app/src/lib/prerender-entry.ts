// Aggregator consumed by scripts/prerender.mjs (bundled via esbuild). Keep this
// module DOM-free so it can run in plain Node during the build.

export { LANGS, HREFLANG, DICTIONARY } from './i18n';
export type { Lang } from './i18n';
export { CATALOG, CATALOG_IDS, categoryColor, localizedName, localizedBlurb } from './catalog';
export { iconSvg } from './icons';
export { buildPath, allRoutes } from './router';
export { buildHead, alternatesFor, SITE_ORIGIN, SITE_NAME } from './seo';
export { renderHomeBody, renderToolsBody, renderToolBody, esc } from './prerender-view';
