# 06 — Frontend App (`@zii/app`)

The single React 19 PWA shell that composes all engines into ~318 tool screens, handles
routing, i18n, prerendering/SEO, and offline. No router library, no state library, no
i18n library, no CSS framework — each is a small hand-rolled piece.

## Entry & composition

- `src/main.tsx` — `createRoot(#root).render(<StrictMode><App/></StrictMode>)`. **React 19
  client render — NOT `hydrateRoot`.** It also registers the service worker on
  `window.load` (guarded by `'serviceWorker' in navigator`; failures are non-fatal).
- `src/App.tsx` — the single stateful component. Holds all app state in `useState`
  (`market`, `query`, `category`, `dark`, `lang`, `view`, `selected`), builds the registry
  once (`buildRegistry()` → `createRegistry()` + `registerAppTools()`), and renders one of:
  home (hero + featured deck), the lazy `ToolCatalog`, or a selected tool (with
  `ToolNav` sidebar, breadcrumbs, `ErrorBoundary`, `Suspense`).

## Routing (hand-rolled, History API)

`src/lib/router.ts` — no react-router. A `Route` is `{ locale, view, toolId, categoryId }`
with `AppView = 'home' | 'tools' | 'category' | 'tool'`.

- `parsePath(pathname)` — detects a locale prefix, then interprets `/tools/category/{id}`,
  `/tools/{id}`, `/tools`, or home. Default locale `en`.
- `buildPath(locale, view, routeId)` — canonical URL builder.
- `allRoutes(toolIds, categoryIds)` — enumerates every route across all locales; consumed
  by the prerenderer and sitemap.

**Runtime navigation** is a `go()` helper in `App.tsx` that sets React state and calls
`window.history.pushState`; a `popstate` listener maps browser back/forward back into
state. Hovering/focusing a tool card calls `prefetchTool(id)` to pre-warm its code-split
chunk. The URL scheme:

```
/{locale}                         # marketing home + featured deck
/{locale}/tools                   # searchable catalog (market filter + category chips)
/{locale}/tools/category/{cat}    # a single category page (sub-grouped)
/{locale}/tools/{tool-id}         # an individual tool screen
```

## Prerender / SSG / hydration model

The static HTML is produced by **string templating, not React SSR**, and the client does
**not hydrate** — it discards the prerendered `#root` and client-renders a fresh tree
(matched by re-deriving the route from the URL). The prerendered HTML exists for crawlers,
LLM bots, no-JS clients, and fast first paint.

Pipeline (the `build` script):
1. `vite build` → SPA + `.vite/manifest.json`.
2. `check-bundle.mjs` → budget gate (128 KB gz).
3. `vite build --ssr src/lib/prerender-entry.ts` → a **DOM-free** Node bundle
   (`prerender-entry.ts` re-exports the pure locale/SEO/catalog/render helpers).
4. `scripts/prerender.mjs` → for every route, emit `dist/{path}/index.html` with a
   localized `<head>` (via `buildHead`) and a real crawlable body (via the
   `render{Home,Tools,Category,Tool}Body` string functions in
   `src/lib/prerender-view.ts`, which mirror the React components and emit real
   `<a href>` links). ~1,470 localized pages.
5. `stamp-sw.mjs` → fingerprint the service-worker cache name.

At runtime, `src/lib/head.ts` `applyHead()` keeps the document `<head>` and `<html lang>`
in sync across SPA navigations (title, meta, canonical, hreflang, OG/Twitter, typed
alternates to `llms.txt`/`tools.json`/`opensearch.xml`, and one JSON-LD `<script>`),
driven from an `App.tsx` `useEffect`.

## Internationalization (8 UI languages)

`src/lib/i18n.ts` — a dependency-free scaffold ("intentionally no i18next"):
- `Lang` = `en | zh-TW | zh-HK | ja | ko | es | fr | de`; `LANGS` array; `LANG_LABELS`
  (native names); `HREFLANG` (BCP-47 codes).
- `Dict` types every chrome string; `DICTIONARY: Record<Lang, Dict>` has all 8 translated.
- `useT(lang)` returns a typed translator falling back to English.

Tool-level localization is richer and separate: per-tool `name`/`blurb` are `L10n`
(`{ en } & Partial<Record<Lang, …>>`), resolved by `localizedName`/`localizedBlurb`
(with `NAME_OVERRIDES` from `tool-names-extra.ts`). Category labels/descriptions/keywords
(`categories.ts`) and market labels (`tools.ts`) are also `L10n`. `formatToolCount`
produces localized counts (`3 個工具`, `3 個のツール`, `3개 도구`).

