import { DICTIONARY, LANGS, LANG_LABELS, type Lang } from './i18n';
import { CATALOG, categoryColor, localizedBlurb, localizedName } from './catalog';
import { categoryLabel, presentCategories } from './categories';
import { categoryIconSvg, iconSvg } from './icons';
import { buildPath } from './router';

/** Minimal HTML-escape for text injected into prerendered markup. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Static cloud/fog layer (mirrors the Clouds React component). */
const CLOUDS_SVG = `<div class="clouds" aria-hidden="true"><div class="clouds__layer clouds__far"><svg class="clouds__svg" viewBox="0 0 1440 900" preserveAspectRatio="none"><defs><filter id="zii-fog-far" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.013 0.02" numOctaves="3" seed="23" stitchTiles="stitch" result="n"/><feComponentTransfer in="n"><feFuncR type="linear" slope="0" intercept="1"/><feFuncG type="linear" slope="0" intercept="1"/><feFuncB type="linear" slope="0" intercept="1"/><feFuncA type="table" tableValues="0 0 0 0.15 0.5 0.85"/></feComponentTransfer><feGaussianBlur stdDeviation="1.2"/></filter><linearGradient id="zii-wisp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.12" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.34" stop-color="#fff" stop-opacity="0.45"/><stop offset="0.52" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="zii-wisp-mask"><rect x="-220" y="0" width="1880" height="900" fill="url(#zii-wisp)"/></mask></defs><rect x="-220" y="0" width="1880" height="900" filter="url(#zii-fog-far)" mask="url(#zii-wisp-mask)"/></svg></div><div class="clouds__layer clouds__near"><svg class="clouds__svg" viewBox="0 0 1440 900" preserveAspectRatio="none"><defs><filter id="zii-fog-near" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="7" stitchTiles="stitch" result="n"/><feComponentTransfer in="n"><feFuncR type="linear" slope="0" intercept="1"/><feFuncG type="linear" slope="0" intercept="1"/><feFuncB type="linear" slope="0" intercept="1"/><feFuncA type="table" tableValues="0 0 0.05 0.35 0.8 1 1"/></feComponentTransfer><feGaussianBlur stdDeviation="2"/></filter><linearGradient id="zii-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="0.72" stop-color="#fff" stop-opacity="1"/><stop offset="0.92" stop-color="#fff" stop-opacity="0.7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="zii-band-mask"><rect x="-220" y="0" width="1880" height="900" fill="url(#zii-band)"/></mask></defs><rect x="-220" y="0" width="1880" height="900" filter="url(#zii-fog-near)" mask="url(#zii-band-mask)"/></svg></div></div>`;

function toolIco(id: string, category: string): string {
  return `<span class="tool-ico" style="color:${categoryColor(category)}">${iconSvg(id, '', 18)}</span>`;
}

function nav(lang: Lang, active: 'home' | 'tools'): string {
  const d = DICTIONARY[lang];
  return `<nav class="app__nav">
    <a class="app__brand" href="${buildPath(lang, 'home')}"><span class="app__brand-mark"><svg class="zlogo" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="3.4" rx="1.2" fill="currentColor"/><rect x="5" y="15.6" width="14" height="3.4" rx="1.2" fill="currentColor"/><path d="M16.6 7 L7.4 17" stroke="#b4e636" stroke-width="3.4" stroke-linecap="round"/></svg></span>${esc(d.brand)}</a>
    <div class="app__nav-links">
      <a class="app__nav-link${active === 'home' ? ' is-active' : ''}" href="${buildPath(lang, 'home')}">${esc(d.navHome)}</a>
      <a class="app__nav-link${active === 'tools' ? ' is-active' : ''}" href="${buildPath(lang, 'tools')}">${esc(d.navTools)}</a>
    </div>
  </nav>`;
}

/** Static footer with real internal links (tools + every locale home). */
function footer(lang: Lang): string {
  const d = DICTIONARY[lang];
  const tools = CATALOG.slice(0, 6)
    .map(
      (tool) =>
        `<li><a class="footer__link" href="${buildPath(lang, 'tool', tool.id)}">${esc(localizedName(tool.id, lang))}</a></li>`,
    )
    .join('\n        ');
  const langs = LANGS.map(
    (l) =>
      `<li><a class="footer__link${l === lang ? ' is-current' : ''}" href="${buildPath(l, 'home')}">${esc(LANG_LABELS[l])}</a></li>`,
  ).join('\n        ');
  const year = new Date().getFullYear();
  return `<footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo"><span class="app__brand-mark"><svg class="zlogo" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="3.4" rx="1.2" fill="currentColor"/><rect x="5" y="15.6" width="14" height="3.4" rx="1.2" fill="currentColor"/><path d="M16.6 7 L7.4 17" stroke="#b4e636" stroke-width="3.4" stroke-linecap="round"/></svg></span><span class="footer__name">${esc(d.brand)}</span></div>
        <p class="footer__tagline">${esc(d.heroKicker)}</p>
        <p class="footer__note">${esc(d.rated)}</p>
      </div>
      <nav class="footer__col" aria-label="${esc(d.navTools)}">
        <h2 class="footer__heading">${esc(d.navTools)}</h2>
        <ul class="footer__list">
        ${tools}
        </ul>
      </nav>
      <nav class="footer__col" aria-label="${esc(d.footerLanguages)}">
        <h2 class="footer__heading">${esc(d.footerLanguages)}</h2>
        <ul class="footer__list footer__list--langs">
        ${langs}
        </ul>
      </nav>
    </div>
    <div class="footer__bar"><span>© ${year} Zii</span><span aria-hidden="true">·</span><span>${esc(d.rated)}</span></div>
  </footer>`;
}

