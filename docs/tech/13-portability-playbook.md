# 13 — Portability Playbook

This makes the pack *actionable*: the concrete recipes for reproducing, extending, and
reusing this project — the "how to fork the config, not the app" in practice. It doubles as
the onboarding guide for a new contributor.

## Run it locally

```bash
corepack enable                 # activates pnpm@9.15.0
pnpm install
pnpm --filter @zii/app dev      # Vite dev server → http://localhost:5173/en/tools
pnpm verify                     # typecheck + lint + test + build + license scan
```

Individual gates: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build` ·
`pnpm check:licenses`. E2E: `pnpm --filter @zii/app test:e2e` (first run:
`pnpm --filter @zii/app exec playwright install chromium`).

> **Gotcha (from project memory):** a newly-added lazy tool can show "coming soon" in the
> browser because the **service worker serves a cached bundle**. Verify new tools against a
> fresh **built** output (`pnpm --filter @zii/app build && preview`), not just the hot dev
> server, and hard-reload / clear the SW cache.

## Recipe A — add a universal (global) tool ("skill")

The fixed **5-edit contract** (this is exactly how Phase 2 batches were built):

1. **Engine** — put the pure logic in the right engine package (e.g. a new function in
   `@zii/text` or `@zii/calc`), export it from that package's `src/index.ts` barrel, and add
   a colocated `test/*.test.ts` with a golden-anchor case. Keep it pure/deterministic.
2. **Catalog entry** — add a `CatalogTool` to `CATALOG` in
   `packages/app/src/lib/catalog.ts`: `id` (kebab-case), `category`, `offline`, `keywords`,
   `name` (`L10n`, English required), `blurb`. Omit `markets` to default to `['global']`.
3. **Loader** — add `'<id>': () => import('./<id>')` to `LOADERS` in
   `packages/app/src/tools/index.ts`.
4. **View** — create `packages/app/src/tools/<id>.tsx`: a thin default-export React
   component taking `ToolViewProps`, building a `LangDict` of strings, calling the engine,
   and rendering via a shared component (`ToolPage` / `IdTool` / the `ui/*` primitives).
5. **Icon** — add the tool's icon mapping in `src/lib/icons.ts` (or rely on the category
   icon).

Then verify: `pnpm --filter @zii/app test` (the `app-tools` test asserts every catalog id
has a loader + view), `pnpm --filter @zii/app test:e2e` (the smoke sweep auto-generates a
test for the new tool), and `pnpm --filter @zii/app build` (must stay under 128 KB gz — if
it doesn't, the tool's chunk isn't code-split correctly).

## Recipe B — add a market-specific tool

Same 5 edits as Recipe A, plus:

- Give the catalog entry a `markets: ['<market>']` array (e.g. `['de']`, `['en-nz']`).
- Prefix the id and filename by market: `de-iban`, `nz-kiwisaver`.
- Put jurisdiction logic in `@zii/id` (validators, in `markets.ts` or a per-market file) or
  `@zii/payroll` (a rule module + a **dated, sourced config constant** like
  `XX_TAX_2026` with a `source` URL), passed as a defaulted parameter.

## Recipe C — add a whole new market

To bring up a new country/region end-to-end:

1. **Register the market** — add the literal to the `Market` union in
   `packages/registry/src/types.ts` **and** the mirrored `z.enum` in
   `packages/locale/src/schema.ts` (they're kept in sync deliberately), and to
   `SELECTABLE_MARKETS` + `MARKET_LABELS` in `packages/app/src/lib/tools.ts` (with a
   flag glyph and 8-language label).
2. **Fallback chain** (optional) — add an entry to `FALLBACK` in
   `packages/locale/src/store.ts` if the market should inherit from a base (e.g.
   `en-nz → [en-gb, en-au, en-us]`).
3. **Locale pack** — add `packages/locale/data/<market>-<year>.json` conforming to the
   strict `LocalePackSchema` (currency, units, calendars, `tax.incomeBrackets`,
   `payroll.socialInsurance`, `holidays.list`, `id.validators`, `tools.enabled`,
   `toggles`). The config gate test will validate it.
4. **Engines** — add the market's ID validators (`@zii/id`) and payroll modules
   (`@zii/payroll`) — or, where a pack fully describes the rules, reuse
   `makeTaxModuleFromPack(pack)` with **no new engine code**.
5. **Tools** — add the market's tool screens (Recipe B) and country-map entries for SEO
   `areaServed` in `seo.ts` (`MARKET_COUNTRY`).
6. **Docs** — add a `docs/FEATURE-CATALOG-<COUNTRY>.md` and note the batch in `CHANGELOG.md`.

The bundle budget may need a small bump for the new shell labels (the pattern in
`CHANGELOG.md`): raise `ZII_BUNDLE_BUDGET_KB` / the default in `check-bundle.mjs`.

## Recipe D — reuse an engine outside this app

The engines are framework-agnostic pure-TS libraries with frozen public APIs, so they lift
cleanly:

- Import the barrel (`@zii/id`, `@zii/calc`, `@zii/payroll`, `@zii/calendar`,
  `@zii/reminders`, `@zii/text`, `@zii/receipt`) into any TS/JS project.
- They ship **source** (`exports: "./src/index.ts"`), so the consumer's bundler transpiles
  them — or publish compiled builds if you need `dist/`.
- Keep the **injected-dependency** contracts: pass a `RateProvider` to `convertCurrency`, a
  `fetchFn` to `LocaleStore.loadFromUrl`, `holidaysIso` to the reminders functions.
- Preserve the **integrity rule**: generated identifiers stay TEST/QA-only; don't ship
  fabricated authoritative data.

## Recipe E — add mobile UI/release automation (greenfield)

Neither Fastlane nor Maestro exists today. If you need them:

- **Maestro** (device UI flows) — add a `.maestro/` directory with YAML flows targeting
  `appId: dev.zii.knife`; run against a simulator/emulator after `pnpm --filter @zii/app
  mobile:sync`. Add a CI job that boots a simulator (macOS runner for iOS).
- **Fastlane** (signing + store upload) — add `fastlane/Fastfile` under `packages/app/ios`
  (and/or `android`) with `build_app`/`upload_to_testflight` lanes; wire secrets via CI.
- Note `mobile:sync` uses `build:spa` (SPA only) — decide whether your native build should
  run the full prerender pipeline instead.

## Recipe F — deploy your own instance

1. `ZII_ORIGIN=https://your.domain` (canonical URLs / sitemap).
2. Optional: `VITE_BACKEND_URL=https://your-backend` to enable doc-conversion / live-FX
   tools; deploy `@zii/backend` (`docker-compose.yml` = backend + Gotenberg) behind HTTPS +
   rate limiting, and set `CORS_ORIGIN` to your app origin.
3. Deploy `packages/app/dist/` to Vercel (config included) or any static host with clean
   URLs + SPA fallback + `/`→`/en` redirect (Netlify/Cloudflare equivalents in `DEPLOY.md`).
4. Keep the security headers (CSP/COOP/COEP/…) — the app depends on `'wasm-unsafe-eval'`
   and COOP/COEP for its WASM tools.

## Invariants to preserve when porting

If you take this project somewhere new, these are the load-bearing rules that make it what
it is — break them and it stops being "Zii":

1. **On-device by default; no PII off the device.** (Enforced by CSP, camera-off, opt-in
   no-retention backend.)
2. **Engines stay pure and market-agnostic.** Localization is config + data, never engine
   branches.
3. **Every tool is code-split; the initial payload stays under budget.** (Enforced by
   `check-bundle.mjs`.)
4. **Permissive licenses only.** (Enforced by `check-licenses.mjs` — no AGPL/GPL.)
5. **Never fabricate authoritative data.** Generated values are TEST/QA-only; real data is
   dated, sourced, and validated, or the user supplies it.
6. **One catalog is the source of truth** for registry metadata, UI labels, and SEO — keep
   them fed from `catalog.ts`, never hand-desynced.
