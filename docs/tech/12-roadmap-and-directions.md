# 12 — Roadmap & All Directions

This concludes every direction the project has taken and plans to take, distilled from
`DEVELOPMENT-PLAN.md`, `ROADMAP.md`, `docs/TECH-STACK-PLAN.md`, `docs/PHASE-2-PLAN.md`,
`docs/CROSS-MARKET-OVERVIEW.md`, `MODULE-STATE.json`, and `CHANGELOG.md`. Each item is
marked **built**, **in progress**, or **planned** — the project's discipline is to *defer
behind a named prerequisite rather than fake it*, so the distinction matters.

## How the project was built: the autonomous module loop

The foundation was built by an **AI agent running a fully autonomous build loop**
(`DEVELOPMENT-PLAN.md`), gated by **machine-checkable criteria, not human review**. Each
module ran: Context → Plan → Scaffold (test-first) → Implement → **Self-verify** (typecheck,
lint, unit+golden, e2e, bundle-size, perf, license-scan, config-schema) → Data/fact-check
against cited fixtures → Document → Integrate → Exit gate → Retro + commit. Bounded retry
(≤3 per failure) then a §5 BLOCKER halts. State is tracked in `MODULE-STATE.json` +
`BUILD-LOG.md`. This is *why* the codebase is so uniform and heavily tested — the process
enforced it.

## Foundation — M1–M10 (built, green)

| Module | Delivered | Package(s) |
|--------|-----------|------------|
| M1 | Monorepo + agent harness + tool registry + license gate | `@zii/registry`, `@zii/hello-tool` |
| M2 | Locale-pack system (Zod schema, dated loader, fallback chain, config gate) | `@zii/locale` |
| M3 | UI/PWA app shell, lazy per-tool loading | `@zii/app` |
| M4 | Client WASM compute abstraction + real bundles | `@zii/compute`, `@zii/compute-wasm` |
| M5 | Calculators + units/cooking/currency | `@zii/calc` |
| M6 | Calendar/era + lunar/六曜/節気 + holidays | `@zii/calendar` |
| M7 | Identity/address validators + generators | `@zii/id` |
| M8 | CJK text + data/format tools | `@zii/text` |
| M9 | Payroll/tax with pluggable per-jurisdiction rule contract | `@zii/payroll` |
| M10 | Holiday-aware reminders + stateless no-retention backend | `@zii/reminders`, `@zii/backend` |

Recorded state: all 10 complete; **376 tests green; 235 deps license-clean.**

## Phase 1 — wire the first real tools (built)

Closed out deferred foundation work (real WASM ops, lunar/六曜/節気, full OpenCC,
payroll reverse-calc `grossForNet`) and proved the full **engine → registry → usable UI**
path with the first ~10 universal tools under the bundle + license gates.

## Phase 2 — universal tool breadth (built/shipping)

The market-agnostic catalog: files, PDF, image, text, calc, convert, datetime, dev,
generators, encoding. Rolled out in batches under a fixed 5-edit build contract (catalog
entry + loader + `*.tsx` + icon), each batch ending green under the bundle gate. Grew the
catalog toward the ~200-universal-tool target; the whole catalog is now **~319 tools**.

## Phase 3 — market locale packs (built, still expanding)

Localized cores built as **config + data** (dated, sourced, schema-validated), engines in
`@zii/payroll` + `@zii/id` + `@zii/calendar`, one locale pack per market. Growth trail
(`CHANGELOG.md`):

- Original cluster: **TW / HK / JP / EN-US / EN-GB** (with `@zii/receipt` TW 統一發票,
  HK 薪俸稅 + MPF + severance, JP ふるさと納税 / 手取り / かな→ローマ字, subscription tracker).
- **+ KO / CA / AU / DE / FR** (2026-07-12) — 50 regional tools.
- **+ ES / IT / NL / SG / IN** (2026-07-12) — 50 regional tools.
- **+ PT / BR / MX / PL / NZ** (2026-07-15) — 50 regional tools.

Now **20 markets + global**. Live gov-data feeds and NFC were **deliberately deferred**
(integrity + capability gates) — not fabricated.

## Phase 4 — multi-platform delivery (in progress)

- **Mobile (Capacitor)** — iOS **verified in simulator**; Android syncs (needs an Android
  SDK). Native camera OCR / push / NFC are **follow-ups, not built**. — *in progress*
- **E2E (Playwright)** — the all-tools headless sweep + functional spot-checks. — *built*
- **Desktop (Tauri 2)** — named, **not started**. — *planned*

## Phase 5 — the AI layer (planned, NOT built)

The reserved AI phase: natural-language tool routing, on-device receipt/form field
extraction, smart reminder extraction from text, market-aware guidance. Firm constraints
already written: must **degrade gracefully offline**, **never silently upload PII**, and
remain an *enhancement over* the deterministic engines. **Nothing here is implemented.**

Today's only "AI" surfaces are (a) on-device ML tools (OCR, background removal) and (b) the
**LLM-discoverability layer** (`llms.txt`, `llms-full.txt`, `tools.json`, `ai.txt`,
AI-crawler `robots.txt`). See [`04-tool-system-and-skills.md`](04-tool-system-and-skills.md) §6.

## Deferred / explicitly out of scope (each gated on a prerequisite)

- Live gov-data feeds (invoice numbers, transit ETAs, weather/quake/AQI, utility bills,
  garbage schedules) — gated on data-freshness/maintenance capacity.
- NFC transit-card balance (FeliCa) — capability-detected bonus only.
- Native mobile OCR / push notifications.
- Tauri desktop.
- Correctness-sensitive PDF operations: sign / redact / encrypt; high-fidelity PDF→Word;
  RAR / 7z.

## The two biggest non-technical risks (named by the roadmap)

1. **Scope breadth** — ~200+ universal tools × many localized cores is a lot to maintain.
2. **Live-data freshness** — lottery numbers, transit ETAs, and tax tables rot fast.

Every phase therefore carries an explicit **data-trust** and **maintenance** exit criterion,
not just a feature checklist. The recommended fallback if upkeep capacity is thin is to
**sequence markets (TW → JP/HK → EN)** rather than abandon scope mid-phase.

## Direction summary (one line each)

- **Breadth:** more universal tools toward/beyond the ~200 target.
- **Depth:** more markets as dated locale packs (config, not code).
- **Platforms:** web (live) → mobile (in progress) → desktop (planned).
- **Intelligence:** on-device ML tools now; a privacy-preserving AI layer later.
- **Trust:** never fabricate authoritative data; defer live feeds behind maintenance
  capacity; keep everything on-device by default.
