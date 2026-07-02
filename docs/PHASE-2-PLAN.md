# Phase 2 Execution Plan — Universal Tool Breadth

> Companion to `ROADMAP.md` (Phase 2) and `docs/PRODUCT-ROADMAP-PLAN.md` (§3.2 "universal
> top 10%"). This is the *executable* breakdown: concrete batches, the exact engine op or
> new function each tool needs, and the verification gate. Written 2026-07-01.

## 0. Where we start

The universal backbone is proven: **21 tools** shipped against a repeatable contract, 8-language
i18n, SEO/SSG prerender, category sections, and a bundle-budget gate. Phase 2 grows the catalog
without new architecture — every new tool reuses the pipeline below.

**Target for this plan:** ship the **~30 highest-traffic universal "hero" tools** (21 → ~50+),
covering the top-10% list, in **five shippable batches**. The infra-dependent long tail (OCR,
background-remove, live FX, document conversion, audio/video) is explicitly **deferred** with its
prerequisites named — not silently dropped.

## 1. The build contract (unchanged — this is why batches are cheap)

Each new tool is the same five edits, all auto-picked-up by the rest of the app:

1. **Catalog entry** in `src/lib/catalog.ts` — `id`, `category`, `keywords`, localized `name` +
   `blurb` (en + zh-TW minimum; names in the other 6 where quick).
2. **Loader** in `src/tools/index.ts` — `id: () => import('./<id>')`.
3. **Tool view** `src/tools/<id>.tsx` — `ToolPage` + `ui` primitives, wired to the engine op.
4. **Icon** in `src/lib/icons.ts` — one inline SVG.
5. Nothing else: registry, grid section, sidebar, breadcrumb, prerender page, sitemap, and
   hover-prefetch all derive from the catalog automatically.

New engine capability lands in the relevant `@zii/*` package (with a unit test), then gets wired.

**Every batch ends green:** `tsc` · `eslint` · `vitest` · `vite build` (incl. the **bundle-budget
gate**, ≤110 KB gz initial) · SSR build · prerender. Heavy libraries **must** stay in the tool's
lazy chunk; if a dep leaks into the entry, fix `manualChunks` before merging. License scan stays
green (no AGPL/GPL) — vet each new dep first.

---

## 2. Batches

### Batch 1 — Instant wins off shipped engine ops (no new deps) · ~1 sprint

All of these call functions that **already exist and are tested** in `@zii/compute-wasm` / `@zii/calc`.

| Tool | Category | Engine op (exists) |
|------|----------|--------------------|
| Compress PDF | pdf | `compressPdf` (`@zii/compute-wasm/pdf`) |
| Create ZIP | file | `createZip` (`/archive`) |
| Extract ZIP | file | `extractZip` (`/archive`) |
| HEIC → JPG | image | `heicToJpg` (`/heic`) |
| Discount / sale price | calc | `discount` (`@zii/calc`) |
| Savings & interest | finance | `compoundInterest` / `simpleInterest` |
| Cooking converter | convert | `convertCooking` |

**Deliverable:** +7 tools, zero new dependencies, all offline. **Acceptance:** each opens, runs
on-device, is code-split, budget held.

### Batch 2 — Pure-TS generators & dev tools (tiny functions, no heavy deps) · ~1 sprint

New helpers are ~10–30 lines each; put them in a small new `@zii/generate` (or extend `@zii/text`).

| Tool | Category | Implementation |
|------|----------|----------------|
| Password generator | generator | `crypto.getRandomValues`; length + charset options + strength meter |
| UUID generator | generator | `crypto.randomUUID` (+ v4 bulk) |
| JWT decoder | dev | base64url-decode header/payload → pretty JSON (decode only, no verify) |
| Number base converter | dev | bin/oct/dec/hex, `BigInt` |
| Color converter | dev | hex ↔ rgb ↔ hsl (pure math) |
| Cron explainer | dev | `cronstrue` (MIT) — human-readable schedule |

**Deliverable:** +6 tools. One small dep (`cronstrue`). **Note:** barcode generator deferred to
Batch 5 (needs `bwip-js`).

### Batch 3 — Image toolkit (one engine primitive, then wire) · ~1 sprint

**Engine work first:** add `resizeImage(bytes, {width, height, fit})` and `cropImage(bytes, rect)`
to `@zii/compute-wasm/image` (decode → `OffscreenCanvas`/`resize` → encode; golden-test headless),
since `decodeImage`/`encodeImage` exist but no resample step does.

| Tool | Category | Engine |
|------|----------|--------|
| Resize image (with social/avatar presets) | image | `resizeImage` (new) |
| Crop image | image | `cropImage` (new) |
| Strip EXIF / metadata | image | re-encode via `decode`→`encode` (drops metadata) |
| Favicon generator | generator | `resizeImage` → 16/32/48/180 → `createZip` (+ `.ico` pack) |

**Deliverable:** +4 tools + 1 tested engine addition.

### Batch 4 — PDF toolkit expansion (pdf-lib features already in the dep) · ~1 sprint

pdf-lib is already bundled (used by merge/split). Add engine wrappers in `@zii/compute-wasm/pdf`:

| Tool | Category | pdf-lib capability |
|------|----------|--------------------|
| Watermark PDF | pdf | draw text/image on each page |
| Rotate / reorder / delete pages | pdf | page ops |
| Extract pages → new PDF | pdf | copy subset (extends existing split) |
| Password protect / unlock | pdf | encrypt/decrypt (**document the limits** — pdf-lib is basic) |
| Fill & flatten form | pdf | `PDFForm` fill + flatten |

**Deliverable:** +4–5 tools, no new deps. **Explicitly not shipped:** true redaction and digital
signing (pdf-lib can't do them correctly — do not fake them).

### Batch 5 — Converters, data & math · ~1 sprint

| Tool | Category | Dep (license to confirm via scan) |
|------|----------|-----------------------------------|
| XML ↔ JSON | dev | `fast-xml-parser` (MIT) |
| CSV ↔ Excel (.xlsx) | convert | `xlsx`/SheetJS community (Apache-2.0) — starts the spreadsheet kit |
| Scientific calculator | calc | `mathjs` (Apache-2.0) **safe** evaluator, or a small shunting-yard eval |
| Barcode generator | generator | `bwip-js` (MIT) |
| Time-zone meeting planner | datetime | `Intl` (no dep) |

**Deliverable:** +5 tools. Confirm each dep with the license scan before wiring; keep all in lazy
chunks.

### Batch 6 — Deferred (needs new infra or heavy models) — backlog, flagged in UI

Ship only when their prerequisite lands; mark clearly as "downloads on first use" or "needs network".

| Feature | Blocker |
|---------|---------|
| Currency converter (live FX) | thin no-retention backend must be **deployed** (Phase 0) + a rate feed |
| OCR / document scanner | `tesseract.js` (~heavy wasm) — lazy, "downloads on first use" UX |
| Background remove | `@imgly/background-removal` model (heavy; **verify license**) |
| Audio / video convert | `ffmpeg.wasm` (`convertVideo` exists) — needs cross-origin isolation headers on the host |
| Document conversion (docx/xlsx/pptx ↔ pdf) | no good client-side path; needs a server/LibreOffice worker |

---

## 3. Sequencing & effort

| Batch | New tools | New deps | Engine work | Effort |
|-------|-----------|----------|-------------|--------|
| 1 · engine wins | 7 | none | none | S |
| 2 · generators/dev | 6 | cronstrue | small util module | S |
| 3 · image kit | 4 | none | resize/crop primitive | M |
| 4 · PDF kit | 4–5 | none | pdf-lib wrappers | M |
| 5 · converters/math | 5 | fast-xml-parser, xlsx, mathjs, bwip-js | wrappers | M |
| **Total** | **~27** | 4 vetted | — | ~5 sprints |

Running the batches in order front-loads zero-dependency value (Batches 1–2 add 13 tools with
almost no risk) and pushes the dependency/licence questions to later batches.

## 4. Definition of done (Phase 2)

- **~50 universal tools** live (21 + ~27), covering the top-10% universal heroes.
- Each is **offline-capable or clearly flagged** as needing network/download.
- **Bundle budget held** (initial ≤110 KB gz); heavy libs isolated in per-tool chunks.
- **License scan green** (no AGPL/GPL); each new dep vetted.
- Every tool **prerendered + localized** (en/zh-TW blurbs min) with an icon.
- Deferred items (Batch 6) tracked with their named blockers, not forgotten.

## 5. Risks & mitigations

- **Bundle bloat from wasm/model libs** → keep every heavy dep in the tool's lazy chunk; the budget
  gate fails the build if one leaks into the entry. Use "downloads on first use" UX for the big ones.
- **Correctness traps** (PDF redaction/signing, xlsx edge cases, cron/regex) → don't ship features
  the library can't do correctly; add engine unit tests for anything with real logic (resize,
  generators, base/color conversion, xml round-trip).
- **License surprises** (`@imgly/background-removal`, SheetJS pro vs community) → gate on the license
  scan before adding; prefer MIT/Apache alternatives.
- **`convertCurrency` / OCR depend on Phase 0 (deploy) and a backend** → sequenced into Batch 6, not
  blocking the 27 offline tools.

## 6. First action

Start **Batch 1** — it's seven tools wired to already-tested engine functions with no new
dependencies, and it doubles the "files/PDF/finance" surface the day it merges. Each tool is one
`catalog` entry + one loader + one `*.tsx` + one icon, verified by the existing green gate.
