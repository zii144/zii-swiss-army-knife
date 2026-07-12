# Changelog

All notable changes to this project. Format loosely follows Keep a Changelog.

## [Unreleased]

### Changed — SEO + LLM discoverability (2026-07-12)
- **Unified social / share meta** across prerender and the live SPA: PNG `icon-512.png` for Open Graph + Twitter (SVG unfurlers fail), matching card type (`summary`), image dimensions, and JSON-LD logos.
- **SPA head parity** — client `applyHead` now also injects `llms.txt` / `tools.json` / OpenSearch alternate links so client navigations stay LLM-discoverable.
- **Service worker** — navigations are network-first (correct per-route prerendered HTML online; shell only as offline fallback), so crawlers and returning users are not stuck on the root shell.
- **Canonical root** — Vercel permanently redirects `/` → `/en`; PWA `start_url` follows `/en`.
- **Discovery files** — build now emits `ai.txt`; sitemap gains `lastmod` / `changefreq` / `priority`; robots.txt welcomes additional AI crawlers; `tools.json` category descriptions are fully localized.
- **Category SEO copy** — all 12 category descriptions translated for all 8 locales (was mostly en + ja).
- **PWA manifest** — `categories`, install shortcuts (tools / PDF merge / QR), and clearer start URL.
- **Bundle budget** — raised initial gzip budget 110 → 112 KB to fit localized category SEO copy in the head/meta path.

