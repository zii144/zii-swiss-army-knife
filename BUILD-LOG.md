# Build Log

Append-only retros from the autonomous module loop (see `DEVELOPMENT-PLAN.md` §6). One entry per module.

---

## M1 — Monorepo & Agent Build Harness — 2026-06-28

- **Shipped:**
  - pnpm + Turborepo monorepo (Node ≥20, TS strict via `tsconfig.base.json`).
  - Toolchain wired: TypeScript 5.9, Vitest 2.1, ESLint 9 (flat config + typescript-eslint), Prettier 3, Turbo 2.
  - `@zii/registry` — tool registry + lazy plugin loader (`register`/`has`/`get`/`list`/`search`/`load`), market-agnostic with market filtering and search.
  - `@zii/hello-tool` — sample tool proving the register → lazy-load pipeline (smoke test).
  - `scripts/check-licenses.mjs` — license-scan gate (fails on AGPL/GPL-only; allows LGPL and dual-licensed-permissive).
  - CI workflow (`.github/workflows/ci.yml`) running typecheck → lint → test → build → license-scan.
  - Root `pnpm verify` aggregates all gates; agent state files (`MODULE-STATE.json`, this log).
- **Acceptance (all green, verified in sandbox):**
  - `pnpm typecheck` ✓ · `pnpm lint` ✓ · `pnpm test` ✓ (9 tests: 7 registry + 2 hello-tool) · `pnpm build` ✓ · `pnpm check:licenses` ✓ (153 deps, clean).
  - License gate self-test: planted `AGPL-3.0` fixture → **exit 1** (correctly fails); `(MIT OR GPL-2.0)` dual fixture → **exit 0** (correctly passes).
  - Smoke test: `hello` tool registers, appears in `list('tw')`/`list('jp')`, and lazily loads to return `"Hello, Zii!"`.
- **Deviations from spec:**
  - Engines use the **internal-packages pattern** (`exports` → `./src/index.ts`); the app bundler/vitest compile TS directly, so `build` currently runs `tsc` as a typecheck and emits no `dist` (no publishable artifact needed yet). When a package must be published, add an emitting `tsconfig.build.json`.
  - **Install runs on a normal filesystem only.** The connected workspace folder is a restricted mount (no `unlink`/`rename`), so `pnpm install` cannot run there; verification was done in a native-fs mirror. On a normal machine `corepack enable && pnpm install` works directly. (pnpm left two un-deletable `_tmp_*` probe files in the folder root — safe to delete manually.)
  - No `git init` performed in this environment; `lastCommit` is null. Initialize git on a normal machine.
- **Interfaces frozen (downstream must use):**
  - `@zii/registry`: `ToolMeta`, `ToolEntry`, `ToolLoader`, `Market`, `ToolCategory`, `ToolRegistry`, `createRegistry`.
- **Follow-ups / tech debt:**
  - Add Playwright E2E harness (placeholder) when M3 introduces UI.
  - Add bundle-size budget check script (stub) — wire into CI before M4 ships WASM.
  - Add a `tsconfig.build.json` emit path if/when a package needs a published `dist`.
- **Next:** M2 — Locale-Pack System & Shared Config.

---

## M2 — Locale-Pack System & Shared Config — 2026-06-28

- **Shipped:**
  - `@zii/locale` — the config layer every engine consumes.
  - **`LocalePackSchema`** (Zod, strict): versioned/dated schema covering `payroll`, `tax`, `holidays`, `id`, `address`, `units`, `currency`, `calendars`, `dataSources`, `tools.enabled`, and `toggles`; unknown top-level keys rejected.
  - **`LocaleStore`**: `resolve(market, date)` returns the latest pack with `effectiveDate ≤ date` (reproducible historical math); `versions()`; `loadFromUrl(fetch, url)` hot-update via an **injected** fetch provider (offline-first/testable); **fallback chain** `en-ca → en-gb → en-us`.
  - **`validateConfigDir(dir)`** (Node-only, `./validate`) — the config-validation gate; runs under `pnpm test` (`test/data.test.ts`).
  - Sample packs in `data/`: `tw-2026`, `en-us-2025`, `en-us-2026`, `en-gb-2026`.
  - Added `@types/node` (root) and an eslint `no-unused-vars` `^_` ignore rule.
- **Acceptance (all green, verified in sandbox — `pnpm verify` exit 0):**
  - typecheck (4 pkgs) ✓ · lint ✓ · build ✓ · license-scan ✓ (156 deps, clean; zod is MIT).
  - tests ✓ **22 total** (registry 7 + hello 2 + **locale 13**): schema valid/invalid + strict + defaults; date-version resolution; future-date exclusion; fallback chain; hot-load; config-gate validity + loud failure on bad pack/JSON.
- **Deviations from spec:**
  - Config-validation gate is implemented as the `@zii/locale` data test (runs in CI via `pnpm test`) rather than a separate `tsx` script — avoids adding a TS-runner dependency. `validateConfigDir` is exported for reuse if a standalone CLI gate is wanted later.
  - `validate.ts` (fs-based) is intentionally **not** re-exported from the browser-safe `index.ts`.
