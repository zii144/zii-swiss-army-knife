import { LANGS, type Lang } from './i18n';
import { CATEGORY_ORDER } from './categories';
import { CATALOG_IDS } from './catalog';

/** Default locale used when the URL has no recognizable locale prefix. */
export const DEFAULT_LOCALE: Lang = 'en';

export type AppView = 'home' | 'tools' | 'category' | 'tool' | 'notfound';

export interface Route {
  locale: Lang;
  view: AppView;
  /** Selected tool id when `view === 'tool'`. */
  toolId: string | null;
  /** Selected category id when `view === 'category'`. */
  categoryId: string | null;
}

const LANG_SET = new Set<string>(LANGS);
const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);
const TOOL_SET = new Set<string>(CATALOG_IDS);

/**
 * Parse a pathname like `/ja/tools/pdf-merge` into locale + view + optional route id.
 *
 * Route ids are validated against the catalogue rather than trusted. The host
 * rewrites every unmatched path to `index.html`, so without this check any URL
 * — `/en/tools/buy-cheap-things` — would render as a tool page whose title and
 * heading are the raw path segment, marked `index, follow` with a
 * self-referencing canonical. Unknown paths resolve to `notfound`, which the
 * shell renders as a real "not found" page and `buildHead` marks `noindex`.
 */
export function parsePath(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean);
  let locale: Lang = DEFAULT_LOCALE;
  let rest = parts;
  if (parts.length > 0 && LANG_SET.has(parts[0]!)) {
    locale = parts[0] as Lang;
    rest = parts.slice(1);
  }
  const notFound: Route = { locale, view: 'notfound', toolId: null, categoryId: null };
  if (rest.length === 0) return { locale, view: 'home', toolId: null, categoryId: null };
  if (rest[0] !== 'tools') return notFound;
  if (rest.length === 1) return { locale, view: 'tools', toolId: null, categoryId: null };
  if (rest[1] === 'category') {
    if (rest.length === 3 && rest[2] && CATEGORY_SET.has(rest[2])) {
      return { locale, view: 'category', toolId: null, categoryId: rest[2] };
    }
    return notFound;
  }
  if (rest.length === 2 && rest[1] && TOOL_SET.has(rest[1])) {
    return { locale, view: 'tool', toolId: rest[1], categoryId: null };
  }
  return notFound;
}

/** Build a canonical path for a locale + view (+ route id when applicable). */
export function buildPath(locale: Lang, view: AppView, routeId?: string | null): string {
  if (view === 'tool' && routeId) return `/${locale}/tools/${routeId}`;
  if (view === 'category' && routeId) return `/${locale}/tools/category/${routeId}`;
  if (view === 'tools') return `/${locale}/tools`;
  return `/${locale}`;
}

/** Every route that exists, used by the prerenderer and sitemap. */
export function allRoutes(
  toolIds: readonly string[],
  categoryIds: readonly string[] = [],
): Route[] {
  const routes: Route[] = [];
  for (const locale of LANGS) {
    routes.push({ locale, view: 'home', toolId: null, categoryId: null });
    routes.push({ locale, view: 'tools', toolId: null, categoryId: null });
    for (const categoryId of categoryIds) {
      routes.push({ locale, view: 'category', toolId: null, categoryId });
    }
    for (const toolId of toolIds) routes.push({ locale, view: 'tool', toolId, categoryId: null });
  }
  return routes;
}
