# Changelog

All notable changes to this project. Format loosely follows Keep a Changelog.

## [Unreleased]

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
