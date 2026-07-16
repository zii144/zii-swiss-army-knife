# 10 — Build, Deploy & Mobile

## Monorepo build orchestration

- **pnpm workspaces** (`pnpm-workspace.yaml → packages/*`), internal deps as `workspace:*`.
- **Turborepo** (`turbo.json`, minimal): `build`/`test`/`typecheck` each
  `dependsOn: ["^build"]` (upstream deps first); `lint` has none. Local `.turbo/` cache
  only — no `outputs` config, no remote cache.
- Root scripts fan out via turbo: `build`/`test`/`lint`/`typecheck` = `turbo run <task>`.
- Because engines are `noEmit` TypeScript shipped as source, a package's `build` is
  effectively a typecheck (no JS emitted; Vite transpiles the source when the app builds).

## The app build — a 5-stage SSG pipeline

`packages/app` `build` script:

```
vite build
  && node scripts/check-bundle.mjs                                   # 128 KB gz gate
  && vite build --ssr src/lib/prerender-entry.ts --outDir dist-ssr   # DOM-free helper bundle
  && node scripts/prerender.mjs                                      # static HTML + SEO/LLM assets
  && node scripts/stamp-sw.mjs                                       # fingerprint SW cache name
```

1. **`vite build`** → SPA into `dist/` (code-split hashed chunks; React in `vendor-react`;
   `.vite/manifest.json` emitted).
2. **`check-bundle.mjs`** → the **bundle-budget gate**. Reads the Vite manifest, walks the
   entry chunk plus all transitively **static** imports (what the browser must download
   before first paint), gzips each, sums, and **`exit(1)` above 128 KB gz**
   (`ZII_BUNDLE_BUDGET_KB`, default 128 — raised over time 110→112→116→122→128 as market
   labels were added). Prints a per-file table.
3. **SSR build** of `prerender-entry.ts` → a DOM-free Node bundle of the locale/SEO/render
   helpers.
4. **`prerender.mjs`** (~400 lines) → for every route (all locales × home/tools/category/
   tool, ~1,470 pages) writes `dist/{path}/index.html` with a localized `<head>` + crawlable
   body, plus `sitemap.xml`, `robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`,
   `llms/{category}.txt`, `tools.json`, `opensearch.xml`.
5. **`stamp-sw.mjs`** → sha256 the sorted `dist/assets` filenames, rewrite the
   `zii-shell-*` cache token in `dist/sw.js` so each content-changing deploy auto-busts the
   stale app-shell cache. Fails loudly if `dist/assets` is empty or the token is missing.

## Quality gates in the build

- **Bundle budget** (above) — "breadth without bloat."
- **License scan** — `scripts/check-licenses.mjs` (`pnpm check:licenses`): walks
  `node_modules` (depth ≤8, dedup by `name@version`), normalizes each license, and **fails
  on AGPL or any numbered GPL** (`/AGPL/i`, `/\bGPL-?\d/i`). Carve-outs: **LGPL always
  allowed** (dynamically linked), **dual licenses with a permissive `OR` option allowed**
  (`GPL-2.0 OR MIT` passes). The concrete avoided target is MuPDF/`mupdf-wasm` (AGPL); PDF
  work uses pdf-lib/pdf.js instead. Last clean scan: 235 deps, zero AGPL/GPL.

## Deploy — static PWA, no server runtime

The output `packages/app/dist/` is fully static and deployable to any static host. Canonical
target is **Vercel** (`vercel.json`, `framework: null`):

- `installCommand: pnpm install --frozen-lockfile`
- `buildCommand: pnpm --filter @zii/app build`
- `outputDirectory: packages/app/dist`
- `cleanUrls: true`, permanent redirect `/` → `/en`, SPA rewrite `/(.*)` → `/index.html`.
- Strict security headers on every route (CSP, COOP/COEP, Permissions-Policy, HSTS, …) —
  see [`11-security-and-privacy.md`](11-security-and-privacy.md). Immutable caching for
  `/assets/*`; `must-revalidate` for `sw.js`.

**Environment:** `ZII_ORIGIN` (canonical URL base, default `https://zii.tools`); optional
`VITE_BACKEND_URL` (enables the document-conversion / live-FX tools). `DEPLOY.md` documents
Netlify/Cloudflare equivalents (clean URLs + SPA fallback + `/`→`/en`).

## Optional backend (`@zii/backend`)

Not part of the default deploy. A stateless, no-retention `node:http` service (no
Express) exposing `GET /health`, `GET /eta` (gov-data proxy + TTL cache), `GET /fx`
(currency, cached), `POST /convert` (document conversion pass-through). It holds **no
retained data** — a module-level `RETAINED` array is never written to and `retainedCount()`
is asserted to always be `0`. Run via `node --experimental-strip-types src/serve.ts`;
`docker-compose.yml` pairs it with `gotenberg/gotenberg:8` (LibreOffice) for doc conversion.
Media conversion uses an **LGPL ffmpeg** worker. The app falls back to the public
Frankfurter FX API directly when no backend is configured.

## Mobile — Capacitor 8

The same offline PWA is wrapped as native iOS/Android via **Capacitor** (`@capacitor/core`
`^8.4.1`). Config `capacitor.config.ts`: `appId: dev.zii.knife`, `appName: Zii`,
`webDir: dist`, `server.androidScheme: https`. It is purely a packaging layer — "No
live/gov-data tools are wired here."

Scripts (`packages/app/package.json`):
- `mobile:sync` → `pnpm build:spa && cap sync` (note: **`build:spa`** = `vite build` only,
  *not* the full prerender/budget/SW pipeline).
- `mobile:ios` → sync + `cap open ios`.
- `mobile:android` → sync + `cap open android`.

Native project **sources are committed** (build artifacts + copied web assets git-ignored):
- `packages/app/ios/` — Xcode project, `AppDelegate.swift`, `Info.plist`, `Assets.xcassets`,
  SwiftPM (`CapApp-SPM/Package.swift`).
- `packages/app/android/` — Gradle project (`app/`, wrapper, `capacitor-cordova-android-plugins/`).

Status (`packages/app/README.md`): iOS **builds and runs today, verified in the simulator**;
Android needs an Android SDK on the build machine. The apps are currently the offline PWA in
a WebView — **native camera OCR / push / NFC plugins are explicit Phase 4 follow-ups, not
implemented**; OCR runs via the web `tesseract.js` path.

## Mobile automation — what exists vs. NOT

**Directly verified in the repo:**

- **Fastlane — NOT configured.** No `fastlane/` dir, no `Fastfile`, no `Appfile`. The only
  "fastlane" strings are boilerplate ignore lines inside the stock Android `.gitignore`
  template (ignore rules for files that don't exist) — not a Fastlane setup.
- **Maestro — NOT configured.** No `.maestro/` dir, no `*.maestro.yaml`, no flow files, no
  references anywhere.
- **No native test suites** — `android/app/src/{test,androidTest}` are empty Capacitor/Gradle
  scaffolding.
- **No CI for native** — the GitHub Actions `e2e` job is web/Chromium only; nothing builds
  or tests the native apps.

**What exists for mobile is only** Capacitor `cap sync` + `cap open` via the three
`mobile:*` npm scripts. If you need device UI automation or store-release automation, adding
Maestro (flows) and/or Fastlane (signing + upload) would be greenfield work — see the
[`13-portability-playbook.md`](13-portability-playbook.md) for where they'd slot in.

## Desktop — planned

A Tauri 2 desktop target is named in the roadmap and tech-stack plan but **not started**.
