// Static prerender (SSG) for the Zii PWA.
//
// After `vite build` (the SPA) and `vite build --ssr src/lib/prerender-entry.ts`
// (a DOM-free bundle of the locale/SEO helpers), this script emits one
// crawlable index.html per locale and per tool — each with a localized <head>
// (title, description, canonical, hreflang, Open Graph, JSON-LD) and real body
// content inside #root. The SPA replaces that content on load; crawlers and
// no-JS clients keep it. It also writes sitemap.xml, robots.txt, llms.txt,
// llms-full.txt, category LLM indexes, tools.json, and opensearch.xml.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..');
const DIST = resolve(appDir, process.env.ZII_DIST ?? 'dist');
const SSR = resolve(appDir, process.env.ZII_SSR ?? 'dist-ssr');

const mod = await import(pathToFileURL(join(SSR, 'prerender-entry.js')).href);
const {
  LANGS,
  HREFLANG,
  CATALOG,
  CATALOG_IDS,
  categoryDescription,
  categoryKeywords,
  buildPath,
  allRoutes,
  buildHead,
  localizedName,
  localizedBlurb,
  categoryLabel,
  presentCategories,
  renderHomeBody,
  renderToolsBody,
  renderCategoryBody,
  renderToolBody,
  esc,
  SITE_ORIGIN,
  SITE_NAME,
  DICTIONARY,
} = mod;

const ORIGIN = (process.env.ZII_ORIGIN ?? SITE_ORIGIN).replace(/\/$/, '');
const CATEGORY_IDS = presentCategories(CATALOG.map((t) => t.category));

const template = await readFile(join(DIST, 'index.html'), 'utf8');

// Pull the hashed asset tags Vite injected (module script + stylesheet + preloads).
const assetTags = [
  ...template.matchAll(/<script\b[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/g),
  ...template.matchAll(/<link\b[^>]*href="\/assets\/[^"]+"[^>]*>/g),
]
  .map((m) => m[0])
  .join('\n    ');

function headTags(m) {
  const alts = m.alternates
    .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" />`)
    .join('\n    ');
  const ogAlts = m.alternates
    .filter((a) => a.hreflang !== 'x-default' && a.hreflang !== m.htmlLang)
    .map((a) => `<meta property="og:locale:alternate" content="${a.hreflang.replace('-', '_')}" />`)
    .join('\n    ');
  const ld = m.jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ');
  return `<title>${esc(m.title)}</title>
    <meta name="description" content="${esc(m.description)}" />
    <meta name="keywords" content="${esc(m.keywords.join(', '))}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="application-name" content="${esc(SITE_NAME)}" />
    <link rel="canonical" href="${esc(m.canonical)}" />
    <link rel="alternate" type="text/plain" href="${ORIGIN}/llms.txt" title="LLMs text summary" />
    <link rel="alternate" type="application/json" href="${ORIGIN}/tools.json" title="${esc(SITE_NAME)} tool catalog" />
    <link rel="search" type="application/opensearchdescription+xml" href="${ORIGIN}/opensearch.xml" title="${esc(SITE_NAME)} tools" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:title" content="${esc(m.title)}" />
    <meta property="og:description" content="${esc(m.description)}" />
    <meta property="og:url" content="${esc(m.canonical)}" />
    <meta property="og:locale" content="${m.htmlLang.replace('-', '_')}" />
    <meta property="og:image" content="${ORIGIN}/icon.svg" />
    <meta property="og:image:type" content="image/svg+xml" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(m.title)}" />
    <meta name="twitter:description" content="${esc(m.description)}" />
    <meta name="twitter:image" content="${ORIGIN}/icon.svg" />
    ${alts}
    ${ogAlts}
    ${ld}`;
}

function page(htmlLang, head, body) {
  return `<!doctype html>
<html lang="${htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2b66c4" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />
    ${head}
    ${assetTags}
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
</html>
`;
}

async function emit(relPath, html) {
  const out = join(DIST, relPath, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, 'utf8');
  return out;
}

const routes = allRoutes(CATALOG_IDS, CATEGORY_IDS);
let count = 0;
for (const { locale, view, toolId, categoryId } of routes) {
  const routeId = toolId ?? categoryId;
  const head = buildHead(ORIGIN, locale, view, routeId);
  const body =
    view === 'tool'
      ? renderToolBody(locale, toolId)
      : view === 'category'
        ? renderCategoryBody(locale, categoryId)
        : view === 'tools'
          ? renderToolsBody(locale)
          : renderHomeBody(locale);
  await emit(buildPath(locale, view, routeId), page(head.htmlLang, headTags(head), body));
  count += 1;
}

// Root: serve the English home, canonical to /en.
const enHead = buildHead(ORIGIN, 'en', 'home', null);
await writeFile(
  join(DIST, 'index.html'),
  page('en', headTags(enHead), renderHomeBody('en')),
  'utf8',
);

// sitemap.xml with hreflang alternates per URL.
const urls = routes
  .map(({ locale, view, toolId, categoryId }) => {
    const routeId = toolId ?? categoryId;
    const loc = ORIGIN + buildPath(locale, view, routeId);
    const alts = LANGS.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${ORIGIN + buildPath(l, view, routeId)}" />`,
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN + buildPath('en', view, routeId)}" />`;
    return `  <url>\n    <loc>${loc}</loc>\n${alts}\n${xDefault}\n  </url>`;
  })
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

