# Zii Swiss Army Knife — Autonomous Module Build Plan

*A repeatable loop process an AI agent runs to build the platform foundation, module by module.*

Last updated: June 28, 2026

> **Scope of this plan:** the **10 platform-foundation modules** — all shared, market-agnostic infrastructure and every core engine. No single market is finished here; localization (TW/JP/HK/EN packs) comes *after* this foundation, plugging into what these modules build.
> **Operating mode:** **fully autonomous.** The agent runs each module's full loop unattended, self-verifies against hard gates, and advances to the next module on its own. It stops for a human **only** when a defined blocker triggers (§5).
>
> Companions: `docs/TECH-STACK-PLAN.md` (architecture & decisions), `docs/CROSS-MARKET-OVERVIEW.md` (what plugs in later).

---

## 1. How this works

The agent processes modules **M1 → M10** in dependency order. For each module it runs **the Module Loop** (§2). The loop is identical every time — only the *module spec card* (§7) changes. Because the mode is fully autonomous, the loop is gated by **machine-checkable criteria** (§3) and CI, not human review. The agent keeps its place and memory in two state files (§6) so it can resume after any interruption.

```
        ┌──────────────────────────────────────────────┐
        │  load MODULE-STATE.json → pick current module │
        └───────────────────────┬──────────────────────┘
                                 ▼
            ┌────────────  THE MODULE LOOP  ───────────┐
            │ 0 Context → 1 Plan → 2 Scaffold →         │
            │ 3 Implement → 4 Self-verify (gates) →     │
            │ 5 Data/fact check → 6 Document →          │
            │ 7 Integrate → 8 Exit gate (DoD)          │
            └───────────────┬───────────────┬──────────┘
              all gates pass │               │ gate fails
                             ▼               ▼
                  9 Retro + commit/PR    bounded retry (≤3)
                  advance to next module   ↑   else → BLOCKER (§5) → stop
```

---

## 2. The Module Loop (run once per module)

**Phase 0 — Context load.** Read `docs/TECH-STACK-PLAN.md`, this file, `BUILD-LOG.md` (prior retros), and the target **module spec card** (§7). Confirm the module's dependencies are all `complete` in `MODULE-STATE.json`; if not, stop with a dependency blocker.

**Phase 1 — Plan.** Expand the card into a concrete task list. Restate the module's **Definition of Done** and acceptance criteria. Identify the public interfaces/contracts other modules will depend on and freeze their signatures first.

**Phase 2 — Scaffold.** Create the package(s) under `packages/`, public TypeScript types/interfaces, and **test files first** (write the golden/unit test skeletons from the acceptance criteria before implementing — TDD-friendly).

**Phase 3 — Implement.** Build to satisfy the interfaces and make the tests pass. Obey the standing guardrails (§4) at all times.

**Phase 4 — Self-verify (the autonomous gate).** Run the full local gate suite; **all must be green**:
`typecheck` · `lint` · `unit + golden tests` · `e2e` (UI modules) · `bundle-size budget` · `perf budget` · `license scan (no AGPL/GPL)` · `config schema validation`. Any red → go to bounded retry.

**Phase 5 — Data / fact check.** For data-bearing modules (calendar, payroll/tax, id, units/FX), validate outputs against authoritative golden fixtures (published algorithms, known dates, sample salaries). A data value with no cited source or failing fixture is a hard fail.

**Phase 6 — Document.** Update the package `README`, public API doc, `CHANGELOG`, and append a one-paragraph entry to `BUILD-LOG.md`.

**Phase 7 — Integrate.** Wire the module into the tool registry / app shell / backend as applicable. Run the **whole-monorepo** build + test to prove cross-module contracts still hold (no regressions in earlier modules).

**Phase 8 — Exit gate (Definition of Done).** Evaluate the module card's DoD checklist **and** the Global Done Bar (§3). If every item passes → Phase 9. If not → bounded retry.

**Phase 9 — Retro & advance.** Commit / open PR; write a **retro** (what shipped, deviations, follow-ups, tech debt, interface changes others must know) into `BUILD-LOG.md`; mark the module `complete` in `MODULE-STATE.json`; load the next module and return to Phase 0.

**Bounded retry:** on any gate failure, the agent may diagnose-and-fix up to **3 attempts per distinct failure**. If still failing, or a guardrail/spec conflict appears, escalate per §5.

---

## 3. Global Done Bar (applies to EVERY module)

A module is not `complete` until all of these hold (in addition to its own DoD):

