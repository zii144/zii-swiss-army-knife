# Zii Swiss Army Knife

A multi-market, privacy-first everyday-utility suite — file conversion, calculators, PDF/image tools, text utilities, and region-specific validators in one offline-capable PWA.

**Current state:** platform foundation (M1–M10) complete; **Phase 2 universal catalog shipped** (170 tool screens); **Phase 3 market locale packs** underway (TW / HK / JP / EN-US / EN-GB). See `ROADMAP.md` for what comes next.

## Highlights

- **170 tools** across calc, files, PDF, image, text, dev, identity, and everyday categories — lazy-loaded, code-split, with a ~103 KB gz initial payload (110 KB gz budget)
- **8 UI languages** (en, zh-TW, zh-HK, ja, ko, es, fr, de) with fully localized tool names
- **6 selectable markets** (global, tw, hk, jp, en-us, en-gb) — region-specific tools appear only in their market
- **Offline-first** — most tools run entirely on-device; heavy WASM/OCR models download on first use
- **Static PWA** — prerendered pages for SEO (`sitemap.xml`, `robots.txt`, JSON-LD), hand-rolled service worker, deployable to any static host (Vercel config included)

## App routes

```
/{locale}                  # marketing home + featured tools
/{locale}/tools            # searchable tool catalog (market filter + category chips)
/{locale}/tools/{tool-id}  # individual tool screen
```

Run locally: `pnpm --filter @zii/app dev` → open `http://localhost:5173/en/tools`

## Documentation

Operational (repo root):

| Doc | What it is |
|-----|-----------|
| `DEVELOPMENT-PLAN.md` | The autonomous 10-module build loop (foundation) |
| `ROADMAP.md` | Post-foundation product roadmap (universal tools → locale packs → mobile → AI) |
| `DEPLOY.md` | Static deploy guide (Vercel, env vars, build pipeline) |
| `BUILD-LOG.md` | Append-only module retros (agent loop) |
| `MODULE-STATE.json` | Machine state for the autonomous build loop |
| `CHANGELOG.md` | Release notes |

Research & strategy (`docs/`):

| Doc | What it is |
|-----|-----------|
| `docs/TECH-STACK-PLAN.md` | Architecture, tech choices, and verification log |
| `docs/CROSS-MARKET-OVERVIEW.md` | Consolidated view across all markets |
| `docs/FEATURE-CATALOG.md` | Universal/general tool catalog |
| `docs/PHASE-2-PLAN.md` | Phase 2 universal-tool rollout batches |
| `docs/FEATURE-CATALOG-TAIWAN.md` / `-HONGKONG.md` / `-JAPAN.md` / `-ENGLISH.md` | Per-market catalogs |

## Monorepo

pnpm workspaces + Turborepo. Engines are pure-TypeScript and market-agnostic; localization is config/data.

```
packages/
  registry/      # @zii/registry       — tool registry + lazy plugin loader (M1)
  hello-tool/    # @zii/hello-tool     — sample tool / smoke test (M1)
  locale/        # @zii/locale         — locale-pack schema, loader, config gate (M2)
  app/           # @zii/app            — Vite + React PWA (170 tools, prerender, i18n) (M3+)
  compute/       # @zii/compute        — WASM compute registry + lazy ops (M4)
  compute-wasm/  # @zii/compute-wasm   — pdf/image/heic/qr/archive WASM bundles (M4)
  calc/          # @zii/calc           — calculators + unit/cooking/currency (M5)
  calendar/      # @zii/calendar       — ROC/和暦 eras, zodiac, holidays (M6)
  id/            # @zii/id             — ID/checksum validators + generators (M7)
  text/          # @zii/text           — CJK text + data/format tools (M8)
  payroll/       # @zii/payroll        — payroll + tax engine (M9; HK 薪俸稅, JP ふるさと納税)
  receipt/       # @zii/receipt        — TW 統一發票 lottery prize matching (Phase 3)
  reminders/     # @zii/reminders      — holiday-aware recurrence engine (M10)
  backend/       # @zii/backend        — stateless no-retention services (M10)
```

## Develop

```bash
corepack enable
pnpm install
pnpm verify      # typecheck + lint + test + build + license-scan
```

Individual gates: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build` · `pnpm check:licenses`

App shell:

```bash
pnpm --filter @zii/app dev       # Vite dev server
pnpm --filter @zii/app build     # SPA + prerender → packages/app/dist/
pnpm --filter @zii/app preview   # serve the production build locally
```

## Deploy

The app builds to a fully prerendered static `packages/app/dist/`. Root [`vercel.json`](./vercel.json) is ready for Vercel; set `ZII_ORIGIN` to your production domain. See [`DEPLOY.md`](./DEPLOY.md) for details and Netlify/Cloudflare equivalents.

## Guardrails (enforced)

No AGPL/GPL-only dependencies · offline-first engines · no server-side PII · locale-pluggable engines · bundle-size budget on every app build.
See `DEVELOPMENT-PLAN.md` §4.