const opensearch = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${esc(SITE_NAME)} tools</ShortName>
  <Description>${esc(DICTIONARY.en.heroSubtitle)}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="16" width="16" type="image/svg+xml">${ORIGIN}/icon.svg</Image>
  <Url type="text/html" template="${ORIGIN + buildPath('en', 'tools')}?q={searchTerms}" />
  <Url type="application/json" template="${ORIGIN}/tools.json" />
</OpenSearchDescription>
`;
await writeFile(join(DIST, 'opensearch.xml'), opensearch, 'utf8');

await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  'utf8',
);

// llms.txt — machine-readable site summary for LLM crawlers.
const llms = `# ${SITE_NAME} — Swiss Army Knife

> ${DICTIONARY.en.heroSubtitle}

All tools run entirely in the browser (WebAssembly), offline-first, with no
uploads, no accounts, and no server-side data retention. Available in
${LANGS.length} languages: ${LANGS.join(', ')}.

## Tools
${CATALOG.map((t) => `- [${localizedName(t.id, 'en')}](${ORIGIN + buildPath('en', 'tool', t.id)}): ${localizedBlurb(t.id, 'en')}`).join('\n')}

## Categories
${CATEGORY_IDS.map((cat) => `- [${categoryLabel(cat, 'en')} tools](${ORIGIN + buildPath('en', 'category', cat)}): ${categoryDescription(cat)} LLM index: ${ORIGIN}/llms/${cat}.txt`).join('\n')}

## Data
- ${ORIGIN}/llms-full.txt — expanded tool catalog with categories, keywords, and localized URLs.
- ${ORIGIN}/tools.json — structured JSON inventory for agents and search systems.
- ${ORIGIN}/opensearch.xml — OpenSearch descriptor for tool search.

## Languages
${LANGS.map((l) => `- ${ORIGIN + buildPath(l, 'home')}`).join('\n')}
- ${ORIGIN + buildPath('en', 'tools')} (tools index)
`;
await writeFile(join(DIST, 'llms.txt'), llms, 'utf8');
await mkdir(join(DIST, 'llms'), { recursive: true });

const categoryGroups = Array.from(new Set(CATALOG.map((t) => t.category)))
  .map((category) => {
    const tools = CATALOG.filter((t) => t.category === category);
    return `### ${categoryLabel(category, 'en')}
${tools
  .map(
    (t) =>
      `- ${localizedName(t.id, 'en')} (${ORIGIN + buildPath('en', 'tool', t.id)}): ${localizedBlurb(t.id, 'en')} Keywords: ${t.keywords.join(', ')}.`,
  )
  .join('\n')}`;
  })
  .join('\n\n');

const llmsFull = `# ${SITE_NAME} — full tool catalog for LLMs

${DICTIONARY.en.heroSubtitle}

