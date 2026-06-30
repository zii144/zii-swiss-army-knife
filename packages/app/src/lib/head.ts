import type { HeadMeta } from './seo';
import { SITE_NAME } from './seo';

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

/**
 * Apply route metadata to the live document head — title, description,
 * canonical, hreflang alternates, Open Graph / Twitter, JSON-LD, and the
 * <html lang> attribute. Keeps the SPA's head in sync with the SSR output.
 */
export function applyHead(meta: HeadMeta): void {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = meta.htmlLang;
  document.title = meta.title;

  setMeta('name', 'description', meta.description);
  setLink('canonical', meta.canonical);

  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', meta.canonical);
  setMeta('property', 'og:locale', meta.htmlLang.replace('-', '_'));
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);

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
