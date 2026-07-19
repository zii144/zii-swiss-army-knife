# Zii Swiss Army Knife — Product Roadmap

*From completed platform foundation to a shipped, multi-market, privacy-first utility suite.*

Last updated: July 20, 2026

> Companion to `DEVELOPMENT-PLAN.md` (foundation modules) and the research in `docs/`.
> **Authoritative current-state summary:** [`docs/tech/12-roadmap-and-directions.md`](docs/tech/12-roadmap-and-directions.md)
> and [`docs/tech/01-overview.md`](docs/tech/01-overview.md). Prefer those when this file and the code disagree.

---

## 0. Where we are today

**Foundation complete (M1–M10).** Shared infrastructure and core engines are built and green: tool registry + lazy plugin loader, locale-pack system, PWA app shell, WASM compute abstraction, and the calc / calendar / id / text / payroll / reminders / backend engines.

**Phase 2 — universal catalog: shipped.** ~318 tool screens / 319 catalog entries across file, PDF, image, text, calc, convert, datetime, finance, generator, id, and everyday categories. Every tool is code-split; the initial payload stays under a **128 KB gz** budget enforced on every app build.

**Phase 3 — market locale packs: largely shipped (still expanding).** **20 named markets + `global`**, with offline engines and dated locale packs for TW/HK/JP, English-region packs, and later batches (KO/CA/AU/DE/FR, ES/IT/NL/SG/IN, PT/BR/MX/PL/NZ). Live gov-data feeds and NFC remain deliberately deferred (integrity / capability gates).

**Phase 4 — multi-platform: in progress.** Capacitor iOS/Android shell exists (iOS verified in simulator; Android project synced). Playwright headless E2E loads every catalog tool on each CI run. Native camera OCR, push, NFC, store packaging, and Tauri desktop are not built.

**Phase 5 — AI layer: planned, not built.** Today's "AI" surface is on-device ML tools (OCR, background removal) plus LLM-discoverability files (`llms.txt`, `tools.json`, `ai.txt`). Natural-language routing and related features are roadmap-only.

**What is *not* production-complete yet:** App Store / Play Store release, native device CI, optional LibreOffice conversion backend as part of the default Vercel deploy, and live government-data feeds.

> **Strategic note.** Scope breadth (~300+ tools × many localized cores) and live-data freshness remain the two biggest non-technical risks. Every phase keeps an explicit **data-trust** and **maintenance** exit criterion. If upkeep capacity is thin, sequence markets (TW → JP/HK → EN) rather than abandon scope mid-phase.

---

## Phase 1 — Land the in-flight work & wire the first real tools

**Status: built.**

**Goal:** close out deferred foundation follow-ups and prove the full path from engine → registry → usable UI screen with a handful of real tools.

**Deliverables (done)**

- Lunar/六曜 calendar tables, full OpenCC 繁簡, regex + serial text tools, payroll reverse-calc, `@zii/compute-wasm`.
- Real WASM bundles behind M4 lazy ops (pdf merge/split, image compress/resize, HEIC→JPG, QR).
- Tool-screen contract and first universal tools under the bundle + license gates.
- Registry-driven tool grid with working market switch.

**Exit criteria (met):** `pnpm verify` green; users can open the PWA and use real tools offline; WASM ops run client-side with no upload.

---

## Phase 2 — Universal tool breadth (the shared backbone)

**Status: built / shipping.**

**Goal:** build out the universal catalog (`docs/FEATURE-CATALOG.md`) — the portable layer that's ~40–50% of every market's daily usage.

**Deliverables**