### Fixed — Production-readiness polish: SW cache-busting, PWA icons, security headers (2026-07-11)
- **Service-worker stale-shell fix (was the one real launch blocker).** The cache name was a hardcoded `zii-shell-v2`, so any deploy that didn't manually bump it left returning visitors on a stale, cached `index.html` (and its now-missing hashed chunks). A new `scripts/stamp-sw.mjs` runs last in the app `build` and rewrites the `zii-shell-*` token with a content fingerprint of the emitted assets, so every content change auto-busts the shell cache (verified: cache name is now stamped, e.g. `zii-shell-a614bdc4b6ba`).
- **PWA install icons.** The manifest shipped only an SVG icon and there was no `apple-touch-icon` (degraded install prompts + iOS home-screen icon). Added PNG icons — `icon-192.png`, `icon-512.png`, a full-bleed square `icon-maskable-512.png` (purpose `maskable`), and a 180px `apple-touch-icon.png` — wired into the manifest, the prerendered `<head>`, and the dev template. Also switched OG/Twitter images from SVG (which social unfurlers can't render) to `icon-512.png`.
- **Security headers.** `vercel.json` now sends a Content-Security-Policy (`default-src 'self'`; `script-src 'self' 'wasm-unsafe-eval' blob:`; `worker-src 'self' blob:`; `connect-src 'self' https:` for the on-demand model/WASM CDNs; `frame-ancestors 'none'`; `object-src 'none'`), plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, a locked-down `Permissions-Policy` (camera off — nothing uses `getUserMedia`), and HSTS. **Verified in-browser** against the exact policy: the app hydrates, `WebAssembly` compiles under `'wasm-unsafe-eval'`, blob-URL workers run, the real `image-convert` WASM tool mounts, and there are zero CSP violations.
- **Heavy-tool loading hint.** Tools that pull a large lazy chunk or download a WASM codec / ML model on first use (`HEAVY_TOOLS` in `catalog.ts`) now show a fuller "fetching a larger engine…" message (8 locales) instead of a bare "Loading…", so a slow first open doesn't read as a hang. A unit test guards that every id is a real catalogue tool.
- **Repo cleanup.** Removed the superseded, unreferenced standalone `demo-app/` + `zii-demo.html`, and cleared the stray `vite.config.ts.timestamp-*.mjs` scratch files. (Crash telemetry stays intentionally absent — the `ErrorBoundary` logs to the console only, a deliberate privacy-first choice.)

### Fixed — i18n: complete Japanese tool names + localized catalog chrome (2026-07-09)
- Verified the multi-language system end-to-end: all 8 locales route, switch, and render with the correct `<html lang>`, hreflang alternates, localized titles, and CJK/accented text — 11 new Playwright specs (per-locale + the language switcher) prove it with zero runtime errors.
- **Completed Japanese tool names.** ~80 tool names had been falling back to English in Japanese (the tools added after the earlier translation batch). Added a `src/lib/tool-names-extra.ts` overlay so every tool has a Japanese name except the deliberate language-neutral ones (JSON ↔ CSV, HEIC → JPG, ROT13, Soundex…). Also finished two zh-HK region names.
- **Localized the catalog chrome.** Category pages no longer bleed English into other locales: dropped the hardcoded "… tools" H1 suffix (now the localized category label), made category descriptions locale-aware (with Japanese), localized all sub-section labels (8 languages), and localized the "{n} tools" count.
- A unit test guards Japanese coverage (only the intentional-English set may fall back). Lazy-loaded the catalogue so the added translation tables stay out of the initial payload — home bundle held at **107.1 KB gz** (110 KB budget).
- Follow-up: ko/es/fr/de tool *names* still fall back to English (UI chrome and sub-section labels are fully localized); those languages have no dedicated market pack.

### Changed — Catalog UX: category hub, sub-sections, scroll-to-top (2026-07-09)
- **`/tools` is a browsable category hub** — 12 colour-accented cards (icon, count, sample tools) instead of a 170-tool wall; picking a category or searching drops to the tool grid. (Shipped earlier; noted here for the set.)
- **Large category pages split into sub-sections** — Developer, Text, Converters, Generators, and Finance now group their tools into scannable subgroups (e.g. Developer → JSON & data formats · Encoding & escaping · Hashing & tokens · Inspect & test · Text & data utilities · Similarity & distance) via a curated `src/lib/subcategories.ts`. A unit test guards the curation (no unknown ids, no duplicates, full coverage); mirrored in the SSR prerender for first-paint/SEO parity.
- **Scroll-to-top on navigation** — clicking "View all" (or Home/Tools) from a scrolled page now lands at the top of the destination instead of mid-scroll.
- New E2E cover the hub, category drill-down, search bypass, sub-section grouping, and the scroll-to-top behaviour.

### Added — E2E: Playwright headless suite over every tool (2026-07-08)
- New Playwright suite (`packages/app/e2e/`) that runs headless against the **production build** (prerender + hydration, pre-bundled chunks, service workers blocked). `tools-smoke.spec.ts` is data-driven over `CATALOG` — it loads **all 170 tools** and asserts each mounts, renders an interactive control, isn't the "coming soon" fallback, and logs no console/page errors. `tools-functional.spec.ts` drives real inputs and asserts outputs (case convert, ROT13, Base64, slugify, area convert, tip split). Added `test:e2e` script, a dedicated preview server on `:4321`, and a separate **`e2e` CI job** (uploads the HTML report). **176/176 tests pass.**
- **Fixed a real bug the sweep caught:** `heic-convert` (HEIC → JPG) was bundling its Node-only entry (pngjs + Node streams) and crashing in the browser with *"Object prototype may only be an Object or null"*. Aliased `heic-convert` → its `<canvas>` browser build in `vite.config.ts`; the Node-side heic tests in `@zii/compute-wasm` keep the default entry.

### Added — Phase 4: Capacitor iOS + Android mobile shell (2026-07-08)
- Wrapped the offline PWA as native apps via Capacitor v8 (`appId: dev.zii.knife`, `webDir: dist`) with `mobile:sync` / `mobile:ios` / `mobile:android` scripts. Generated iOS (SPM) and Android (Gradle) native projects; native sources committed, build artifacts + copied web assets git-ignored. **iOS verified end-to-end** — `App.app` compiles (Xcode 26) and renders the full PWA in the simulator's WKWebView. Android project synced (needs an Android SDK to build). No live/gov-data tools touched — packaging layer only.

### Changed — Brand + UI polish (2026-07-08)
- **Logo redesign:** the Z's diagonal is now a folding-knife blade with a pivot rivet — a Swiss-army-knife nod to the suite's purpose. `Logo.tsx` and `public/icon.svg` kept geometrically identical so the in-app mark and favicon stay consistent. Versioned the favicon URL (`/icon.svg?v=2`) in the dev template and prerenderer, and bumped the service-worker cache (`v1 → v2`) so the redesigned tab icon replaces the cached one.
- **Background + hover motion:** added a lime sun-glow + cool counter-glow + fine soft-light grain to the sky (tuned for light/dark), and a shared hover language for the `ui/` controls — gentle lift + scale + lime ring; the select chevron flips 180° when open; arrow badges and a new file-picker `+` badge rotate 45° on hover; active menu options gain a lime rail. All motion behind `prefers-reduced-motion`.

### Added — App: market packs batch 3 — UK market + 6 tools (2026-07-01)
- Opened a new selectable **UK (`en-gb`)** market (fully-localized label) and added six more pure/offline `IdTool` validators with 8-language strings: **US Employer ID Number (EIN)** and **US phone number (NANP)** (`en-us`); **UK postcode**, **UK National Insurance number**, and **UK bank sort code** (`en-gb`); and **Taiwan postal code** (`tw`). Logic extends `src/lib/regionkit.ts` (now 16 tests; generators still round-trip through their validators). App now ships **76 tool screens**; prerender emits **616 pages**; bundle budget held (**88.0 KB gz** initial). Scoping test now also covers `en-gb`.

### Added — App: market packs batch 2 — 6 region tools (2026-07-01)
- Six more region-scoped validators, all pure/offline and using the shared `IdTool` (validate + generate) with fully-localized 8-language strings: **US Social Security Number**, **US ZIP code**, **US bank routing number (ABA)** (`en-us` — previously had no tools), **Japan postal code** (`jp`), **Hong Kong phone number** (`hk`), and **Taiwan mobile number** (`tw`). Logic lives in a new tested `src/lib/regionkit.ts` (10 tests; generators round-trip through their validators). App now ships **70 tool screens**; prerender emits **568 pages**; bundle budget held (**87.0 KB gz** initial). The market-scoping test now also covers `en-us`.

### Added — App: full 8-language tool names (2026-07-01)
- Every tool's display name is now translated into all eight UI languages (en, zh-TW, zh-HK, ja, ko, es, fr, de). Previously ~48 tools had only English + Traditional Chinese, so the sidebar, grid, breadcrumb and page `<title>` fell back to English in Japanese/Korean/European locales. Language-neutral format names (JSON ↔ CSV, JSON ↔ YAML, XML ↔ JSON, CSV ↔ Excel, HEIC → JPG) are intentionally left untranslated since they render identically everywhere. Verified across the 520 prerendered pages (e.g. Japanese now shows 関数電卓, パスワード生成, PDF を回転).

### Fixed — App: in-tool sidebar no longer remounts on tool switch (2026-07-01)
- The route-remount `key` was on the workspace wrapper that contains **both** the sidebar (`ToolNav`) and the tool panel, so switching tools tore down and rebuilt the whole subtree — the sidebar flickered/re-animated and lost its scroll position. Moved the `key` onto `<main>` only: the sidebar now stays mounted and calm (keeps scroll position, just updates its active row) while the tool content still remounts and re-animates.
- Made `ToolNav` app-level consistent: category headers now use localized `categoryLabel(...)` (matching the home sections) instead of raw category ids, and items gained the standard `:focus-visible` lime ring used by the other UI components.
- Replaced the sidebar's native Chromium/WebKit scrollbar with a themed thin, rounded, semi-transparent thumb on a transparent track (plus Firefox `scrollbar-width`/`scrollbar-color`), via new `--scrollbar-thumb` / `--scrollbar-thumb-hover` tokens for light and dark.

### Added — P0 launch readiness + P3 market packs (2026-07-01)
- **P3 — market locale packs scaffolded (all four markets):** the catalogue now supports a per-tool `markets` field, wired through `metaFor` into the registry's market filter (a tool shows when its region is selected, or always if `global`). Five region-specific validators ship on the `@zii/id` engine: **Taiwan National ID** and **Taiwan business number (統一編號)** (`tw`), **Hong Kong ID / HKID** (`hk`), **Japan My Number** and **Japan Corporate / Invoice №** (`jp`) — all on-device, most with a "generate sample" helper via the new shared `IdTool` component. App now ships **64 tool screens**; prerender emits **520 pages**; bundle budget held (**83.1 KB gz** initial). New tests assert market packs are scoped to their region and don't leak across markets.
- **P0 — deploy readiness (Vercel):** added root [`vercel.json`](./vercel.json) (pnpm install, `pnpm --filter @zii/app build`, output `packages/app/dist`, `cleanUrls`, SPA-fallback rewrite, immutable caching for hashed `/assets/**`, revalidating `sw.js`) and [`DEPLOY.md`](./DEPLOY.md) documenting the Vercel setup, the `ZII_ORIGIN` env var for canonical URLs, the build pipeline, and Netlify/Cloudflare equivalents. Added a `preview` script to `@zii/app`.

### Added — App: Phase 2 Batch 8 — dependency-backed tools (2026-07-01)
- The previously-deferred tools, now that their libraries are installed: **XML ↔ JSON** (`fast-xml-parser`), **CSV ↔ Excel** (`xlsx`/SheetJS), **Barcode generator** (`bwip-js`, SVG output), **Image → text OCR** (`tesseract.js`), and **Remove background** (`@imgly/background-removal`). App now ships **59 tool screens**.
- OCR and background-remove are flagged `offline: false` ("model downloads on first use"); every heavy library stays in its own lazy chunk so the **initial bundle budget still holds (82 KB gz)**. Prerender emits 480 pages. This completes the Phase 2 universal catalogue.

### Added — App: Phase 2 Batch 7 — CJK / calendar tools (2026-07-01)
- Five more tools off the built `@zii/text` and `@zii/calendar` engines (no new deps): **Chinese converter** (Simplified↔Traditional, Taiwan idioms via OpenCC), **HTML entities** (escape/unescape), **Lunar calendar** (Gregorian→農曆, leap-aware, 干支/生肖), **Rokuyō 六曜**, and **Solar terms 二十四節氣** (24 terms + dates for a year). App now ships **54 tool screens**; budget held (~82 KB gz); prerender 440 pages.

### Added — App: Phase 2 Batch 6 — 5 tools surfacing built engines (2026-07-01)
- Wired three engine packages that were built but unused in the app: **Checksum validator** (Luhn / IBAN / ABA, `@zii/id`), **Sales tax / VAT / GST** (`@zii/payroll`), **Business days** + **Era converter** (ROC/Minguo + Japanese era) + **Chinese zodiac** (`@zii/calendar`). App now ships **49 tool screens**; new Identity + Everyday category sections; budget held (~81 KB gz); prerender 400 pages.
- Added `@zii/calendar`, `@zii/id`, `@zii/payroll` as `@zii/app` workspace deps (run `pnpm install` to regenerate the lockfile).

### Added — App: Phase 2 Batches 2–5 — 16 more tools (2026-07-01)
- **Batch 2 (dev/generators, no deps):** Password generator, UUID generator, JWT decoder, Number base converter, Color converter, Cron explainer — pure logic in a new tested `src/lib/toolkit.ts`.
- **Batch 3 (image, Canvas-based, no deps):** Resize image (with presets), Crop image, Strip image metadata (EXIF), Favicon generator — via a new browser `src/lib/imagekit.ts`.
- **Batch 4 (PDF, via bundled pdf-lib):** Rotate PDF, Watermark PDF, Organize PDF pages (reorder/delete), Add page numbers — new wrappers in `@zii/compute-wasm/pdf` (`rotatePdf`, `watermarkPdf`, `organizePdf`, `addPageNumbers`).
- **Batch 5 (dep-free part):** Scientific calculator (hand-rolled safe expression evaluator, no `eval`) and Time-zone planner (`Intl`).
- App now ships **44 tool screens**; bundle budget held (~80 KB gz initial); prerender emits 360 localized pages; 26 unit tests. Deferred (need new deps, tracked in `docs/PHASE-2-PLAN.md`): XML↔JSON, CSV↔Excel, barcode, OCR, background-remove, live-FX currency.

### Added — App: Phase 2 Batch 1 — 7 more tools (2026-07-01)
- Seven new on-device tools wired to already-shipped engine ops (no new dependencies), per `docs/PHASE-2-PLAN.md` Batch 1: **Compress PDF** (`compressPdf`), **Create ZIP** / **Extract ZIP** (`@zii/compute-wasm/archive`), **HEIC → JPG** (`heicToJpg`), **Discount calculator**, **Savings & interest** (simple + compound), and **Cooking converter** (`convertCooking`). App now ships **28 tool screens** (was 21); adds a new "Files" category section.
- Fixed the app typecheck to follow `@zii/compute-wasm/heic`'s ambient `heic-convert` declaration (triple-slash reference). Bundle budget held (76.8 KB gz initial); prerender now emits 232 localized pages.

### Changed — App: performance / bundle optimization (2026-06-30)
- **Vendor split**: React + scheduler are now a separate `vendor-react` chunk (~59 KB gz) so app-code changes don't bust the framework cache. The app-code entry chunk dropped to ~17 KB gz; initial payload ~75 KB gz total (unchanged bytes, better caching). Build target raised to `es2022`.
- **Bundle-budget guard** (`scripts/check-bundle.mjs`, wired into `build` + a `check:bundle` script): reads the Vite manifest, sums the gzipped initial payload (entry + static imports), and fails the build if it exceeds the budget (110 KB gz) — enforcing the roadmap's "breadth without bloat" guardrail as the catalogue grows.
- **Hover/focus prefetch**: hovering (or focusing) a tool card, hero card, or sidebar item warms that tool's code-split chunk via `prefetchTool()`, so it opens instantly — with no eager cost on first load. Heavy engines (pdf-lib 174 KB gz, image codecs, zxing, yaml) stay lazy.

### Changed — App: dropped Simplified Chinese; new logo (2026-06-30)
- Removed Simplified Chinese (`zh-CN`) from the language set — now **8 languages** (en, zh-TW, zh-HK, ja, ko, es, fr, de); prerender emits 176 localized pages.
- New brand logo: a "Z" monogram (two bars + a lime diagonal) as a shared `Logo` component (used in the nav + footer brand tiles and the prerendered output) and a redrawn `public/icon.svg` app/PWA/favicon tile (blue gradient, white bars, lime diagonal), replacing the plain text "Z".

### Added — App: tool breadcrumb (2026-06-30)
- Tool routes now show a breadcrumb (Home / Category / Tool) above the panel; the Home and Category crumbs are clickable (Category jumps home and filters to that section). The prerendered tool pages carry the same three-level breadcrumb, and the JSON-LD `BreadcrumbList` was extended to include the category level.

### Added — App: category sections + filter (2026-06-30)
- New `categories.ts` metadata layer: a single source for category display order, localized names (9 languages), with shared colour + icon. Replaces the raw lowercase tags (`dev`, `datetime`, …) with proper labels (`Developer`, `Date & time`, …).
- The home catalog is now laid out as **titled category sections** (icon + localized name + count) instead of one flat grid, plus a **filter-chip bar** (All + each category with counts) to narrow to a single section. Tool cards simplified to icon + name + offline badge (category is conveyed by the section + icon colour). New i18n key `allCategories`.
- The prerenderer emits the same grouped sections with `<h3>` category headings — better structure for crawlers — and the chips, across all 198 pages.

### Added — App: per-tool icons (2026-06-30)
- A line-art icon for every tool, defined as inline SVG in a shared `icons.ts` (pure strings, with a per-category fallback) so both the React `ToolIcon` component and the string prerenderer draw from one source. No icon font or CDN — offline-first and license-clean.
- Icons shown (category-coloured) in the tool grid cards, the hero deck cards, and (ink-toned) in the in-tool sidebar; baked into the prerendered grid too.

### Added — App: in-tool sidebar (2026-06-30)
- Opening a tool now shows a sticky, glass-styled left sidebar (`ToolNav`) listing every tool grouped by category, with the current tool highlighted in lime — so users can jump between tools without returning to the grid. Hover slide, keyboard/aria-current, responsive (hidden on phones). Tool content moved into a `.workspace` two-column layout.
- Centralized the category accent colours in `catalog.ts` (`CATEGORY_COLOR` / `categoryColor`), shared by the grid, hero cards, sidebar, and prerenderer.

### Added — App: 11 more universal tools (2026-06-30)
- New tool screens wired to the existing engines, all on-device + bilingual (en / zh-TW, falling back to English elsewhere): **Base64 encode/decode**, **URL encode/decode**, **JSON ↔ YAML**, **Regex tester**, **Text diff**, **Full/half-width**, **Loan calculator** (payment + amortization table), **BMI calculator**, **Date & age**, **QR code scanner** (`scanQr`), and **Split PDF** (`splitPdf`). App now ships **21 real tool screens** (was 10).
- Removed the `hello` developer sample from the app grid (it was registered for the M1 smoke test, not a real tool).
- New shared styles: compact data table (`.ztable`) for the loan schedule, and a colorized text-diff view. Prerender category colors extended (finance, datetime). The prerenderer now emits **198 localized pages** (9 locales × 22 routes) plus sitemap/robots/llms, all derived automatically from the catalogue.

### Added — App: cloud hero background (2026-06-30)
- `Clouds` decorative layer behind the hero, built from SVG fractal noise (`feTurbulence`) for real wispy fog with visible edges rather than blurred orbs. Two layers (a low bank where the cards sit + high wisps) masked to a vertical band, each in its own HTML wrapper. The SVG stretches to fill (`preserveAspectRatio="none"`) and the container has a CSS `mask-image` feather top + bottom so the layer never shows a hard crop edge. Static (no drift animation), `pointer-events: none`, dimmed in dark mode, and baked into the prerendered home pages.

### Added — App: site footer (2026-06-30)
- `Footer` component (rendered on every view): brand + tagline, internal links to the top tools, links to all 9 language homes (great for crawl discovery + hreflang), and a copyright bar. Localized; one new i18n key (`footerLanguages`).
- Footer is also baked into the prerendered pages (`prerender-view.ts`), so every static page ships real `<a>` links to tools and locales. Responsive (columns stack on mobile), glass-styled with lime hover.

### Added — App: motion system (2026-06-30)
- A small, consistent animation system in `styles.css`: shared easing/duration tokens (`--ease-out`, `--dur-1/2/3`) and reusable keyframes (`zii-fade-up`, `zii-fade`, `zii-menu`, `zii-pop`, `zii-spin`).
- Applied throughout: staggered hero entrance, fade-in for the fanned hero cards (opacity-only so rotation is preserved), staggered tool-grid cards (via a `--stagger` index), tool-panel + result fade/pop, dropdown menu scale-in, tactile `:active` press on all buttons, and a `loading` spinner on `Button` wired into the async tool actions.
- Full `prefers-reduced-motion: reduce` guard disables all animation/transition for users who opt out.

### Added — App: shared UI component primitives (2026-06-30)
- New `src/components/ui/`: `Select` (a fully custom, accessible glass dropdown replacing the native `<select>` — keyboard nav, aria-activedescendant, click-outside), `TextField`, `TextArea` (with `mono`), `RangeSlider`, `FileField` (styled picker, single + multiple), `Button` (primary/ghost), and a `Field` label wrapper, all exported from a barrel.
- Refactored the shell (language + market pickers, search) and **all 10 tool views** to use these primitives — no native form controls remain in app code. Consistent glass styling, lime focus rings, and dark-mode tokens (`--field-bg`, `--menu-bg`, `--option-active`).

### Added — App: multi-language, SEO, and LLM-friendliness (2026-06-30)
- **9 languages**: widened `Lang` to en / zh-TW / zh-HK / zh-CN / ja / ko / es / fr / de with full shell translations; `tr()` now accepts partial per-tool dictionaries so tool views ship a locale subset and fall back to English.
- **Path-based locale routing** (`src/lib/router.ts`): `/<locale>` and `/<locale>/tools/<id>` via the History API (pushState + popstate), no router dependency. Initial state is parsed from the URL.
- **Localized catalogue** (`src/lib/catalog.ts`): single source of truth for tool id/category/keywords + localized names and blurbs; `tools/index.ts` and the SEO layer both derive from it. Grid, hero cards, and tool pages show localized names.
- **SEO layer** (`src/lib/seo.ts` + `head.ts`): per-route title, meta description, canonical, full hreflang alternates (+ x-default), Open Graph / Twitter, and JSON-LD (`WebApplication` + `ItemList` on home; `SoftwareApplication` + `BreadcrumbList` on tool pages). Applied to the live `<head>` on every client navigation, keeping `<html lang>` in sync.
- **Static prerender / SSG** (`scripts/prerender.mjs`): build now emits one crawlable `index.html` per locale and per tool (99 pages) with localized `<head>` and real body content inside `#root` (the SPA replaces it on load). Also generates `sitemap.xml` (with hreflang alternates), `robots.txt`, and `llms.txt`. Build script: `vite build && vite build --ssr … && node scripts/prerender.mjs`. No new dependencies (reuses Vite's SSR build).
- Enriched base `index.html` (meta description, OG defaults) and `manifest.webmanifest` (lang, description, brand theme colour).

### Added — App: universal tool batch wired to engines (2026-06-30)
- Seven more tool screens wired into the `@zii/app` shell against the existing `ToolPage` contract, all bilingual (en / zh-TW) and code-split into their own lazy chunks (2–4 kB each): **Percentage & tip** and **Unit converter** (`@zii/calc`), **Character & word count** and **Case converter** and **JSON ↔ CSV** (`@zii/text`), **Hash SHA-256/SHA-1** (`@zii/compute`), and **Compress image** (`@zii/compute-wasm`).
- Added `@zii/calc`, `@zii/text`, `@zii/compute` as `@zii/app` dependencies. App tool count is now **10** real screens (was 3); registry/keyword search and the global market list pick them up automatically (existing generic tests still green).
- Extended `styles.css` with grouped-fieldset, stat-grid, output-row and ghost-button styles for the new calculator/text/hash layouts.

### Added — App: first working tool pages wired to compute (2026-06-29)
- `@zii/app`: tool selection/routing in the shell — clicking a tool opens a code-split, lazy-loaded view with a back link; shared `ToolPage` template + `DownloadButton`.
- Three real tools wired to `@zii/compute-wasm`, running on-device: **Merge PDF** (pdf-lib), **Convert image** PNG/JPEG/WebP (jSquash, wasm emitted as local assets → offline), **QR code generator** (zxing-wasm). Bilingual (en / zh-TW).
- Added subpath exports to `@zii/compute-wasm` (`./pdf`, `./image`, `./qr`, …) so the browser bundle pulls only the ops it uses; `vite build` clean with per-tool chunks. *Caveat:* zxing-wasm fetches its wasm from CDN by default — point its `locateFile` at a bundled copy for fully-offline QR.

### Changed — M4–M10: deferred DoD gaps closed for real (2026-06-29)
- `@zii/compute-wasm` (**new**, M4): real handlers behind the `@zii/compute` descriptors — PDF merge/split/compress (pdf-lib), image convert/compress + HEIC→JPG (jSquash/heic-convert/libheif), QR generate/scan (zxing-wasm), ZIP zip/unzip (fflate), all golden-tested **headless in Node**; `video-convert` wired to ffmpeg.wasm for the cross-origin-isolated browser route with a server-side fallback. License-clean (MIT/Apache/ISC + LGPL libheif). Added `pdf-split` + `archive-unzip` descriptors to `@zii/compute`.
- `@zii/calendar` (M6): added Chinese lunar calendar (`gregorianToLunar`/`lunarToGregorian`, leap-month aware), 六曜 (`rokuyo`), and 二十四節気 (`solarTermsInYear`/`solarTermOn`) via `lunar-typescript`; golden-tested against known 2026 anchors (LNY 2026-02-17, 立春/春分/夏至/秋分/冬至, 2025 閏六月).
- `@zii/text` (M8): replaced the stub 繁簡 table with full OpenCC (`opencc-js`) incl. Taiwan idioms (`toTraditionalTaiwan`: 软件→軟體, 鼠标→滑鼠); added JSON↔YAML (`yaml`) and a regex tester (`testRegex`).
- `@zii/payroll` (M9): added `grossForNet` reverse payroll calculator.
- Unified `pnpm verify` green: **376 tests**, vite build, license scan clean (235 deps).

### Added — M3–M10: Platform foundation completed (2026-06-28)
- `@zii/app` (M3): Vite + React PWA shell — registry-driven tool list, market switch, search, dark mode, in-house i18n, hand-rolled manifest + service worker.
- `@zii/compute` (M4): compute registry with lazy code-split ops; native SHA-256/SHA-1; license-clean lazy WASM descriptors (no MuPDF/AGPL).
- `@zii/calc` (M5): calculators + unit/cooking/currency conversion (US vs imperial units distinct).
- `@zii/calendar` (M6): Gregorian⇄ROC⇄和暦 eras, zodiac, age, locale-driven holidays + business-day math.
- `@zii/id` (M7): TW/HK/JP national-ID + Luhn/ABA/IBAN validators & test-data generators.
- `@zii/text` (M8): full/half-width, char-count, case, 繁簡 (subset), JSON/CSV, base64/url/html, line diff.
- `@zii/payroll` (M9): pluggable per-jurisdiction payroll rule contract; progressive income tax; VAT/GST sales tax.
- `@zii/reminders` + `@zii/backend` (M10): holiday-aware recurrence engine; stateless no-retention backend (TTL cache, gov-data adapter, conversion pass-through).
- Unified `pnpm verify` green across 12 packages: 322 tests, vite build, license scan clean (210 deps).

### Added — M2: Locale-Pack System & Shared Config (2026-06-28)
- `@zii/locale`: strict, versioned, dated `LocalePackSchema` (Zod) covering payroll/tax/holidays/id/address/units/dataSources/tools/toggles.
- `LocaleStore` with date-based effective-version resolution, `en-ca → en-gb → en-us` fallback chain, and injected-fetch hot-update.
- Config-validation gate (`validateConfigDir`) wired into the test gate; sample packs for tw / en-us (×2) / en-gb.
- `@types/node` dev dependency; eslint ignores `^_` unused vars.

### Added — M1: Monorepo & Agent Build Harness (2026-06-28)
- pnpm + Turborepo monorepo with strict TypeScript, ESLint (flat config), Prettier, Vitest.
- `@zii/registry`: tool registry + lazy plugin loader with market filtering and search.
- `@zii/hello-tool`: sample tool / smoke test for the plugin pipeline.
- License-scan quality gate (`scripts/check-licenses.mjs`) — blocks AGPL/GPL-only deps.
- CI workflow and root `pnpm verify` (typecheck + lint + test + build + license-scan).
- Autonomous build-loop state files: `MODULE-STATE.json`, `BUILD-LOG.md`.
