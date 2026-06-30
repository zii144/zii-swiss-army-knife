// Static prerender (SSG) for the Zii PWA.
//
// After `vite build` (the SPA) and `vite build --ssr src/lib/prerender-entry.ts`
// (a DOM-free bundle of the locale/SEO helpers), this script emits one
// crawlable index.html per locale and per tool — each with a localized <head>
// (title, description, canonical, hreflang, Open Graph, JSON-LD) and real body
// content inside #root. The SPA replaces that content on load; crawlers and
// no-JS clients keep it. It also writes sitemap.xml, robots.txt and llms.txt.

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
  CATALOG,
  CATALOG_IDS,
  buildPath,
  allRoutes,
  buildHead,
  localizedName,
  localizedBlurb,
  renderHomeBody,
  renderToolBody,
  esc,
  SITE_ORIGIN,
  SITE_NAME,
  DICTIONARY,
} = mod;

const ORIGIN = (process.env.ZII_ORIGIN ?? SITE_ORIGIN).replace(/\/$/, '');

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
  const ld = m.jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ');
  return `<title>${esc(m.title)}</title>
    <meta name="description" content="${esc(m.description)}" />
    <link rel="canonical" href="${esc(m.canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:title" content="${esc(m.title)}" />
    <meta property="og:description" content="${esc(m.description)}" />
    <meta property="og:url" content="${esc(m.canonical)}" />
    <meta property="og:locale" content="${m.htmlLang.replace('-', '_')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(m.title)}" />
    <meta name="twitter:description" content="${esc(m.description)}" />
    ${alts}
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

const routes = allRoutes(CATALOG_IDS);
let count = 0;
for (const { locale, toolId } of routes) {
  const head = buildHead(ORIGIN, locale, toolId);
  const body = toolId ? renderToolBody(locale, toolId) : renderHomeBody(locale);
  await emit(buildPath(locale, toolId), page(head.htmlLang, headTags(head), body));
  count += 1;
}

// Root: serve the English home, canonical to /en.
const enHead = buildHead(ORIGIN, 'en', null);
await writeFile(
  join(DIST, 'index.html'),
  page('en', headTags(enHead), renderHomeBody('en')),
  'utf8',
);

// sitemap.xml with hreflang alternates per URL.
const urls = routes
  .map(({ locale, toolId }) => {
    const loc = ORIGIN + buildPath(locale, toolId);
    const alts = LANGS.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN + buildPath(l, toolId)}" />`,
    ).join('\n');
    return `  <url>\n    <loc>${loc}</loc>\n${alts}\n  </url>`;
  })
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

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
${CATALOG.map((t) => `- [${localizedName(t.id, 'en')}](${ORIGIN + buildPath('en', t.id)}): ${localizedBlurb(t.id, 'en')}`).join('\n')}

## Languages
${LANGS.map((l) => `- ${ORIGIN + buildPath(l, null)}`).join('\n')}
`;
await writeFile(join(DIST, 'llms.txt'), llms, 'utf8');

console.log(
  `prerender: ${count} localized pages + root, sitemap.xml, robots.txt, llms.txt → ${DIST}`,
);