- **File conversion:** documents, images, audio, video, archives, ebooks, fonts (client where feasible; heavy office↔PDF via optional backend).
- **PDF toolkit:** merge, split, compress, convert, OCR, fill, sign, watermark, redact, protect (correctness-sensitive ops gated where needed).
- **Image tools:** compress, resize (regional presets), crop, background-remove, favicon, EXIF strip.
- **Calculators:** percentage, tip + split, discount, date/age, BMI, scientific.
- **Currency (live FX), unit converter, text tools, generators (QR/password/UUID/barcode), encoding/hashing/dev tools (Base64, JSON/YAML/XML, regex, hash, JWT, cron).**
- **Document scanner / OCR:** file → searchable text/PDF (tesseract web path; native OCR in Phase 4).
- Lazy-loading / code-splitting kept honest under the bundle budget.

**Exit criteria (met for shipped surface):** universal catalog substantially shipped and tested; tools offline-capable or clearly flagged as needing the thin backend; bundle-size budget held; no AGPL/GPL deps introduced.

---

## Phase 3 — Market locale packs

**Status: largely shipped; still expanding. Originally framed as four markets in parallel; now 20 + `global`.**

**Goal:** populate the localized core — the ~50% of each market's usage that creates loyalty — as **config + data packs** plugging into existing engines, not new architecture.

**Per-market deliverables** (from the feature catalogs — representative cores)

- **🇹🇼 Taiwan:** 統一發票對獎 + 載具/手機條碼 · 民國⇄西元⇄農曆 + 國定假日 · 勞健保/勞退/薪資實領 · 身分證/統編 · 3+3 郵遞區號 + 地址英譯 · 繁簡/注音/全形半形 · (live 垃圾車/天氣/地震/AQI · 雙鐵/捷運/YouBike deferred).
- **🇭🇰 Hong Kong:** 薪俸稅 + MPF + 遣散費 · HKID/BR · 繁簡/粵拼 · FPS · holidays · (八達通 NFC / MTR ETA / utility bills deferred).
- **🇯🇵 Japan:** 和暦⇄西暦⇄旧暦 + 六曜 · 手取り · ふるさと納税 · 郵便番号/ヘボン式 · 全角/半角/ふりがな · (気象庁 live feeds / Suica NFC deferred).
- **🇺🇸🇬🇧🇨🇦🇦🇺 English region:** paycheck/take-home (IRS/HMRC/CRA/ATO) · imperial↔metric + cooking · mortgage/loan · tip + sales tax/VAT/GST · subscription tracker · Luhn/ABA/IBAN/SIN/TFN · holiday/PTO planner · jurisdiction switch.
- **Later batches:** KO / DE / FR / ES / IT / NL / SG / IN / PT / BR / MX / PL / NZ — take-home/tax/VAT, ID validators, holidays, leave helpers (see `CHANGELOG.md`).

**Cross-cutting:** every pack is **versioned, dated, and auditable**; tax/holiday/FX numbers carry an effective date and source. The thin no-retention backend's gov-data proxy remains the gate for live feeds that can't run client-side.

**Exit criteria (partial):** offline, engine-backed market cores are usable and tested; live feeds and NFC stay deferred until maintenance + capability gates pass.

### Phase 3 status (as of 2026-07-15)

**Shipped — offline, engine-backed:**

- ID/address validators and calendar (民國/和暦/lunar/六曜) across early markets.
- **🇹🇼 統一發票對獎** (`tw-invoice`, `@zii/receipt`) — fixed prize-matching; winning numbers are user-entered/dated data, never fabricated.
- **🇭🇰 薪俸稅 + MPF** · **🇭🇰 遣散費/長服金** · **🇯🇵 ふるさと納税** · **🇯🇵 手取り** · **🇯🇵 かな→ローマ字** · **🌐 Subscription tracker**.
- Five-market batches: **KO/CA/AU/DE/FR**, **ES/IT/NL/SG/IN**, **PT/BR/MX/PL/NZ** (50 regional tools each).

**Deliberately deferred (integrity / capability gates — NOT fabricated):**

- **Live gov-data feeds** — official lottery numbers, transit ETAs, weather/quake/typhoon/AQI, utility bills, garbage schedules.
- **Transit-card balance (八達通/Suica/PASMO)** — requires native NFC (Phase 4).

---

