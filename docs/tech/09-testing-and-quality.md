# 09 — Testing & Quality

Two layers of automated testing plus a five-gate quality bar, all runnable in one command
(`pnpm verify`) and mirrored in CI.

## Unit tests — Vitest 2.1.8

- **Decentralized, convention-based, near-zero config.** Vitest is a single root
  devDependency; every package declares `"test": "vitest run"` and runs from its own
  directory. There is **no root `vitest.config.ts` / `vitest.workspace.ts`**; pure-logic
  packages ship no config at all and rely on auto-discovery of `**/*.test.ts`.
- The **one exception is `@zii/app`**, whose `vite.config.ts` (imported from
  `vitest/config`) adds the React plugin, aliases `heic-convert → heic-convert/browser`,
  and scopes tests to `test/**/*.{test,spec}.ts` so Vitest never picks up the Playwright
  specs in `e2e/`.
- **Layout:** tests are in a sibling `test/` dir, not colocated in `src/`. Naming is
  uniformly `*.test.ts`; large tool batches use grouped `batchNN.test.ts` files.

**~82 unit-test files across 14 packages:**

| Package | files | Package | files |
|---|---|---|---|
| `text` | 17 | `id` | 8 |
| `calc` | 11 | `payroll` | 8 |
| `app` (`test/`) | 9 | `compute` | 6 |
| `calendar` | 5 | `compute-wasm` | 6 |
| `backend` | 4 | `locale` | 3 |
| `reminders` | 2 | `hello-tool` / `receipt` / `registry` | 1 each |

**What they assert (examples):**
- `calc/test/calc.test.ts` — finance/units math, throw-on-invalid-input.
- `id/test/tw.test.ts` — golden-anchor id `A123456789`, `generate → validate` round-trip
  over 50 seeds, determinism.
- `compute-wasm/test/pdf.test.ts` — real WASM/pdf-lib ops (merge asserts page counts,
  rejects empty input) — proving the dual-runtime (Node-side) WASM works.
- `app/test/app-tools.test.ts` — registry wiring: every tool registers, has a lazy view,
  and market scoping (tw/hk/jp hidden from `global`).
- `locale/test/data.test.ts` — the config gate: bundled packs validate clean; a broken pack
  is flagged.

> **Coverage is not configured** — no `@vitest/coverage-*`, no `--coverage`. (The
> `coverage/` dir is git-/prettier-ignored defensively but nothing generates it.) Quality
> confidence comes from the golden-anchor unit tests + the exhaustive E2E sweep instead.

## End-to-end tests — Playwright 1.61.1 (Chromium only)

Config `packages/app/playwright.config.ts`; specs in `packages/app/e2e/` (4 files).

- **Drives the real production build, not the dev server.** `webServer.command` is
  `pnpm build && pnpm exec vite preview --port 4321 --strictPort` (dedicated port, isolated
  from the editor's 5173). This runs against prerendered HTML + pre-bundled chunks and thus
  **also exercises the prerender path**; `webServer.timeout: 240s` covers the full build.
- **`serviceWorkers: 'block'`** so the app-shell cache never serves stale bundles;
  `fullyParallel`; CI `retries: 1`, `workers: 3`; `expect.timeout: 20s` (generous for
  WASM/CJK lazy compile); `trace: 'on-first-retry'`.

**The four specs:**
1. **`tools-smoke.spec.ts` — the all-tools sweep.** Imports `CATALOG` and generates **one
   test per catalog tool (~318)**. Each navigates to `/en/tools/{id}` and asserts: the title
   is visible + non-empty; the "not built yet" fallback is absent; ≥1 interactive control
   renders; and **no page/console errors** during mount (a curated `IGNORED_CONSOLE`
   allowlist filters favicon/manifest/SW/`net::`/`[vite]`/`[hmr]`/devtools noise). This is
   the guarantee that "the engine→registry→UI path is wired for all of them."
2. **`tools-functional.spec.ts`** — 6 real input→output checks across categories:
   `text-case` (→ `HELLO WORLD`), `rot13` (`Hello`→`Uryyb`), `base64` (`hi`→`aGk=`),
   `slugify` (`Hello World`→`hello-world`), `area-convert` (2 m² → `21.527` ft²),
   `percent-tip` (asserts a computed digit).
3. **`catalog.spec.ts`** — the `/tools` hub, category drill-down URLs, search fast-path,
   `dev`-category sub-section splitting, "View all" scroll.
4. **`i18n.spec.ts`** — all 8 locales route with the correct `<html lang>`, localized nav,
   no runtime errors (incl. CJK/accented), a language-switcher test, and a "Japanese names
   render, not English fallback" check (`面積変換`, `温度変換`).

## The quality bar — `pnpm verify`

One command composes every gate (identical to the CI `verify` job's steps):

```
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm check:licenses
```

| Gate | What it enforces |
|------|------------------|
| `typecheck` | `tsc -p` (strict) across all packages via turbo |
| `lint` | ESLint 9 flat config across all packages |
| `test` | All Vitest unit tests |
| `build` | Full app build **including** the 128 KB gz bundle-budget gate |
| `check:licenses` | No AGPL/GPL dependency (see [`10`](10-build-deploy-mobile.md)) |

## CI — `.github/workflows/ci.yml`

Triggers on push to `main` and every PR. **Two parallel jobs** (no dependency between
them), both `ubuntu-latest`, Node **22** via corepack (activating `pnpm@9.15.0`):

- **`verify`** — checkout → setup-node 22 → `pnpm install --no-frozen-lockfile` →
  typecheck → lint → test → build → license scan (the same five gates).
- **`e2e`** — checkout → setup-node 22 → install → `playwright install --with-deps chromium`
  → `test:e2e` → upload the HTML report as an artifact (7-day retention).

Notes for operators: **no dependency caching** is configured (every run cold-installs);
CI installs with `--no-frozen-lockfile` while Vercel builds with `--frozen-lockfile`; there
is **no deploy job** in Actions (Vercel deploys outside GitHub Actions).

## Historical test-count trail

From `BUILD-LOG.md` / `ROADMAP.md`: the foundation reached **322 tests** at M10, then a
deferred-gap-closure pass brought it to **376 tests** (adding `@zii/compute-wasm`, lunar/
六曜/節気, full OpenCC, `grossForNet`). The E2E all-tools sweep grew with the catalog
(10 → 21 → 44 → 76 → 170 → ~318 generated tests).
