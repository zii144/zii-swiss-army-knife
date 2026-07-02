import { LANGS, type Lang } from './i18n';

/** Default locale used when the URL has no recognizable locale prefix. */
export const DEFAULT_LOCALE: Lang = 'en';

export type AppView = 'home' | 'tools' | 'tool';

export interface Route {
  locale: Lang;
  view: AppView;
  /** Selected tool id when `view === 'tool'`. */
  toolId: string | null;
}

const LANG_SET = new Set<string>(LANGS);

/** Parse a pathname like `/ja/tools/pdf-merge` into locale + view + optional tool. */
export function parsePath(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean);
  let locale: Lang = DEFAULT_LOCALE;
  let rest = parts;
  if (parts.length > 0 && LANG_SET.has(parts[0]!)) {
    locale = parts[0] as Lang;
    rest = parts.slice(1);
  }
  if (rest[0] === 'tools') {
    if (rest[1]) return { locale, view: 'tool', toolId: rest[1] };
    return { locale, view: 'tools', toolId: null };
  }
  return { locale, view: 'home', toolId: null };
}

/** Build a canonical path for a locale + view (+ tool when applicable). */
export function buildPath(locale: Lang, view: AppView, toolId?: string | null): string {
  if (view === 'tool' && toolId) return `/${locale}/tools/${toolId}`;
  if (view === 'tools') return `/${locale}/tools`;
  return `/${locale}`;
}

/** Every route that exists, used by the prerenderer and sitemap. */
export function allRoutes(toolIds: readonly string[]): Route[] {
  const routes: Route[] = [];
  for (const locale of LANGS) {
    routes.push({ locale, view: 'home', toolId: null });
    routes.push({ locale, view: 'tools', toolId: null });
    for (const toolId of toolIds) routes.push({ locale, view: 'tool', toolId });
  }
  return routes;
}
