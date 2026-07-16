# 01 — Project Overview

## What it is

**Zii Swiss Army Knife** is a multi-market, privacy-first, offline-capable
**Progressive Web App** that bundles a large catalog of everyday utility tools —
file conversion, PDF/image manipulation, calculators, unit/currency conversion,
date/calendar tools, text utilities, developer helpers, generators, and
region-specific identity/tax/payroll tools — into one app. Its guiding promise:
**solve daily "little jobs" in one place, on-device, with nothing uploaded.**

The name is literal: like a Swiss Army knife, it is a single handle exposing many
small, sharp, single-purpose tools. In this pack we call each tool a **"skill"**
(see [`04-tool-system-and-skills.md`](04-tool-system-and-skills.md)).

## Scale (as of the latest commit — read from code, not the stale README)

| Dimension | Count | Source of truth |
|-----------|-------|-----------------|
| Tool screens (UI) | **318** `.tsx` files | `packages/app/src/tools/*.tsx` |
| Catalog entries | **319** | `packages/app/src/lib/catalog.ts` (`CATALOG`) |
| Code-split lazy loaders | **318** | `packages/app/src/tools/index.ts` (`LOADERS`) |
| Tool categories | **12** | `ToolCategory` in `packages/registry/src/types.ts` |
| Markets (countries/regions) | **20 named + `global`** = 21 selectable | `Market` in `packages/registry/src/types.ts` |
| UI languages | **8** | `Lang` in `packages/app/src/lib/i18n.ts` |
| Workspace packages | **14** | `packages/*` |
| Test files | **~82 unit + 4 E2E specs** | `packages/*/test`, `packages/app/e2e` |
| Initial JS payload budget | **128 KB gz** (enforced) | `packages/app/scripts/check-bundle.mjs` |

> The repo's root `README.md`/`ROADMAP.md` were written at an earlier milestone and
> still say "170 tools / 6 markets / 110 KB". Trust the code figures above.

**The 12 categories:** `file`, `pdf`, `image`, `text`, `calc`, `convert`,
`datetime`, `id`, `finance`, `generator`, `dev`, `daily`.

**The 20 markets:** `tw` (Taiwan), `hk` (Hong Kong), `jp` (Japan), `en-us`, `en-gb`,
`en-ca`, `en-au`, `ko` (Korea), `de` (Germany), `fr` (France), `es` (Spain),
`it` (Italy), `nl` (Netherlands), `en-sg` (Singapore), `en-in` (India), `pt`
(Portugal), `br` (Brazil), `mx` (Mexico), `pl` (Poland), `en-nz` (New Zealand) —
plus `global` (shown everywhere).

**The 8 UI languages:** `en`, `zh-TW`, `zh-HK`, `ja`, `ko`, `es`, `fr`, `de`.

## Core product principles (the "why")

1. **Privacy-first / on-device.** Almost every tool runs entirely in the browser.
   No account, no server round-trip for the work itself, no PII leaves the device.
   Heavier engines (WASM codecs, OCR/ML models) download on first use but still run
   locally. See [`11-security-and-privacy.md`](11-security-and-privacy.md).
2. **Offline-first.** A hand-rolled service worker + Capacitor packaging mean the
   app works with no network.
3. **Breadth without bloat.** Hundreds of tools, but the initial download stays
   small because every tool is code-split and lazy-loaded, and a **bundle-size
   budget is enforced on every build**.
4. **Market-agnostic engines, config-driven localization.** The computation lives
   in pure-TypeScript engine packages that know nothing about UI or region; markets
   and languages are data/config layered on top.
5. **No fabricated data / integrity rule.** Where a tool needs authoritative data
   (tax tables, checksums, holidays), it uses real specifications, and generated
   sample values (e.g. ID numbers) are explicitly marked test-only. Nothing is made
   up to fill a gap.

## Current state & "all directions"

The project has moved through clearly-staged phases (detailed in
[`12-roadmap-and-directions.md`](12-roadmap-and-directions.md)):

- **Platform foundation (M1–M10)** — complete. Registry + lazy plugin loader,
  locale-pack system, PWA shell, WASM compute abstraction, and the core engines
  (calc / calendar / id / text / payroll / reminders / backend).
- **Phase 2 — universal tool catalog** — shipped. The market-agnostic tools
  (files, PDF, image, text, calc, convert, datetime, dev, generators).
- **Phase 3 — market locale packs** — largely shipped and still expanding. Started
  with TW/HK/JP/EN-US/EN-GB, then five-market batches added KO/CA/AU/DE/FR, then
  ES/IT/NL/SG/IN, then PT/BR/MX/PL/NZ — 20 markets total.
- **Phase 4 — multi-platform delivery** — in progress. iOS/Android via Capacitor
  (iOS verified in simulator); a Playwright headless E2E suite loads and checks
  every tool on each CI run.
- **Future — the "AI layer"** — planned, not yet built. Today's "AI" surface is
  (a) on-device **ML** tools (OCR via tesseract.js, background removal), and
  (b) an **LLM-discoverability** layer (`llms.txt`, `llms-full.txt`, `tools.json`,
  `ai.txt`) so AI agents/crawlers can find and describe the catalog. There is **no
  LLM inference in the product itself** yet — do not assume otherwise.

## Repository map

```
zii-swiss-army-knife/
├── packages/            # pnpm workspace — 14 packages (see 02-architecture.md)
│   ├── app/             # @zii/app — Vite + React 19 PWA shell + all tool screens + native shells
│   ├── registry/        # @zii/registry — tool registry + lazy plugin loader
│   ├── locale/          # @zii/locale — locale-pack schema/loader/config gate
│   ├── calc/ calendar/ id/ text/ payroll/ receipt/ reminders/   # pure-TS engines
│   ├── compute/ compute-wasm/   # WASM compute registry + bundles
│   ├── backend/         # @zii/backend — stateless, no-retention services
│   └── hello-tool/      # sample tool / smoke test
├── docs/                # strategy + per-market feature catalogs (+ this tech/ pack)
├── scripts/             # repo-level scripts (license scan)
├── .github/workflows/   # CI (verify + e2e)
├── DEVELOPMENT-PLAN.md ROADMAP.md DEPLOY.md CHANGELOG.md BUILD-LOG.md MODULE-STATE.json
├── turbo.json pnpm-workspace.yaml vercel.json tsconfig.base.json eslint.config.mjs
```

## Who the audience is

Everyday users doing small tasks (convert a file, validate an ID, compute
take-home pay, generate a QR code) who value privacy and speed, across 20 countries
and 8 languages — plus AI agents that can discover and route to individual tools via
the machine-readable catalog.