- ✅ `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm typecheck` green across the **whole** monorepo (no regressions).
- ✅ New logic covered by tests; **calculators/validators/converters have golden tests** with fixed inputs→expected outputs.
- ✅ **License scan clean** — no AGPL; no GPL-only components; LGPL kept dynamically linked / isolated (see §4).
- ✅ **Offline-first**: engine logic runs with no network; anything needing data uses an injected, cached provider.
- ✅ **No PII leaves the device** in any code path this module adds; backend code paths are no-retention.
- ✅ **Bundle & perf budgets** met; heavy WASM is lazy-loaded and code-split.
- ✅ **i18n-ready & a11y-ready** for UI (no hard-coded strings; keyboard + screen-reader pass).
- ✅ Public interfaces documented; `BUILD-LOG.md` retro written; `MODULE-STATE.json` updated.

These are wired as **CI gates** so they are enforced automatically, not by inspection.

---

## 4. Standing guardrails (non-negotiable, from the research & tech plan)

The agent must never violate these; doing so is an automatic gate failure:

1. **Licensing:** no AGPL deps (e.g., **not** MuPDF/`mupdf-wasm`); PDF = `pdf-lib`/`pdf.js`/PDFium; images = **jSquash + wasm-vips** (not deprecated Squoosh); ship the **LGPL FFmpeg build**, no GPL encoders; maintain a NOTICE file.
2. **Privacy / local-first:** core engines are pure TypeScript and offline; sensitive data (salary, tax, national ID, financial docs) is processed on-device and stored encrypted; backend is stateless and no-retention.
3. **Data integrity:** tax/holiday/FX/insurance values are **versioned, dated, and cited**; every change runs golden recalculation; config is **schema-validated** and fails loudly — never silently miscalculates.
4. **Locale-pluggable:** engines take rules from locale packs at runtime; **no market-specific logic hard-coded** in an engine (e.g., TW 補班 toggle, era tables, tax brackets all live in config).
5. **WASM discipline:** ffmpeg.wasm lives in a **cross-origin-isolated route/worker** so COOP/COEP doesn't break the rest of the app; large inputs warn + fall back to the server worker.
6. **OCR tiering:** mobile camera OCR uses **native Apple Vision / Google ML Kit**; tesseract.js is web/offline fallback only.
7. **NFC reality:** transit-balance (FeliCa) is a **capability-detected bonus**, never a launch dependency; always provide manual entry + official-app deep-link.
8. **No money movement / no gov-auth proxying:** organize/remind/calculate only; deep-link to official apps for authenticated services.

---

## 5. Blocker protocol (when the autonomous agent stops)

The agent surfaces a **BLOCKER** to a human and halts the loop when any of these occur (it does **not** guess past them):

- **Spec ambiguity** that changes a public interface or a user-facing contract.
- **Repeated gate failure** — same failure persists after 3 fix attempts.
- **Guardrail conflict** — the only way forward violates §4 (e.g., the only library that does X is AGPL).
- **Missing external dependency** — required data source/API/credential is unavailable or its terms forbid use.
- **Architectural conflict** — the module can't be built without changing a frozen interface another completed module relies on.
- **Security/compliance finding** it cannot auto-remediate.

Blocker output format (appended to `BUILD-LOG.md` and surfaced): *module, phase, what was attempted, why blocked, options considered, the specific decision needed from a human.*

Everything else — lint errors, flaky tests, dependency selection within guardrails, refactors — the agent resolves autonomously.

---

## 6. State the agent maintains

- **`MODULE-STATE.json`** — machine state: `{ currentModule, phase, status per module (pending|in_progress|complete|blocked), frozenInterfaces, lastCommit }`. Source of truth for resume.
- **`BUILD-LOG.md`** — append-only human-readable log: one retro per module (shipped / deviations / follow-ups / debt / interface notes) plus any blocker entries.
- **`CHANGELOG.md`** + per-package `README` — standard project docs updated each loop.

---

## 7. The 10 foundation modules

Each card is the input to one Module Loop. Build order respects dependencies (§8).

### M1 — Monorepo & Agent Build Harness
- **Objective:** pnpm + Turborepo monorepo; TS strict; ESLint/Prettier; Vitest + Playwright; CI/CD with **all quality gates wired** (typecheck, lint, unit, e2e, license-scan, bundle-size, config-validate); the **tool-registry** skeleton + plugin loader; the agent state files (`MODULE-STATE.json`, `BUILD-LOG.md`).
- **Depends on:** —
- **Deliverables:** repo skeleton, CI pipeline, `packages/registry`, contributor + agent-loop docs.
- **DoD:** `pnpm i && build && test && lint && typecheck` green locally + CI; **license-scan gate provably fails** on a planted AGPL dep then passes once removed; a sample "hello tool" registers and renders in a smoke test.

