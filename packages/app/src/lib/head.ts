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
  setMeta('name', 'robots', 'index, follow, max-image-preview:large');
  setMeta('name', 'application-name', SITE_NAME);
  setLink('canonical', meta.canonical);

  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', meta.canonical);
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

  for (const alt of meta.alternates) setLink('alternate', alt.href, alt.hreflang);

  let ld = document.head.querySelector<HTMLScriptElement>('script[data-zii-ld]');
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.setAttribute('data-zii-ld', '');
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify(meta.jsonLd.length === 1 ? meta.jsonLd[0] : meta.jsonLd);
}
