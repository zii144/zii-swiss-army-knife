// Aggregator consumed by scripts/prerender.mjs (bundled via esbuild). Keep this
// module DOM-free so it can run in plain Node during the build.

export { LANGS, HREFLANG, DICTIONARY } from './i18n';
export type { Lang } from './i18n';
export { CATALOG, CATALOG_IDS, categoryColor, localizedName, localizedBlurb } from './catalog';
export { marketLabel } from './tools';
export {
  CATEGORY_ORDER,
  categoryDescription,
  categoryKeywords,
  categoryLabel,
  presentCategories,
} from './categories';
export { iconSvg } from './icons';
export { buildPath, allRoutes } from './router';
export {
  buildHead,
  alternatesFor,
  SITE_ORIGIN,
  SITE_NAME,
  SITE_IMAGE_PATH,
  SITE_IMAGE_TYPE,
  SITE_IMAGE_WIDTH,
  SITE_IMAGE_HEIGHT,
} from './seo';
export {
  renderHomeBody,
  renderToolsBody,
  renderCategoryBody,
  renderToolBody,
  esc,
} from './prerender-view';
