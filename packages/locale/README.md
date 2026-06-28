# @zii/locale

Locale-pack system and shared config (Module **M2**). Locale is **not just translated strings** — a
pack selects rules, formats, data sources, enabled tools, and toggles. Every engine (calc, calendar,
id, payroll…) consumes a pack at runtime, so localization is **config + data, not new code**.

## What's here

- **`LocalePackSchema`** (Zod) — strict, versioned, dated schema covering `payroll`, `tax`, `holidays`,
  `id`, `address`, `units`, `currency`, `calendars`, `dataSources`, `tools`, and `toggles`.
  Unknown top-level keys fail loudly.
- **`LocaleStore`** — holds many packs (market × effectiveDate) and resolves:
  - `resolve(market, date)` → the latest pack whose `effectiveDate ≤ date` (reproducible historical math),
  - following a **fallback chain** (`en-ca → en-gb → en-us`).
  - `loadFromUrl(fetch, url)` — hot-update from a CDN via an **injected** fetch provider (offline-first/testable).
- **`validateConfigDir(dir)`** (Node-only, in `./validate`) — the **config-validation gate**: validates every
  `*.json` pack in a directory. Run as part of `pnpm test` (see `test/data.test.ts`); an invalid pack fails CI.

## Usage

```ts
import { createLocaleStore } from '@zii/locale';

const store = createLocaleStore();
store.addMany([twPack2026, enUsPack2026]);
store.resolve('tw', new Date('2026-06-01')); // effective TW pack
store.resolve('en-ca');                       // falls back to en-gb → en-us
```

Sample packs live in `data/` (tw, en-us ×2 years, en-gb) and are validated by the test gate.

## Scripts

`pnpm build` (tsc) · `pnpm typecheck` · `pnpm test` (vitest, incl. config gate) · `pnpm lint`
