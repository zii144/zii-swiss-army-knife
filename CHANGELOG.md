# Changelog

All notable changes to this project. Format loosely follows Keep a Changelog.

## [Unreleased]

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