### M2 — Locale-Pack System & Shared Config
- **Objective:** Zod schemas for locale packs; versioned/dated loader; fallback chain (`en-CA→en-GB→en`); CDN hot-update mechanism; **config-validation CI gate**; one synthetic sample pack.
- **Depends on:** M1
- **DoD:** invalid config fails CI loudly; loader returns the correct **effective version by date** and resolves the fallback chain; schema covers payroll/tax/holiday/id/address/units/dataSources/tools/toggles; unit tests for loader + fallback.

### M3 — UI System & PWA App Shell
- **Objective:** component library (Tailwind + Radix/shadcn); dark mode; i18n scaffold (zh-TW/zh-HK/ja/en-*); tool-page layout template; **command palette**; routing + **lazy per-tool loading**; Workbox service worker (offline); CJK + 縦書き typography.
- **Depends on:** M1
- **DoD:** installs as a PWA and works offline for a static tool; Lighthouse PWA pass; command palette opens any registered tool; a11y (keyboard + screen-reader) checks pass; zero hard-coded UI strings.

### M4 — Client WASM Compute Layer
- **Objective:** compute abstraction + web workers; integrate **license-clean** libs — PDF (`pdf-lib`/`pdf.js`/PDFium), image (`jSquash`/`wasm-vips`/`libheif`, incl. **HEIC→JPG**), archives (`fflate`/`libarchive.js`), hashing (Web Crypto), QR/barcode (`zxing-wasm`); **ffmpeg.wasm in an isolated COOP/COEP route** with lazy load, size warning, and server-fallback hook.
- **Depends on:** M1, M3
- **DoD:** HEIC→JPG, PDF merge/split/compress, QR gen+scan, file hashing all run **in-browser, offline**; license scan shows **zero AGPL/GPL**; perf + bundle budgets met; ffmpeg isolation verified (main app keeps normal third-party embeds).

### M5 — Calculation & Units Engine  (`core-calc` + `core-units`)
- **Objective:** percentage, tip/split, discount, mortgage/loan/amortization, BMI, date-diff/age; unit conversion (length/mass/temp/volume/speed/area/data…), cooking conversion, currency (FX via **injected provider**).
- **Depends on:** M1, M2
- **DoD:** **golden tests for every calculator**, incl. imperial/metric edge cases (US vs UK pint/gallon); fully deterministic & offline; FX provider is an interface with a cached stub; amortization schedule matches a reference fixture.

### M6 — Calendar & Era Engine  (`core-calendar`)
- **Objective:** Gregorian ⇄ ROC ⇄ lunar ⇄ 和暦; era-boundary handling; 六曜 / 二十四節気; holiday calculation **from locale pack**; substitution / 振替 rules; business-day & leave planner.
- **Depends on:** M1, M2
- **DoD:** golden tests for known conversions (民國115=2026, 令和8=2026, mid-year era boundary 2019, LNY dates, 六曜 samples); holiday logic is **config-driven, not hard-coded** (TW 補班 toggle proven); offline.

### M7 — Identity & Address Engine  (`core-id` + `core-address`)
- **Objective:** checksum validators + test-data generators (身分證 / 統編 / HKID / BR / マイナンバー / 法人番号 / インボイス / Luhn / ABA / IBAN / SIN / TFN); phone formatting; postal lookup; address normalization; CJK ↔ romanized address.
- **Depends on:** M1, M2
- **DoD:** validators verified against **published algorithms** with known-valid/known-invalid golden vectors; generators emit only checksum-valid data, **clearly flagged non-production**; offline.

### M8 — Text & Data Engine  (`core-text` + `core-format`)
- **Objective:** CJK text — 繁簡 (OpenCC-wasm, with Taiwan-localization), 全角/半角 (NFKC), 注音 / 粵拼 / ふりがな, char-count by script; data/format — JSON/YAML/XML/CSV convert, regex tester, text diff, Base64/URL/HTML encode.
- **Depends on:** M1
- **DoD:** 繁簡 round-trip + a Taiwan-vocab sample; NFKC correctness; char-count by 漢字/かな/英数; JSON↔CSV↔YAML golden-tested; offline.

### M9 — Payroll & Tax Engine  (`core-payroll` + `core-tax`)
- **Objective:** take-home pay with a **pluggable per-jurisdiction rule-module contract**; income tax / VAT-GST / refund; reverse calc (employer cost); reference rule module + the documented contract, consuming **versioned config**.
- **Depends on:** M1, M2, M5
- **DoD:** rule-module interface stable + documented; **golden tests** (N sample incomes → expected net per rule version); data **versioned & dated**; any rule-data change triggers a golden recalculation diff; offline.

