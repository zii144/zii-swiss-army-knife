# 05 — The Engine Packages

The computation lives in pure-TypeScript engine packages that know nothing about React,
the DOM, or a specific market. They are **deterministic, offline, side-effect-free
libraries** of exported functions. Region and time specificity is parameterized, never
hard-coded.

## Shared engine conventions

Every engine package follows the same shape (verified across `calc`, `id`, `payroll`,
`calendar`, `text`, `receipt`, `reminders`):

- `@zii/<name>`, `"version": "0.0.0"`, `"private": true`, `"type": "module"`.
- `exports: { ".": "./src/index.ts" }` — ships **raw TypeScript**, no `dist/`.
- `src/index.ts` is a **barrel** re-exporting named pure functions + their types from
  topic/market files.
- No classes for engines (classes only appear in the framework registries); plain
  exported functions.
- Tests colocated in a sibling `test/` dir as `*.test.ts` (engines also use grouped
  `batchNN.test.ts` files).
- Market/time parameterization via **(1) per-market source files** (`id/src/tw.ts`,
  `payroll/src/hk.ts`) and/or **(2) dated, sourced config objects passed as a defaulted
  last argument** (e.g. `cfg: HkSalariesTaxConfig = HK_SALARIES_TAX_2024_25`).

## `@zii/registry`, `@zii/compute` — the framework layer

Two small "contract" packages with the registry pattern (a `Map` + kebab/dedup validation
+ lazy `load`). `@zii/registry` is for UI tools (covered in
[`04-tool-system-and-skills.md`](04-tool-system-and-skills.md)); `@zii/compute` is the same
idea for WASM ops (below).

## `@zii/locale` — locale packs & the config gate (M2)

The mechanism that makes markets pure data. Depends only on `zod`.

