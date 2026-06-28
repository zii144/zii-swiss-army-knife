# Zii Swiss Army Knife

A multi-market, privacy-first everyday-utility suite. This repository currently holds the **planning
docs** and the **platform foundation** being built module by module per `DEVELOPMENT-PLAN.md`.

## Documentation

| Doc | What it is |
|-----|-----------|
| `DEVELOPMENT-PLAN.md` | The autonomous 10-module build loop (foundation) |
| `TECH-STACK-PLAN.md` | Architecture, tech choices, and verification log |
| `CROSS-MARKET-OVERVIEW.md` | Consolidated view across all markets |
| `FEATURE-CATALOG.md` | Universal/general tool catalog |
| `FEATURE-CATALOG-TAIWAN.md` / `-HONGKONG.md` / `-JAPAN.md` / `-ENGLISH.md` | Per-market catalogs |
| `BUILD-LOG.md` | Append-only module retros (agent loop) |
| `MODULE-STATE.json` | Machine state for the autonomous build loop |

## Monorepo

pnpm workspaces + Turborepo. Engines are pure-TypeScript and market-agnostic; localization is config/data.

```
packages/
  registry/     # @zii/registry  — tool registry + lazy plugin loader (M1)
  hello-tool/   # @zii/hello-tool — sample tool / smoke test (M1)
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
