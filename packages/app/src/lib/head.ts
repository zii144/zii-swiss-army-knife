import type { HeadMeta } from './seo';
import {
  SITE_IMAGE_HEIGHT,
  SITE_IMAGE_PATH,
  SITE_IMAGE_TYPE,
  SITE_IMAGE_WIDTH,
  SITE_NAME,
  SITE_ORIGIN,
} from './seo';

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string): HTMLLinkElement {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
}

function removeMeta(attr: 'name' | 'property', key: string): void {
  for (const el of document.head.querySelectorAll(`meta[${attr}="${key}"]`)) el.remove();
}

/** Drop every hreflang alternate — used by routes that have no localized twin. */
function clearAlternates(): void {
  for (const el of document.head.querySelectorAll('link[rel="alternate"][hreflang]')) el.remove();
}

/** Keep LLM / machine-readable discovery links present after SPA navigations. */
function setTypedAlternate(type: string, href: string, title: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][type="${type}"]:not([hreflang])`,
  );
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('type', type);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  el.setAttribute('title', title);
}

/**
 * Apply route metadata to the live document head — title, description,
 * canonical, hreflang alternates, Open Graph / Twitter, JSON-LD, and the
 * <html lang> attribute. Keeps the SPA's head in sync with the SSR output.
 */
export function applyHead(meta: HeadMeta): void {
  if (typeof document === 'undefined') return;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : SITE_ORIGIN;
  const image = `${origin}${SITE_IMAGE_PATH}`;

  document.documentElement.lang = meta.htmlLang;
  document.title = meta.title;

  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords.join(', '));
  setMeta('name', 'robots', meta.robots);
  setMeta('name', 'application-name', SITE_NAME);

  // An empty canonical means "this route has no indexable address" (unknown
  // paths). Pointing it at the home page instead is the soft-404 signal we are
  // avoiding, so the tag — and og:url, which crawlers read the same way — goes.
  if (meta.canonical) {
    setLink('canonical', meta.canonical);
    setMeta('property', 'og:url', meta.canonical);
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    removeMeta('property', 'og:url');
  }

  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:locale', meta.htmlLang.replace('-', '_'));
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:type', SITE_IMAGE_TYPE);
  setMeta('property', 'og:image:width', String(SITE_IMAGE_WIDTH));
  setMeta('property', 'og:image:height', String(SITE_IMAGE_HEIGHT));
  setMeta('name', 'twitter:card', 'summary');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:image', image);

  setTypedAlternate('text/plain', `${origin}/llms.txt`, 'LLMs text summary');
  setTypedAlternate('application/json', `${origin}/tools.json`, `${SITE_NAME} tool catalog`);
  setLink('search', `${origin}/opensearch.xml`);
  const searchLink = document.head.querySelector<HTMLLinkElement>('link[rel="search"]');
  if (searchLink) {
    searchLink.setAttribute('type', 'application/opensearchdescription+xml');
    searchLink.setAttribute('title', `${SITE_NAME} tools`);
  }

  if (meta.alternates.length === 0) clearAlternates();
  else for (const alt of meta.alternates) setLink('alternate', alt.href, alt.hreflang);

  setJsonLd(meta.jsonLd);
}

/**
 * Make the head hold exactly one JSON-LD block, describing the current route.
 *
 * This adopts *any* `ld+json` script rather than only the one it created, which
 * matters because the prerendered HTML ships its own. Querying just
 * `[data-zii-ld]` left those in place: every page carried the route's structured
 * data plus a stale copy that never updated on SPA navigation, so a
 * JS-rendering crawler saw a tool page still claiming to be the home page.
 */
function setJsonLd(objects: readonly object[]): void {
  const existing = document.head.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  );
  for (let i = 1; i < existing.length; i += 1) existing[i]!.remove();

  if (objects.length === 0) {
    existing[0]?.remove();
    return;
  }

  let ld = existing[0];
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    document.head.appendChild(ld);
  }
  ld.setAttribute('data-zii-ld', '');
  ld.textContent = JSON.stringify(objects.length === 1 ? objects[0] : objects);
}