- **Schema** (`src/schema.ts`) — `LocalePackSchema` is a **`.strict()`** Zod object, so an
  unknown top-level key fails loudly (guardrail §4.3). A pack is not just strings; it
  selects rules, formats, data sources, enabled tools, and toggles:
  `market`, `year`, `effectiveDate` (`YYYY-MM-DD`), `dateFormat`, `calendars[]`,
  `currency` (3-letter), `units` (`metric|imperial|mixed`), optional `payroll`
  (`.passthrough()`: `socialInsurance`, pension rates), optional `tax` (`.passthrough()`:
  `incomeBrackets[]` `{upTo|null, rate}`, `salesTaxRate`, `deductions`), optional
  `holidays` (`{ list[], makeUpWorkdays }` — "Taiwan abolished make-up workdays in 2025 —
  config, not code"), `id.validators[]`, `address`, `dataSources`, **`tools.enabled[]`**,
  **`toggles`**.
- **Store & fallback** (`src/store.ts`) — `LocaleStore` with `resolve(market, on = now)`:
  walks `[market, ...FALLBACK[market]]` (e.g. `en-nz → [en-gb, en-au, en-us]`) and picks
  the **latest pack whose `effectiveDate <= on`** — reproducible historical math.
  `loadFromUrl(fetchFn, url)` supports hot updates via an **injected** fetch (offline-first
  & testable — not `globalThis.fetch`).
- **The config gate** (`src/validate.ts`) — Node-only (`node:fs`), deliberately not
  exported from the browser-safe barrel. `validateConfigDir(dir)` parses every `*.json`
  pack and returns `{file, message}[]` issues. CI asserts the bundled `data/` validates
  clean and that a broken pack is flagged. There are 19 packs in `data/`, including
  `en-us-2025` + `en-us-2026` to demonstrate dated versioning.

## `@zii/id` — identity & address validators (M7)

~150 `validateXxx` / `generateXxx` pairs. Files: `common.ts` (market-independent
checksums — `luhnValid`, `validateAbaRouting`, `validateIban` ISO 7064 MOD-97-10),
`tw.ts`, `hk.ts`, `jp.ts`, `en.ts` (CA/AU), and `markets.ts` (the 15 newer markets in one
file). Validators return `boolean`; generators use a **seedable LCG** so output is
**deterministic per seed**.

> **Integrity rule (repo-wide):** every generated identifier is checksum-valid but
> otherwise arbitrary and **explicitly labelled TEST/QA-only — never a real person or
> entity**. This warning is in the source header of each generator file.

Worked example — Taiwan National ID (`src/tw.ts`): the letter is expanded to its official
Ministry-of-Interior two-digit area code (`TW_LETTER_CODE`, where `I=34, O=35, W=32…` —
*not* a plain `A=10` sequence), a weighted sum `[8,7,6,5,4,3,2,1]` is taken, and the number
is valid iff the sum is a multiple of 10. The 統一編號 (UBN) validator uses weights
`[1,2,1,2,1,2,4,1]` with the documented "7th-digit-is-7" carry exception. The app also has
an in-app `src/lib/regionkit.ts` for formats not in the package (US SSN/ZIP/EIN, UK
postcode/NINO/sort-code, phones) using the same seeded-PRNG, TEST/QA-only idiom.

## `@zii/payroll` — payroll & tax (M9)

Depends on `@zii/locale`. This engine is the clearest expression of "config as data":

- **Primitives** (`src/tax.ts`): `progressiveTax(brackets, taxable)` (marginal bracketing,
  `upTo: null` = top bracket); `salesTax(amount, rate, {inclusive?})` → `{net, tax, gross}`.
- **Rule-module contract** (`src/rules.ts`):
  ```ts
  interface PayrollRuleModule { market: string; version: number; computeNet(input: PayrollInput): PayrollBreakdown }
  ```
  with `makeFlatRateModule(config)` (reference), `grossForNet(module, targetNet)` (reverse
  payroll by bisection), and the key bridge **`makeTaxModuleFromPack(pack: LocalePack)`** —
  it builds a working payroll module straight from a locale pack's `payroll.socialInsurance`
  + `tax.incomeBrackets`. Add a market by shipping a pack; no new engine code.
- **Per-jurisdiction modules** (~20): `hk`, `jp-takehome`, `jp-furusato`, `ca`, `au`, `ko`,
  `de`, `fr`, `es`, `it`, `nl`, `sg`, `in`, `pt`, `br`, `mx`, `pl`, `nz`. Each ships a
  **dated, sourced config constant** (e.g. `HK_SALARIES_TAX_2024_25` with rates,
  allowances, MPF caps, and a `source` URL) passed as a defaulted parameter. HK salaries
  tax = `min(progressive-on-net-chargeable, standard-rate-on-net-total)`; also
  `hkMpfEmployeeAnnual`, `hkSeverancePayment`.

## `@zii/calendar` — calendar & eras (M6)

Depends on `@zii/locale` + `lunar-typescript`. Exports: ROC era (`gregorianToRoc`/
`rocToGregorian`, `ROC_OFFSET = 1911`), Japanese 和暦 (`toJapaneseEra`, `ERAS` table
reiwa→meiji), zodiac, Western + kazoe age, lunar/六曜/節気 (`gregorianToLunar`, `rokuyo`,
`solarTermsInYear`), and holiday logic. `src/holidays.ts` consumes a `LocalePack`:
`resolveHolidays(pack, year)`, `substituteIfWeekend` (振替休日), `isBusinessDay`,
`businessDaysBetween` — all UTC-field-based for timezone stability. This is the holiday
source that `@zii/reminders` draws on.

## `@zii/calc` — calculation & units (M5)

Zero dependencies. Barrel over: `calc.ts` (percentage, tip, discount, loan/amortization,
BMI, compound interest — throw-on-invalid-input), `units.ts` (`convert` across 13 unit
families), `cooking.ts` (`convertCooking`, `DENSITY_G_PER_ML`), `currency.ts`
(`convertCurrency` with an **injected** `RateProvider`), `dates.ts`, `timestamp.ts`,
`duration.ts`, `math.ts` (`gcd`/`lcm`), `subscriptions.ts`.

## `@zii/text` — text & data (M8)

The largest engine (~35 topic files). Deps: `opencc-js` (CJK 繁簡), `yaml`. Barrels
`toHalfWidth`/`toFullWidth`/`nfkcNormalize`, `countText`, case conversions,
`toSimplified`/`toTraditional`/`toTraditionalTaiwan`, `kanaToRomaji`, and JSON/CSV/base64/
URL/HTML/YAML format helpers, `lineDiff`, etc.

## `@zii/receipt` — TW uniform-invoice lottery (Phase 3)

`checkTwInvoice(receiptRaw, drawing)` normalizes a receipt to its trailing 8 digits and
matches against a drawing's prize numbers (full match → special NT$10M / grand NT$2M; else
longest-suffix match maps 8→first … 3→sixth; `additionalSixth` last-3 → NT$200). Prize
amounts fixed in `TW_PRIZE_AMOUNT`.

