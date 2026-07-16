# 08 — Coding Style & Conventions

## TypeScript posture

Strict throughout, from `tsconfig.base.json` (extended by every package):

- `strict: true` plus the strict-adjacent extras: **`noUncheckedIndexedAccess`**,
  `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- `module: ESNext`, `moduleResolution: Bundler`, `target: ES2022`, `verbatimModuleSyntax`,
  `isolatedModules`, `noEmit`, `forceConsistentCasingInFileNames`.

`noUncheckedIndexedAccess` is load-bearing and visible in the code: array/object index
access is treated as possibly-`undefined`, so engine code is full of explicit
`if (x === undefined) return null/throw` guards (see `@zii/id`'s checksum loops). This
makes the pure functions defensive by construction. `verbatimModuleSyntax` means imports
that are types must use `import type`.

## Linting & formatting

- **ESLint 9 flat config** (`eslint.config.mjs`): `js.recommended` + `tseslint.recommended`
  (not the type-checked variant). Ignores `dist`, `node_modules`, `.turbo`, `coverage`, and
  the generated Capacitor shells `ios/`/`android/`. One custom rule:
  `@typescript-eslint/no-unused-vars` = error with `^_` ignore patterns (underscore-prefixed
  = intentionally unused).
- **Prettier 3** (`.prettierrc.json`): `singleQuote`, `semi`, `trailingComma: "all"`,
  `printWidth: 100`. `.prettierignore` exempts all Markdown (`*.md`). Prettier is a
  manual/local gate — **not** in `pnpm verify` or CI; ESLint + `tsc` are the enforced ones.

## Naming & structure conventions

- **Tool ids** are kebab-case and enforced (`registry.register` throws otherwise). Market
  tools are prefixed by market: `tw-national-id`, `jp-furusato`, `hk-salaries-tax`,
  `de-iban`, `nz-kiwisaver`.
- **Packages** are `@zii/<name>`, `private`, `type: module`, exporting raw `src/index.ts`.
- **Engines are barrels**: `src/index.ts` re-exports named pure functions + types from
  topic/market files (`tw.ts`, `hk.ts`, `tax.ts`, `era.ts`, `pdf.ts`, …).
- **Tests** live in a sibling `test/` dir (not colocated in `src/`), named `*.test.ts`;
  grouped batches use `batchNN.test.ts`. Playwright specs are `*.spec.ts` in `e2e/`.
- **Public interfaces are frozen contracts** — `MODULE-STATE.json` records each package's
  frozen public API; downstream code depends on those signatures.

## Recurring code idioms

1. **Pure, deterministic, offline functions.** Engines take inputs, return values, touch no
   globals, do no I/O. Randomness is a **seedable LCG** so "generate" functions are
   reproducible per seed and unit-testable.
2. **Dependency injection over globals.** `convertCurrency` takes an injected `RateProvider`;
   `LocaleStore.loadFromUrl` takes an injected `fetchFn`; the backend `TTLCache` takes an
   injected `Clock`. Nothing reaches for `globalThis.fetch`/`Date.now` directly where a test
   would want to control it.
3. **Dated, sourced config objects.** Jurisdiction rules are constants like
   `HK_SALARIES_TAX_2024_25` carrying rates + a `source` URL, passed as a **defaulted last
   parameter** so a caller can override the year while the default keeps working.
4. **Localized dictionaries with English fallback.** `LangDict<T> = { en: T } &
   Partial<Record<Lang, T>>` + `tr(dict, lang)` — a tool can ship a subset of locales and
   fall back to English gracefully.
5. **Lazy everything at the boundary.** Every tool and heavy op is a dynamic `import()`; the
   catalog component is lazy; WASM/ML models load on first use.
6. **Fail loud on bad data.** The locale schema is `.strict()` (unknown key → error); the
   config gate fails CI; `calc` functions throw on invalid input.

## The integrity rule (project-wide, non-negotiable)

Where a tool needs authoritative data, it uses real specifications and cites sources; it
never invents values to fill a gap. Two concrete embodiments:

- **Generated identifiers are checksum-valid but arbitrary and labelled TEST/QA-only** —
  never presented as a real person/entity (source-header warnings in every `@zii/id`
  generator).
- **`@zii/receipt` ships `TW_INVOICE_DRAWINGS = []` deliberately empty** rather than
  fabricate lottery numbers; the user enters official numbers.

This is codified as guardrail §4.3 ("data integrity — versioned, dated, cited,
schema-validated, fail loud") in `DEVELOPMENT-PLAN.md`, and it is a recorded lesson in the
project's memory: *don't fabricate authoritative data.*

## Commit & branch conventions

- Conventional-commit prefixes: `feat:`, `fix:`, `docs:`, `chore:` (see `git log`).
- Feature branches → PRs → merge to `main` (e.g. `feature/five-markets-pt-br-mx-pl-nz`).
- `CHANGELOG.md` follows a loose Keep-a-Changelog format with dated entries.
- `BUILD-LOG.md` is an append-only per-module retro (Shipped / Acceptance / Deviations /
  Interfaces frozen / Follow-ups / Next) from the autonomous build loop.

## Documentation conventions

- Each engine package has a `README.md` describing its API (some of the smallest omit it).
- Root docs are operational (`DEVELOPMENT-PLAN`, `ROADMAP`, `DEPLOY`, `CHANGELOG`,
  `BUILD-LOG`, `MODULE-STATE.json`); `docs/` holds strategy + per-market feature catalogs.
- Code comments explain **why**, not what (e.g. the `heic-convert/browser` alias comment,
  the network-first SW rationale, the `TW_LETTER_CODE` non-obvious mapping note).