### M10 — Backend, Data Pipeline & Reminder Engine  (`core-reminders` + services)
- **Objective:** thin **stateless, no-retention** backend — gov-data **proxy/cache adapter pattern**, FX fetch→cache, config CDN, conversion worker (LibreOffice/Gotenberg + ffmpeg fallback); data **ingestion jobs** with schema-validate + golden recalculation + diff review; `core-reminders` engine (recurrence, **locale-calendar-aware**, local + push payloads); basic observability.
- **Depends on:** M1, M2, M4, M5, M6
- **DoD:** conversion endpoint **streams & discards** (no storage, verified); ≥1 sample gov feed normalized through an adapter with cache + graceful degradation; reminder recurrence golden-tested incl. **holiday-skip**; ingestion rejects bad data; **zero PII persistence** proven by test.

---

## 8. Dependency graph & sequencing

```
M1 ──┬─> M2 ──┬─> M5 ─────────────┐
     │        ├─> M6 ──────┐      │
     │        ├─> M7       │      ├─> M9
     │        └─> (M3,M4)  │      │
     ├─> M3 ───────────────┤      │
     ├─> M4 ───────────────┼──────┴─> M10
     └─> M8 ───────────────┘
```

- **Linear default order:** M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9 → M10.
- **Safe to parallelize** (if multiple agents/worktrees): after M2, the sets {M3, M4}, {M5, M6, M7}, and M8 are independent. M9 needs M2+M5; M10 needs M2+M4+M5+M6.
- **Interface-freeze rule:** a module must freeze and publish its public types in Phase 2 before any dependent module starts, so parallel work doesn't churn contracts.

---

## 9. Per-module agent prompt template (copy-paste)

Feed this to the agent at the start of each loop, filling `{{MODULE_ID}}`:

```
You are building the Zii Swiss Army Knife platform foundation in FULLY AUTONOMOUS mode.

CONTEXT (read first):
- docs/TECH-STACK-PLAN.md, DEVELOPMENT-PLAN.md (§2 loop, §3 Done Bar, §4 guardrails, §5 blocker protocol),
  BUILD-LOG.md (prior retros), and the spec card for {{MODULE_ID}} in DEVELOPMENT-PLAN.md §7.

TASK: Complete module {{MODULE_ID}} by running the full Module Loop (Phases 0–9).

RULES:
- Obey every standing guardrail (§4). Violating one is an automatic failure — do not proceed.
- Self-verify against the Global Done Bar (§3) AND this module's DoD. All gates must be green.
- Data-bearing logic needs golden tests with cited authoritative sources.
- Freeze and document public interfaces in Phase 2 before implementing.
- You may retry a failing gate up to 3 times. If still failing, or any §5 blocker triggers,
  STOP and emit a BLOCKER entry (module, phase, attempted, why, options, decision needed). Do not guess past it.

ON SUCCESS: commit/PR, write a retro to BUILD-LOG.md, set {{MODULE_ID}}=complete in MODULE-STATE.json,
then load the next module per §8 and repeat. Report only: what shipped, any deviations, and the next module.
```

### Module-completion retro template (append to `BUILD-LOG.md`)

```
## {{MODULE_ID}} — {{name}} — {{date}}
- Shipped: <packages, public APIs, tools registered>
- Acceptance: <DoD items, all green? link CI run>
- Deviations from spec: <none | …>
- Interfaces frozen (downstream must use): <signatures>
- Follow-ups / tech debt: <items, with owner module>
- Next: {{NEXT_MODULE_ID}}
```

---

## 10. After the foundation (out of scope here, for orientation)

Once M1–M10 are `complete`, localization is a **config + data** effort, not new architecture: build the **Taiwan locale pack** first (already specced in `docs/FEATURE-CATALOG-TAIWAN.md`), then JP/HK packs (CJK reuse), then the English region with its jurisdiction switch — each plugging into the engines and registry these 10 modules deliver. Mobile (Capacitor: native OCR, push, capability-detected NFC) and the AI layer follow per `docs/TECH-STACK-PLAN.md`.

---

*Bottom line:* ten market-agnostic foundation modules, each completed by the **same autonomous loop** — plan → scaffold → implement → self-verify against hard machine gates → data-check → document → integrate → exit-gate → retro → advance — with a strict blocker protocol so the agent runs unattended but never silently ships something wrong.