> **Data-trust guardrail in action:** `src/tw-drawings.ts` ships
> `TW_INVOICE_DRAWINGS = []` — **deliberately empty**, with a documented maintainer update
> process. Rather than ship fabricated or stale winning numbers, the app has the user enter
> the official numbers. This is the "no fabricated data" rule made concrete.

## `@zii/reminders` — holiday-aware recurrence (M10)

Depends on `@zii/calendar` + `@zii/locale`. Pure, deterministic, all date math in **UTC**.

- `nextOccurrence(reminder, from, holidaysIso=[])`, `upcomingOccurrences(reminder, from,
  count, holidaysIso=[])`, `buildNotification(reminder, fireDate)`.
- `Recurrence` is a closed discriminated union: `once | daily | weekly(weekday) |
  monthly(day)`. **Monthly clamps** day-31 to the real month length (Feb → 28/29).
- `skipHolidays: true` rolls a weekend/holiday landing **forward to the next business day**
  (via `isBusinessDay` from `@zii/calendar`), with iteration caps for determinism;
  `upcomingOccurrences` de-duplicates when two raw dates collapse onto the same business
  day. `holidaysIso` comes from the locale calendar pack, not hard-coded.
- `buildNotification` applies `leadDays` (fire N whole UTC days earlier); `fireAtIso` is UTC
  midnight.

## `@zii/compute` + `@zii/compute-wasm` — client WASM ops (M4)

Two layers:

- **`@zii/compute`** (zero deps) — the abstraction/registry. `ComputeOpMeta`
  (`{id, category, offline, needsWasm, isolated?}`) + `ComputeOp` (`{meta, load}`) with a
  `ComputeRegistry` that **caches each op's loaded handler** and won't "poison the cache"
  on a failed load. `NATIVE_OPS` (`sha-256`, `sha-1` via `crypto.subtle`) are real today;
  `WASM_OPS` (pdf-merge/split/compress, image-convert/compress, heic-to-jpg, qr-generate/
  scan, archive-zip/unzip, video-convert) are **throwing descriptors** until the real
  bundle is loaded.
- **`@zii/compute-wasm`** — the real handlers, fulfilling the same op ids using `pdf-lib`,
  `pdfjs-dist`, `@jsquash/*`, `heic-convert`, `zxing-wasm`, `fflate`, `@ffmpeg/*`. It exposes
  **subpath exports** (`./pdf`, `./image`, `./qr`, `./archive`, `./heic`, `./video`,
  `./ops`) so the app imports just one op and code-splits it. A **dual-runtime** helper
  (`wasm-env.ts`) makes each op work both in-browser (codec self-loads) and headless in Node
  (wasm bytes injected from `node_modules`), which is what lets the WASM ops be unit-tested.

  License discipline is enforced here: only permissive/LGPL WASM backends — pdf-lib (MIT),
  pdf.js (Apache), jSquash, ZXing, LGPL ffmpeg — **no AGPL (no MuPDF)**.

## Dependency graph of engines

```
@zii/registry   (none)
@zii/compute    (none)  →  @zii/compute-wasm  (pdf-lib, pdfjs, jsquash, ffmpeg, …)
@zii/locale     (zod)
@zii/calc       (none)
@zii/id         (none)
@zii/text       (opencc-js, yaml)
@zii/calendar   (@zii/locale, lunar-typescript)
@zii/payroll    (@zii/locale)
@zii/receipt    (none)
@zii/reminders  (@zii/calendar, @zii/locale)
@zii/backend    (node stdlib)
@zii/app        (every @zii/* as workspace:*, + react, tesseract.js, xlsx, bwip-js, …)
```