- **Interfaces frozen (downstream must use):**
  - `@zii/locale`: `LocalePack`, `LocalePackSchema`, `Market`, `LocaleStore`, `createLocaleStore`, `resolve/versions/loadFromUrl`, `FALLBACK`, `FetchLike`, `parseLocalePack`/`safeParseLocalePack`, `validateConfigDir`.
- **Follow-ups / tech debt:**
  - As real market packs land (M5/M6/M9), extend each market's data dir and add its packs to the validation gate.
  - `payroll`/`tax` schemas are `.passthrough()` (extensible); M9 will tighten per-jurisdiction rule-module shapes.
- **Retry note:** first typecheck failed (missing `@types/node` for `node:fs/url/path`); fixed by adding `@types/node` to root devDeps (retry 1/3).
- **Next:** M3 — UI System & PWA App Shell.

---

## M3–M10 — Foundation completion — 2026-06-28

Built in three dependency waves (parallel autonomous sub-builds, each self-verified in an isolated copy), then a single **unified `pnpm verify` across all 12 packages: exit 0** — typecheck (17 tasks), lint (12), **322 tests**, `vite build` 3.0s, license-scan **210 deps clean (no AGPL/GPL)**.

- **M3 — `@zii/app`** (UI/PWA shell): Vite 7 + React 19 shell; registry-driven tool list with market `<select>` + search (command-palette surface), dark mode, in-house i18n dictionary (en/zh-TW), hand-rolled PWA `manifest.webmanifest` + `sw.js` (no vite-plugin-pwa). Pure logic in `src/lib` is unit-tested (11 tests); `vite build` green; hello-tool lazy-loads as its own chunk. *Deviation:* Playwright E2E deferred (browsers can't install in sandbox). *Deviation:* sw.js uses an inline `/* global */` directive (root eslint config left untouched).
- **M4 — `@zii/compute`** (WASM compute abstraction): `ComputeRegistry` with lazy, cached, code-split ops; real native `sha256Hex`/`sha1Hex` via Web Crypto (verified vectors); 9 heavy ops registered as **lazy descriptors** (`needsWasm:true`, video `isolated:true` for COOP/COEP) that throw "requires the @zii/compute-wasm bundle" until wired at the app layer — keeps the foundation light and **license-clean** (pdf-lib/pdf.js/PDFium, jSquash/wasm-vips, LGPL ffmpeg, ZXing; no MuPDF). 24 tests.
- **M5 — `@zii/calc`** (calc + units): percentage/tip/discount/loan+amortization/BMI/interest; unit conversion (length/mass/temp/volume/area/speed/data) with **US vs imperial gallon/pint distinct**; cooking densities; injected-rate currency. 50 tests (anchors: loan 100k@6%/360≈599.55, mi→km exact, BMI normal).
- **M6 — `@zii/calendar`** (calendar/era): Gregorian⇄ROC, 和暦 with exact era boundaries, 干支 zodiac, 満/数え age, holiday resolution from locale pack + weekend substitution + business-day math. 46 tests. *Deviation:* lunar/六曜/二十四節気 deferred (need ephemeris tables) — documented.
- **M7 — `@zii/id`** (id/address): validators+generators for 身分證 (official MOI letter table), 統編 incl. the 7th-digit-=7 exception, HKID (mod 11), マイナンバー (mod 11), 法人番号/インボイス, Luhn, ABA (021000021 ✓), IBAN (mod 97). 51 tests (valid + round-trip + tamper-fail).
- **M8 — `@zii/text`** (text/data): full/half-width + NFKC, char-count by script, case conversions, 繁簡 (small built-in table; full OpenCC = follow-up), JSON/CSV, manual env-independent base64, url/html encode, LCS line diff. 53 tests.
- **M9 — `@zii/payroll`** (payroll/tax): the **pluggable per-jurisdiction `PayrollRuleModule` contract**; `progressiveTax` (marginal), `salesTax` (inclusive/exclusive), `makeFlatRateModule`, and `makeTaxModuleFromPack` deriving deductions + brackets from a LocalePack. 19 tests.
- **M10 — `@zii/reminders` + `@zii/backend`**: reminders engine (once/daily/weekly/monthly, monthly clamp, **holiday/weekend roll-forward via @zii/calendar**, leadDays notifications — 26 tests); backend (TTLCache with injected clock, gov-data adapter/normalize pattern, **no-retention `convertHandler` proven by `retainedCount` staying 0**, `node:http` server factory — 20 tests).
- **Interfaces frozen:** see `MODULE-STATE.json` `frozenInterfaces` for all 10 packages.
- **Follow-ups:** wire real WASM bundles behind M4's lazy ops; lunar/六曜 tables in M6; full OpenCC dataset in M8; Playwright E2E + service-worker precache for M3; market locale packs (TW first) now unblocked.
- **Status:** platform foundation **complete** (M1–M10). Next phase = localization packs.