## Phase 4 — Mobile & desktop (multi-platform)

**Status: in progress.**

**Goal:** ship beyond the PWA to where these tools are actually used — phones (transit cards, camera, reminders) and desktop.

**Deliverables**

- **Capacitor iOS/Android:** native camera OCR (Apple Vision / ML Kit, tesseract as web fallback), push notifications for the reminder engine, capability-detected **NFC** for transit-card balance reads (Octopus/Suica/PASMO), share-sheet integration for file tools.
- **Tauri desktop** for the heavier file/PDF/office workflows.
- App-store readiness: privacy nutrition labels, per-platform packaging, offline precache + service-worker hardening, Playwright E2E in CI.

**Exit criteria:** installable iOS/Android/desktop builds passing store review; native OCR + push + NFC working on device; reminders fire offline; E2E suite green in CI.

### Phase 4 status (as of 2026-07-20)

**Shipped — mobile shell (Capacitor):**

- Capacitor iOS + Android scaffolding (`appId: dev.zii.knife`, `webDir: dist`). Same offline PWA bundled via `cap sync`.
- **iOS verified in simulator**; Android project synced (needs an Android SDK to build).
- Native sources committed; build artifacts and copied web assets git-ignored.

**Shipped — Playwright headless E2E:**

- `pnpm --filter @zii/app test:e2e` against the production build. All-tools smoke sweep + functional spot-checks; wired into CI as a separate `e2e` job.

**Not yet wired (follow-ups):**

- Native plugins — camera OCR, push, NFC, share-sheet.
- Tauri desktop; app-store packaging + privacy nutrition labels; native-device CI.

---

## Phase 5 — AI layer & intelligence

**Status: planned, NOT built.**

**Goal:** the "do it for me" layer on top of a complete tool surface — only meaningful once the deterministic tools are trustworthy.

**Deliverables (per `docs/TECH-STACK-PLAN.md`)**

- Natural-language tool routing ("convert this HEIC and split the PDF") → registry actions.
- On-device / privacy-preserving assistance for parsing receipts, tax forms, payslips into the right calculator — no PII leaves the device by default.
- Smart reminder extraction (bill due dates, renewals, expiries from a photo or document).
- Market-aware guidance (e.g., explain a Japanese 源泉徴収票 or a Taiwan 薪資單).

**Exit criteria:** AI features degrade gracefully offline, never silently upload sensitive inputs, and are clearly bounded to suggestions over the deterministic engines (which remain the source of truth).

---

## Cross-phase guardrails (always on)

These hold in every phase and are part of each phase's definition of done:

- **Privacy / local-first** — on-device by default; upload only when technically unavoidable, to the stateless no-retention backend (proven by `retainedCount` staying 0).
- **Offline-capable** — calculators, calendar/era, ID validation, text, and many file ops work with no network.
- **Locale-pluggable** — one codebase; never fork per country.
- **Breadth without bloat** — lazy-load, code-split, plugin registry; enforce a bundle budget.
- **Trustworthy data** — every tax/holiday/FX/gov number versioned, dated, auditable. *Wrong numbers destroy trust faster than a missing feature.*
- **License-clean** — no AGPL/GPL-only deps; license scan stays green.

---

## Sequencing summary

| Phase | Theme | Status | Primary outcome |
|-------|-------|--------|-----------------|
| 1 | Land in-flight + first real tools | Built | Engine→UI path proven |
| 2 | Universal breadth | Built / shipping | ~318 shared tools shipped |
| 3 | Market locale packs | Largely shipped | 20 markets + global; live feeds deferred |
| 4 | Mobile & desktop | In progress | Capacitor shell + E2E; store/native plugins TBD |
| 5 | AI layer | Planned | NL routing + privacy-preserving assistance |

**Biggest risks to watch:** scope breadth across many markets, and keeping live gov/tax/transit data fresh when those feeds are eventually wired. Phases 3+ live or die on the *maintenance* exit criteria, not the feature lists.
