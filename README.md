# Zii Swiss Army Knife

A multi-market, privacy-first everyday-utility suite — file conversion, calculators, PDF/image tools, text utilities, and region-specific validators in one offline-capable PWA.

**Current state:** platform foundation (M1–M10) complete; **Phase 2 universal catalog shipped**; **Phase 3 market locale packs** at **20 markets + `global`**; **Phase 4 multi-platform delivery** in progress — Capacitor iOS/Android shell (iOS verified in-simulator) plus a Playwright E2E suite that loads every tool on each CI run. Phase 5 AI layer is planned, not built. Authoritative detail: [`docs/tech/`](docs/tech/) (especially [`01-overview.md`](docs/tech/01-overview.md) and [`12-roadmap-and-directions.md`](docs/tech/12-roadmap-and-directions.md)).

## Highlights

- **~318 tool screens / 319 catalog entries** across calc, files, PDF, image, text, convert, datetime, finance, generators, identity, and everyday categories — lazy-loaded, code-split, with a **128 KB gz** initial payload budget
- **8 UI languages** (en, zh-TW, zh-HK, ja, ko, es, fr, de) with localized chrome and tool names
- **20 named markets + `global`** — region-specific tools appear only in their market
- **Offline-first** — most tools run entirely on-device; heavy WASM/OCR models download on first use
- **Static PWA** — prerendered pages for SEO (`sitemap.xml`, `robots.txt`, JSON-LD) and LLM discovery (`llms.txt`, `llms-full.txt`, `tools.json`, `ai.txt`), hand-rolled service worker, deployable to any static host (Vercel config included)

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
| `docs/tech/` | **Authoritative** technical blueprint (architecture, stack, testing, deploy, security, roadmap) |
| `ROADMAP.md` | Product roadmap (phases 1–5; see also `docs/tech/12-roadmap-and-directions.md`) |
| `DEPLOY.md` | Static deploy guide (Vercel, env vars, build pipeline) |
| `DEVELOPMENT-PLAN.md` | The autonomous 10-module build loop (foundation) |
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
| `docs/FEATURE-CATALOG-*.md` | Per-market catalogs |

## Monorepo

pnpm workspaces + Turborepo. Engines are pure-TypeScript and market-agnostic; localization is config/data.

```
packages/
  registry/      # @zii/registry       — tool registry + lazy plugin loader (M1)
  hello-tool/    # @zii/hello-tool     — sample tool / smoke test (M1)
  locale/        # @zii/locale         — locale-pack schema, loader, config gate (M2)
  app/           # @zii/app            — Vite + React PWA (~318 tools, prerender, i18n) (M3+)
  compute/       # @zii/compute        — WASM compute registry + lazy ops (M4)
  compute-wasm/  # @zii/compute-wasm   — pdf/image/heic/qr/archive WASM bundles (M4)
  calc/          # @zii/calc           — calculators + unit/cooking/currency (M5)
  calendar/      # @zii/calendar       — ROC/和暦 eras, zodiac, holidays (M6)
  id/            # @zii/id             — ID/checksum validators + generators (M7)
  text/          # @zii/text           — CJK text + data/format tools (M8)
  payroll/       # @zii/payroll        — payroll + tax engine (M9+)
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

Everything above runs in CI on every push/PR ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), alongside a separate **E2E job**.

### End-to-end tests

Playwright drives the real production build (prerender + hydration) headlessly — an all-tools smoke sweep loads every catalog tool and asserts each mounts, exposes a control, and throws no errors, plus functional spot-checks that assert real outputs.

```bash
pnpm --filter @zii/app test:e2e     # requires: pnpm --filter @zii/app exec playwright install chromium
```

App shell:

```bash
pnpm --filter @zii/app dev       # Vite dev server
pnpm --filter @zii/app build     # SPA + prerender → packages/app/dist/
pnpm --filter @zii/app preview   # serve the production build locally
```

## Mobile (Capacitor)

The web app doubles as the native iOS/Android shell via [Capacitor](https://capacitorjs.com/). The same offline PWA is bundled into each app — no server, no live-data tools added.

```bash
pnpm --filter @zii/app mobile:sync       # build SPA + copy assets into ios/ & android/
pnpm --filter @zii/app mobile:ios        # sync, then open the Xcode project
pnpm --filter @zii/app mobile:android    # sync, then open Android Studio
```

`appId: dev.zii.knife`. Native project sources are committed; build artifacts and copied web assets are git-ignored. iOS builds today (Xcode); Android needs an Android SDK on the build machine. Native camera OCR / push / NFC plugins are Phase 4 follow-ups — see `ROADMAP.md`.

## Deploy

The app builds to a fully prerendered static `packages/app/dist/`. Root [`vercel.json`](./vercel.json) is ready for Vercel; set `ZII_ORIGIN` to your production domain. See [`DEPLOY.md`](./DEPLOY.md) for details and Netlify/Cloudflare equivalents.

Heavy document conversion (LibreOffice/Gotenberg) is an optional separate backend — not part of the default static deploy. See `packages/backend/DEPLOY.md` and `VITE_BACKEND_URL`.

## Guardrails (enforced)

No AGPL/GPL-only dependencies · offline-first engines · no server-side PII · locale-pluggable engines · bundle-size budget on every app build.
See `DEVELOPMENT-PLAN.md` §4.