## Site Facts
- Canonical origin: ${ORIGIN}
- Primary tools index: ${ORIGIN + buildPath('en', 'tools')}
- Structured inventory: ${ORIGIN}/tools.json
- Sitemap: ${ORIGIN}/sitemap.xml
- Privacy model: tools run in the browser; files and text are processed locally; no account is required.
- Offline model: most tools are available offline after the web app has loaded.
- Supported languages: ${LANGS.map((l) => `${l} (${HREFLANG[l]})`).join(', ')}

## Categories
${categoryGroups}

## Localized Entrypoints
${LANGS.map((l) => `- ${l}: ${ORIGIN + buildPath(l, 'home')} / ${ORIGIN + buildPath(l, 'tools')}`).join('\n')}
`;
await writeFile(join(DIST, 'llms-full.txt'), llmsFull, 'utf8');

for (const category of CATEGORY_IDS) {
  const categoryTools = CATALOG.filter((t) => t.category === category);
  const categoryText = `# ${SITE_NAME} — ${categoryLabel(category, 'en')} tools

${categoryDescription(category)}

Canonical category page: ${ORIGIN + buildPath('en', 'category', category)}
Keywords: ${categoryKeywords(category).join(', ')}

## Tools
${categoryTools
  .map(
    (t) =>
      `- [${localizedName(t.id, 'en')}](${ORIGIN + buildPath('en', 'tool', t.id)}): ${localizedBlurb(t.id, 'en')} Keywords: ${t.keywords.join(', ')}.`,
  )
  .join('\n')}

## Localized Category URLs
${LANGS.map((lang) => `- ${lang}: ${ORIGIN + buildPath(lang, 'category', category)}`).join('\n')}
`;
  await writeFile(join(DIST, 'llms', `${category}.txt`), categoryText, 'utf8');
}

const toolsJson = {
  name: SITE_NAME,
  description: DICTIONARY.en.heroSubtitle,
  origin: ORIGIN,
  sitemap: `${ORIGIN}/sitemap.xml`,
  llms: {
    summary: `${ORIGIN}/llms.txt`,
    full: `${ORIGIN}/llms-full.txt`,
    categories: Object.fromEntries(
      CATEGORY_IDS.map((category) => [category, `${ORIGIN}/llms/${category}.txt`]),
    ),
  },
  categories: CATEGORY_IDS.map((category) => ({
    id: category,
    name: Object.fromEntries(LANGS.map((lang) => [lang, categoryLabel(category, lang)])),
    description: categoryDescription(category),
    keywords: categoryKeywords(category),
    toolCount: CATALOG.filter((tool) => tool.category === category).length,
    urls: Object.fromEntries(
      LANGS.map((lang) => [lang, ORIGIN + buildPath(lang, 'category', category)]),
    ),
    llmsUrl: `${ORIGIN}/llms/${category}.txt`,
  })),
  languages: LANGS.map((lang) => ({
    lang,
    hreflang: HREFLANG[lang],
    homeUrl: ORIGIN + buildPath(lang, 'home'),
    toolsUrl: ORIGIN + buildPath(lang, 'tools'),
  })),
  tools: CATALOG.map((tool) => ({
    id: tool.id,
    category: tool.category,
    categoryName: categoryLabel(tool.category, 'en'),
    offline: tool.offline,
    markets: tool.markets ?? ['global'],
    keywords: tool.keywords,
    name: Object.fromEntries(LANGS.map((lang) => [lang, localizedName(tool.id, lang)])),
    description: Object.fromEntries(LANGS.map((lang) => [lang, localizedBlurb(tool.id, lang)])),
    urls: Object.fromEntries(
      LANGS.map((lang) => [lang, ORIGIN + buildPath(lang, 'tool', tool.id)]),
    ),
  })),
};
await writeFile(join(DIST, 'tools.json'), `${JSON.stringify(toolsJson, null, 2)}\n`, 'utf8');

console.log(
  `prerender: ${count} localized pages + root, sitemap.xml, robots.txt, llms.txt, llms-full.txt, category llms, tools.json, opensearch.xml → ${DIST}`,
);
