# 03 — Tech Stack

Exact versions from `package.json` files across the workspace. The philosophy is
**minimal, permissively-licensed, hand-rolled-where-cheap**: no framework is pulled in
where a small in-house version keeps the bundle and dependency tree lean.

## Language & type system

| Tool | Version | Notes |
|------|---------|-------|
| TypeScript | `^5.7.2` | Strict everywhere via `tsconfig.base.json` |
| Node.js | `>=20` (engines); **CI uses 22** | ESM-only (`"type": "module"`) |
| Target / lib | `ES2022`, `DOM`, `DOM.Iterable` | `module: ESNext`, `moduleResolution: Bundler` |

**Strictness flags** (`tsconfig.base.json`, applied to all packages): `strict`,
`noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`,
`isolatedModules`, `verbatimModuleSyntax`, `forceConsistentCasingInFileNames`,
`noEmit`. Every package's own `tsconfig.json` is 4 lines: `{ "extends":
"../../tsconfig.base.json", "include": ["src", "test"] }`.

## Monorepo & build orchestration

| Tool | Version | Role |
|------|---------|------|
| pnpm | `9.15.0` (via corepack) | Workspaces (`packages/*`), `workspace:*` internal deps |
| Turborepo | `^2.3.3` | Task graph: `build`/`test`/`typecheck` `dependsOn ["^build"]` |
| Prettier | `^3.4.2` | `singleQuote`, `semi`, `trailingComma: all`, `printWidth: 100` |
| ESLint | `^9.17.0` (flat) + `typescript-eslint ^8.18.1` | `js.recommended` + `tseslint.recommended` |
| Vitest | `^2.1.8` | Unit tests, run per-package |

> Packages ship **raw `.ts` source** via `exports: { ".": "./src/index.ts" }` — there is
> no compiled `dist/` for the libraries. Vite/esbuild/`tsc`/Vitest consume the TypeScript
> directly. A package's `build` script (`tsc -p tsconfig.json` with `noEmit`) is therefore
> effectively a typecheck.

## Frontend (`@zii/app`)

| Tool | Version | Role |
|------|---------|------|
| React | `^19.2.0` | UI (client render, `React.lazy`/`Suspense`, no hydration) |
| React DOM | `^19.2.0` | `createRoot` client render |
| Vite | `^7.3.6` | Dev server + build + SSR build for prerender |
| `@vitejs/plugin-react` | `^5.2.0` | The only Vite plugin |

No router library (History API), no i18n library (typed dictionary), no state library
(`useState` in `App.tsx`), no CSS framework (one stylesheet + CSS custom properties),
no `vite-plugin-pwa` (hand-rolled `public/sw.js`).

## Tool/engine libraries (the heavy lifting)

| Library | Version | Used for | License note |
|---------|---------|----------|--------------|
| `tesseract.js` | `^5` | On-device OCR (ML) | Apache-2.0 |
| `@imgly/background-removal` | `^1` | On-device image background removal (ML) | permissive |
| `xlsx` (SheetJS) | `^0.18` | CSV/Excel conversion | Apache-2.0 |
| `bwip-js` | `^4` | Barcode generation | MIT |
| `fast-xml-parser` | `^4` | XML ↔ JSON | MIT |
| `pdf-lib` | (compute-wasm) | PDF merge/split/compress/build | MIT |
| `pdfjs-dist` | (compute-wasm) | PDF → images / rendering | Apache-2.0 |
| `@jsquash/{jpeg,png,webp}` | (compute-wasm) | Image transcode (WASM) | permissive |
| `heic-convert` | (compute-wasm; app aliases `/browser`) | HEIC → JPG | permissive |
| `zxing-wasm` | (compute-wasm) | QR/barcode scan (WASM) | Apache-2.0 |
| `fflate` | (compute-wasm) | Zip create/extract | MIT |
| `@ffmpeg/ffmpeg`, `@ffmpeg/util` | (compute-wasm) | Audio/video convert (WASM, isolated) | **LGPL** (dynamically linked) |
| `opencc-js` | (`@zii/text`) | CJK Simplified ↔ Traditional | Apache-2.0 |
| `lunar-typescript` | (`@zii/calendar`) | Lunar calendar / 六曜 / 節気 | MIT |
| `yaml` | (`@zii/text`) | JSON ↔ YAML | ISC |
| `zod` | (`@zii/locale`) | Locale-pack schema validation | MIT |

**Deliberately avoided:** MuPDF / `mupdf-wasm` (AGPL-3.0) — PDF work uses pdf-lib/pdf.js
instead. Any GPL/AGPL dependency **fails the build** (see the license gate,
[`10-build-deploy-mobile.md`](10-build-deploy-mobile.md)). LGPL (ffmpeg, libheif) is
permitted because it is dynamically linked.

## Mobile

| Tool | Version | Role |
|------|---------|------|
| `@capacitor/core` | `^8.4.1` | Native WebView shell runtime |
| `@capacitor/cli` | `^8.4.1` | `cap sync` / `cap open` |
| `@capacitor/ios` | `^8.4.1` | iOS project (`packages/app/ios/`, SwiftPM) |
| `@capacitor/android` | `^8.4.1` | Android project (`packages/app/android/`, Gradle) |

`appId: dev.zii.knife`. No Fastlane, no Maestro — see
[`10-build-deploy-mobile.md`](10-build-deploy-mobile.md).

## Testing & CI

| Tool | Version | Role |
|------|---------|------|
| Vitest | `^2.1.8` | ~82 unit-test files across 14 packages |
| `@playwright/test` | `^1.61.1` | E2E: all-tools smoke sweep + functional spot-checks (Chromium only) |
| GitHub Actions | — | Two jobs: `verify` + `e2e` (`.github/workflows/ci.yml`) |

## Backend (optional, `@zii/backend`)

| Tool | Version | Role |
|------|---------|------|
| `node:http` | stdlib | Server (no Express/Fastify) |
| Gotenberg | `gotenberg/gotenberg:8` (docker) | LibreOffice document conversion worker |
| Frankfurter API | public | Live FX rates (`api.frankfurter.app`) |
| ffmpeg | LGPL build | Media conversion worker |

Runs via `node --experimental-strip-types src/serve.ts`; `docker-compose.yml` pairs it
with Gotenberg. Not part of the default static deploy.

## Hosting / deploy

| Target | Config | Role |
|--------|--------|------|
| Vercel | `vercel.json` (`framework: null`) | Canonical static host; strict security headers |
| Any static host | — | Netlify/Cloudflare equivalents documented in `DEPLOY.md` |

## Dependency-count sanity check

The last recorded clean license scan covered **235 dependencies with zero AGPL/GPL**
(`BUILD-LOG.md`). The whole tree is permissive + LGPL only, by enforced guardrail.
