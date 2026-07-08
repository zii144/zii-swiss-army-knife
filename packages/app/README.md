# @zii/app — PWA app shell + tool surface

The web app for the Zii Swiss Army Knife suite: a privacy-first, offline-capable
PWA that hosts **170 tool screens** across calc, files, PDF, image, text, dev,
identity, and everyday categories. Pure engines live in the sibling workspace
packages; this package is the UI, routing, i18n, SEO/prerender, and PWA plumbing
that ties them together — and the Capacitor shell that ships them as native apps.

## What it does

- **Registry-driven tool surface** — builds a registry via `createRegistry()`
  from [`@zii/registry`](../registry) and registers every tool's lazy,
  code-split view (`src/tools/`). Tools are filtered by:
  - a **market** (`global / tw / hk / jp / en-us / en-gb`) — region-specific
    tools appear only in their market; and
  - a **search box** over names/keywords.
- **170 tools**, lazy-loaded and code-split, keeping the initial payload at
  ~**105 KB gz** against a hard **110 KB gz** budget (enforced on every build by
  `scripts/check-bundle.mjs`).
- **8 UI languages** (`en, zh-TW, zh-HK, ja, ko, es, fr, de`) with fully
  localized tool names, via a small in-house dictionary (`src/lib/i18n.ts`) — no
  `i18next` dependency.
- **Design-consistent UI kit** (`src/components/ui/`) — accessible custom
  `Select`, `TextField`, `TextArea`, `FileField`, `RangeSlider`, and `Button`,
  themed with CSS custom properties. Dark mode flips an `app--dark` class.
- **Static PWA + SEO** — client-side router (`src/lib/router.ts`) plus an SSR
  prerender (`scripts/prerender.mjs`) that emits **~1,470 localized pages**,
  `sitemap.xml`, `robots.txt`, JSON-LD, and LLM-discovery files (`llms.txt`,
  `tools.json`). Hand-rolled `public/manifest.webmanifest` + `public/sw.js`
  (app-shell cache); `vite-plugin-pwa` is intentionally not used.
- **Native shell (Capacitor)** — the same build is wrapped as iOS/Android apps
  (`appId: dev.zii.knife`); see [Mobile](#mobile-capacitor).

## Layout

```
packages/app/
  index.html                # entry HTML (favicon, manifest)
  vite.config.ts            # react plugin, heic browser-build alias, vitest scope
  playwright.config.ts      # headless E2E against the production build
  capacitor.config.ts       # native shell config (webDir: dist)
  public/
    manifest.webmanifest    # PWA manifest
    sw.js                   # hand-rolled service worker (app-shell cache)
    icon.svg                # app / favicon mark
  scripts/
    check-bundle.mjs        # initial-payload budget gate
    prerender.mjs           # SSR prerender → dist/ (pages, sitemap, llms.txt…)
  src/
    main.tsx                # React root + service-worker registration
    App.tsx                 # routing, market/search/dark/lang state, home + tool views
    styles.css              # theme via CSS variables
    components/             # Logo, ToolNav, ToolCatalog, Footer, ui/ kit…
    tools/                  # one lazy, code-split view per tool (+ index.ts registry)
    lib/                    # PURE: catalog, router, i18n, seo, toolkit, regionkit…
  test/                     # Vitest unit tests for the pure lib/ logic
  ios/  android/            # generated Capacitor native projects
  e2e/                      # Playwright specs (see Testing)
```

Pure, framework-free logic lives in `src/lib/` and is unit-tested with Vitest;
end-to-end behavior is covered by Playwright (below).

## Scripts

```bash
pnpm --filter @zii/app dev         # vite dev server
pnpm --filter @zii/app build       # SPA + bundle-budget + prerender → dist/
pnpm --filter @zii/app preview     # serve the production build
pnpm --filter @zii/app typecheck   # tsc -p tsconfig.json (noEmit)
pnpm --filter @zii/app test        # vitest run (unit)
pnpm --filter @zii/app test:e2e    # playwright test (headless)
pnpm --filter @zii/app lint        # eslint .
```

## Testing

- **Unit** (Vitest, `test/`) — the pure logic in `src/lib/` (registry filter,
  i18n, catalog, region validators, toolkit math).
- **E2E** (Playwright, `e2e/`) — runs headless against the **production build**
  (prerender + hydration, pre-bundled chunks; service workers blocked):
  - `tools-smoke.spec.ts` — data-driven over the catalogue: loads **every one of
    the 170 tools** and asserts each mounts, renders an interactive control,
    isn't the "coming soon" fallback, and logs no console/page errors.
  - `tools-functional.spec.ts` — drives real inputs and asserts outputs across
    categories (case convert, ROT13, Base64, slugify, unit convert, tip split).

  Both run in CI (the `e2e` job in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)).
  The suite already paid for itself — it caught `heic-convert` bundling its
  Node-only entry and crashing in the browser (fixed via a browser-build alias in
  `vite.config.ts`).

## Mobile (Capacitor)

The web build doubles as the native iOS/Android shell — the same offline PWA is
bundled into each app; no server, no extra tools.

```bash
pnpm --filter @zii/app mobile:sync       # build SPA + copy assets into ios/ & android/
pnpm --filter @zii/app mobile:ios        # sync, then open the Xcode project
pnpm --filter @zii/app mobile:android    # sync, then open Android Studio
```

Native project sources are committed; build artifacts and copied web assets are
git-ignored. iOS builds and runs today (verified in the simulator); Android needs
an Android SDK on the build machine. Native camera OCR / push / NFC plugins are
Phase 4 follow-ups — see [`ROADMAP.md`](../../ROADMAP.md).
