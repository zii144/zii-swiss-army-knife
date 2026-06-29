# Zii Swiss Army Knife

A multi-market, privacy-first everyday-utility suite. This repository holds the planning docs (`docs/`)
and the completed **platform foundation** (modules M1–M10), built per `DEVELOPMENT-PLAN.md`.

## Documentation

Operational (repo root):

| Doc | What it is |
|-----|-----------|
| `DEVELOPMENT-PLAN.md` | The autonomous 10-module build loop (foundation) |
| `ROADMAP.md` | Post-foundation product roadmap (universal tools → locale packs → mobile → AI) |
| `BUILD-LOG.md` | Append-only module retros (agent loop) |
| `MODULE-STATE.json` | Machine state for the autonomous build loop |
| `CHANGELOG.md` | Release notes |

Research & strategy (`docs/`):

| Doc | What it is |
|-----|-----------|
| `docs/TECH-STACK-PLAN.md` | Architecture, tech choices, and verification log |
| `docs/CROSS-MARKET-OVERVIEW.md` | Consolidated view across all markets |
| `docs/FEATURE-CATALOG.md` | Universal/general tool catalog |
| `docs/FEATURE-CATALOG-TAIWAN.md` / `-HONGKONG.md` / `-JAPAN.md` / `-ENGLISH.md` | Per-market catalogs |

## Monorepo

pnpm workspaces + Turborepo. Engines are pure-TypeScript and market-agnostic; localization is config/data.

```
packages/
  registry/    # @zii/registry   — tool registry + lazy plugin loader (M1)
  hello-tool/  # @zii/hello-tool — sample tool / smoke test (M1)
  locale/      # @zii/locale     — locale-pack schema, loader, config gate (M2)
  app/         # @zii/app        — Vite + React PWA app shell (M3)
  compute/     # @zii/compute    — WASM compute registry + lazy ops (M4)
  calc/        # @zii/calc       — calculators + unit/cooking/currency (M5)
  calendar/    # @zii/calendar   — ROC/和暦 eras, zodiac, holidays (M6)
  id/          # @zii/id         — ID/checksum validators + generators (M7)
  text/        # @zii/text       — CJK text + data/format tools (M8)
  payroll/     # @zii/payroll    — payroll + tax engine (M9)
  reminders/   # @zii/reminders  — holiday-aware recurrence engine (M10)
  backend/     # @zii/backend    — stateless no-retention services (M10)
```

## Develop

```bash
corepack enable
pnpm install
pnpm verify      # typecheck + lint + test + build + license-scan
```

Individual gates: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build` · `pnpm check:licenses`

## Guardrails (enforced)

No AGPL/GPL-only dependencies · offline-first engines · no server-side PII · locale-pluggable engines.
See `DEVELOPMENT-PLAN.md` §4.