/** A single tool card. */
function card(lang: Lang, tool: (typeof CATALOG)[number], offlineLabel: string): string {
  return `<li><a class="app__item" href="${buildPath(lang, 'tool', tool.id)}">
        <span class="app__item-top">${toolIco(tool.id, tool.category)}${tool.offline ? `<span class="app__badge">${esc(offlineLabel)}</span>` : ''}</span>
        <span class="app__item-name">${esc(localizedName(tool.id, lang))}</span>
        <span class="tool__hint">${esc(localizedBlurb(tool.id, lang))}</span>
      </a></li>`;
}

function catalogSections(lang: Lang, offlineLabel: string): string {
  const d = DICTIONARY[lang];
  const cats = presentCategories(CATALOG.map((t) => t.category));

  const chips =
    `<button class="catchip is-active">${esc(d.allCategories)}<span class="catchip__count">${CATALOG.length}</span></button>` +
    cats
      .map((cat) => {
        const n = CATALOG.filter((t) => t.category === cat).length;
        return `<button class="catchip"><span class="catchip__ico" style="color:${categoryColor(cat)}">${categoryIconSvg(cat, '', 15)}</span>${esc(categoryLabel(cat, lang))}<span class="catchip__count">${n}</span></button>`;
      })
      .join('');

  const sections = cats
    .map((cat) => {
      const items = CATALOG.filter((t) => t.category === cat);
      return `<section class="catgroup">
      <div class="catgroup__head"><span class="catgroup__ico" style="color:${categoryColor(cat)}">${categoryIconSvg(cat, '', 18)}</span><h3 class="catgroup__title">${esc(categoryLabel(cat, lang))}</h3><span class="catgroup__count">${items.length}</span></div>
      <ul class="app__list">
        ${items.map((tool) => card(lang, tool, offlineLabel)).join('\n        ')}
      </ul>
    </section>`;
    })
    .join('\n');

  return `<section class="catalog catalog--standalone" id="tools">
    <div class="catalog__head">
      <div>
        <span class="catalog__kicker">${esc(d.catalogKicker)}</span>
        <h2 class="catalog__title">${esc(d.catalogTitle)}</h2>
        <p class="catalog__subtitle">${esc(d.catalogSubtitle)}</p>
      </div>
    </div>
    <div class="catfilter">${chips}</div>
    ${sections}
  </section>`;
}

/** Static home markup for crawlers — replaced by the SPA on load. */
export function renderHomeBody(lang: Lang): string {
  const d = DICTIONARY[lang];
  const featured = CATALOG.slice(0, 8);
  const deck = featured
    .map(
      (tool) =>
        `<a class="hero__card" href="${buildPath(lang, 'tool', tool.id)}"><span class="hero__card-cat">${toolIco(tool.id, tool.category)}${esc(tool.category)}</span><span class="hero__card-name">${esc(localizedName(tool.id, lang))}</span></a>`,
    )
    .join('');

  return `<div class="app">
  ${CLOUDS_SVG}
  ${nav(lang, 'home')}
  <section class="hero">
    <span class="hero__kicker">${esc(d.heroKicker)}</span>
    <h1 class="hero__title">${esc(d.heroTitleA)}<br><span>${esc(d.heroTitleB)}</span></h1>
    <p class="hero__subtitle">${esc(d.heroSubtitle)}</p>
    <div class="hero__actions">
      <a class="hero__ghost" href="${buildPath(lang, 'tools')}">${esc(d.viewTools)}</a>
      <a class="hero__primary" href="${buildPath(lang, 'tools')}">${esc(d.getStarted)}<span class="hero__primary-dot">↗</span></a>
    </div>
    <p class="hero__rated">${esc(d.rated)}</p>
  </section>
  <div class="hero__deck"><div class="hero__deck-row">${deck}</div></div>
  <div class="hero__more">
    <a class="hero__viewall" href="${buildPath(lang, 'tools')}">${esc(d.viewAll)}<span class="hero__primary-dot" aria-hidden="true">↗</span></a>
  </div>
  ${footer(lang)}
</div>`;
}

/** Static tools listing for crawlers — replaced by the SPA on load. */
export function renderToolsBody(lang: Lang): string {
  const d = DICTIONARY[lang];
  return `<div class="app">
  ${nav(lang, 'tools')}
  ${catalogSections(lang, d.offline)}
  ${footer(lang)}
</div>`;
}

/** Static tool-page markup for crawlers — replaced by the interactive view on load. */
export function renderToolBody(lang: Lang, toolId: string): string {
  const d = DICTIONARY[lang];
  const name = localizedName(toolId, lang);
  const blurb = localizedBlurb(toolId, lang);
  const cat = CATALOG.find((t) => t.id === toolId)?.category;
  const catCrumb = cat
    ? `<a href="${buildPath(lang, 'tools')}">${esc(categoryLabel(cat, lang))}</a> / `
    : '';
  return `<div class="app">
  ${nav(lang, 'tools')}
  <main>
    <section class="tool">
      <a class="tool__back" href="${buildPath(lang, 'tools')}">← ${esc(d.back)}</a>
      <nav class="tool__crumbs" aria-label="Breadcrumb">
        <a href="${buildPath(lang, 'home')}">${esc(d.navHome)}</a> /
        <a href="${buildPath(lang, 'tools')}">${esc(d.navTools)}</a> /
        ${catCrumb}<span>${esc(name)}</span>
      </nav>
      <header class="tool__header">
        <h1 class="tool__title">${esc(name)}</h1>
        <span class="app__badge">${esc(d.offline)}</span>
      </header>
      <p class="tool__desc">${esc(blurb)}</p>
      <p class="tool__hint">${esc(d.loading)}</p>
    </section>
  </main>
  ${footer(lang)}
</div>`;
}