## Service worker / PWA / offline

Hand-rolled `public/sw.js` (~70 lines):
- **Navigations are network-first** — fetch live prerendered HTML when online, fall back
  to the cached shell (`/en/index.html` → `/index.html`) only offline. This is deliberate
  so crawlers/returning users get the correct per-route HTML.
- **All other assets are cache-first.**
- `activate` deletes every cache whose name ≠ the current stamped one.

`scripts/stamp-sw.mjs` rewrites the `zii-shell-*` cache token with a sha256 of the sorted
`dist/assets` filenames, so **every content-changing deploy auto-busts the shell cache** —
this fixed the one real launch blocker (returning visitors stuck on a stale `index.html`
referencing now-missing hashed chunks).

`public/manifest.webmanifest`: name/short_name, `start_url: /en`, `display: standalone`,
theme `#2b66c4`, categories `[utilities, productivity, tools]`, three install **shortcuts**
(All tools, Merge PDF, QR generator), and 4 icons (svg + 192/512 + maskable-512).

## SEO / LLM-discovery assets

Generated by `scripts/prerender.mjs`, with heads/JSON-LD from `src/lib/seo.ts`
(`SITE_ORIGIN = https://zii.tools`, overridable via `ZII_ORIGIN`; social image
`icon-512.png` PNG). Files written into `dist/`:

- `sitemap.xml` — one `<url>` per route with `lastmod`/`changefreq`/`priority` + hreflang
  alternates + `x-default`.
- `robots.txt` — allows all, plus explicit stanzas for ~16 named AI crawlers; `Sitemap:`.
- `ai.txt` — AI/agent access policy (preferred source `llms.txt`, structured `tools.json`,
  privacy note).
- `llms.txt`, `llms-full.txt`, `llms/{category}.txt` — machine-readable catalog.
- `tools.json` — structured inventory (id, category, offline, markets, keywords,
  per-language name/description/URLs).
- `opensearch.xml` — browser search-box descriptor pointing at `/en/tools?q={searchTerms}`.

**JSON-LD** per page: `WebSite`+`SearchAction` always; home adds `Organization`+
`WebApplication`; a tool page emits `SoftwareApplication` (with `areaServed` Country[] from
the market→country map) + `BreadcrumbList`; a category page emits `CollectionPage`+
`ItemList`.

## The catalog UI

`src/components/ToolCatalog.tsx` (lazy-imported so its multi-language tables stay out of the
home payload):
- Header: a market `<Select>` (with flag emoji), a search `TextField`, a localized count.
- **Category chips** (`role=tablist`) — "All" + one per present category, each with icon,
  localized label, and live count.
- **Category hub** — when no category/search is active, a browsable grid of category
  *cards* (icon, count, 3 sample tool names) instead of stacking hundreds of tools.
- **Grid + sub-groups** — a focused category or a search shows the tool grid; big categories
  split into `subGroupsFor(cat, ids)` sub-sections (`subcategories.ts`).
- **Tool cards** — colored icon, "offline" badge, localized name, `prefetchTool` on
  hover/focus, staggered entrance animation.

Search/market filtering itself is delegated to `filterTools(registry, {market, query})`
(`src/lib/tools.ts` → `registry.search`), sorted by localized name.

## Component inventory

- Shell: `App.tsx`, `components/Footer.tsx`, `Clouds.tsx`, `Logo.tsx`, `ToolNav.tsx`,
  `ToolIcon.tsx`, `ToolPage.tsx`, `ErrorBoundary.tsx`, `IdTool.tsx`.
- UI primitives (`components/ui/`): `Button`, `Select` (custom dropdown), `TextField`,
  `TextArea`, `FileField`, `RangeSlider`, `Field` — re-exported via `ui/index.ts`, styled by
  `.ui-*` classes.
- Tool screens: `src/tools/*.tsx` (~318), each a thin default-export view.
- Libs (`src/lib/`): `router`, `catalog`, `categories`, `subcategories`, `tools`, `i18n`,
  `tool-names-extra`, `icons`, `seo`, `head`, `prerender-entry`, `prerender-view`,
  `regionkit`, `toolkit`, `imagekit`, `qr-payloads`, `backend`.

## Resilience

Each tool is mounted inside an `ErrorBoundary` keyed on its id: a crashing tool shows a
localized "This tool ran into a problem / Try again" panel while "the rest of the app is
unaffected." Crash telemetry is **intentionally absent** — the boundary logs to the console
only (a deliberate privacy choice).
