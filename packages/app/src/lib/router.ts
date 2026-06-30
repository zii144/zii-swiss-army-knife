import { LANGS, type Lang } from './i18n';

/** Default locale used when the URL has no recognizable locale prefix. */
export const DEFAULT_LOCALE: Lang = 'en';

export interface Route {
  locale: Lang;
  /** Selected tool id, or null for the home/catalog view. */
  toolId: string | null;
}

const LANG_SET = new Set<string>(LANGS);

/** Parse a pathname like `/ja/tools/pdf-merge` into a {locale, toolId}. */
export function parsePath(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean);
  let locale: Lang = DEFAULT_LOCALE;
  let rest = parts;
  if (parts.length > 0 && LANG_SET.has(parts[0]!)) {
    locale = parts[0] as Lang;
    rest = parts.slice(1);
  }
  const toolId = rest[0] === 'tools' && rest[1] ? rest[1] : null;
  return { locale, toolId };
}

/** Build a canonical path for a locale + optional tool. */
export function buildPath(locale: Lang, toolId: string | null): string {
  return toolId ? `/${locale}/tools/${toolId}` : `/${locale}`;
}

/** Every route that exists, used by the prerenderer and sitemap. */
export function allRoutes(toolIds: readonly string[]): Route[] {
  const routes: Route[] = [];
  for (const locale of LANGS) {
    routes.push({ locale, toolId: null });
    for (const toolId of toolIds) routes.push({ locale, toolId });
  }
  return routes;
}
