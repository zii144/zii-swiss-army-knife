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

---

## M4–M10 — Deferred-gap closure ("for real") — 2026-06-29

A follow-up pass that closes the DoD gaps the initial M3–M10 wave had stubbed or deferred. Re-verified with a single unified **`pnpm verify` across 13 packages: exit 0** — typecheck (18 tasks), lint, **376 tests** (was 322; +54), `vite build`, license-scan **235 deps clean (no AGPL/GPL)**. All work built and tested in a native-FS sandbox mirror (the synced folder is a restricted mount where `pnpm install` can't run), then written back to the repo.

- **M4 — `@zii/compute-wasm` (new package):** the heavy ops that previously threw `"requires the @zii/compute-wasm bundle"` now actually run. A single env bridge (`wasm-env.ts`) feeds each codec its `.wasm` bytes in Node (the codecs self-load in the browser), so every op is **golden-tested headless**:
  - **PDF** (pdf-lib): `pdf-merge`, `pdf-split` (per-page or reordered subset), `pdf-compress` (structural re-save).
  - **Image** (jSquash png/jpeg/webp): `image-convert` (magic-byte detection), `image-compress`.
  - **HEIC** (heic-convert→libheif, LGPL dynamically linked): `heic-to-jpg` — tested against a real 16×16 HEIC fixture generated with libheif/ImageMagick, embedded as base64; output JPEG re-decoded to assert 16×16 + red pixel.
  - **Barcode** (zxing-wasm): `qr-generate` (PNG+SVG), `qr-scan` — full generate→scan round-trip.
  - **Archive** (fflate): `archive-zip`, `archive-unzip` — byte-exact round-trip.
  - **Video** (`video-convert`): wired to ffmpeg.wasm for the COOP/COEP isolated browser route; in Node / non-isolated contexts it throws an actionable error pointing to the `@zii/backend` conversion worker (honest — multi-threaded ffmpeg.wasm cannot run in a plain Node process). 26 tests.
  - Also added `pdf-split` + `archive-unzip` descriptors to `@zii/compute` so the abstraction lists them; `createComputeRegistryWithWasm()` is the production registry where every op runs.
- **M6 — `@zii/calendar`:** added the previously-deferred lunar/六曜/節気 via `lunar-typescript` (MIT, deterministic, offline — no ephemeris files shipped). `gregorianToLunar`/`lunarToGregorian` (leap-month aware via signed month), `rokuyo` (`(lunarMonth+lunarDay) mod 6`), `solarTermsInYear`/`solarTermOn` (24 terms collected, sorted, zipped to a canonical Traditional/Japanese name list — sidesteps the library's simplified + aliased `DONG_ZHI` keys). +10 golden tests (LNY 2026, 2025 閏六月, 立春/春分/夏至/秋分/冬至, 啓蟄 ja kanji).
- **M8 — `@zii/text`:** replaced the curated 繁簡 table with full **OpenCC** (`opencc-js`, MIT/Apache). `toTraditional`/`toSimplified` now phrase-aware; new `toTraditionalTaiwan` applies Taiwan vocabulary (軟體/記憶體/滑鼠/程式). Added JSON↔YAML (`yaml`, ISC) completing the JSON↔CSV↔YAML matrix, and a `testRegex` tester (groups, named groups, invalid-pattern handling, zero-width guard). +14 tests.
- **M9 — `@zii/payroll`:** added `grossForNet` — a bisection reverse calculator (gross from target net) over any rule module, exact for linear flat-rate modules. +4 tests.
- **M5 / M7 / M10:** reviewed against their DoDs — no stubs or deferred items remained (validators, calc/units, reminders/backend were genuinely complete in the first wave), so they pass the hardened suite unchanged. *Documented follow-up (localization phase, not foundation):* `@zii/address` (postal lookup / address normalization / CJK↔romaji) and 注音/粵拼/ふりがな readings were in the M7/M8 *objectives* but not their DoDs; they belong to the per-market data effort.
- **Licensing:** new deps are MIT/Apache/ISC + LGPL (libheif via heic-convert, dynamically linked) — all pass the `check:licenses` gate. No MuPDF, no AGPL/GPL.
- **Follow-ups:** swap heic-convert's internal encoder for jSquash if a raw-RGBA libheif decode path is wanted; ship/host ffmpeg.wasm core for the isolated route + add a Playwright test for it; wire `createComputeRegistryWithWasm()` into the `@zii/app` shell and `@zii/backend` worker.
- **Status:** foundation DoD gaps **closed**. Next phase still = localization packs (TW first).
