# Zii Swiss Army Knife — Product Roadmap

*From completed platform foundation to a shipped, multi-market, privacy-first utility suite.*

Last updated: June 29, 2026

> Companion to `DEVELOPMENT-PLAN.md` (which covered the 10 foundation modules) and the research in `docs/`. This roadmap covers **everything after the foundation**: the universal tool surface, the four market locale packs built **in parallel**, multi-platform delivery, and the AI layer.

---

## 0. Where we are today

**Foundation complete (M1–M10).** All shared, market-agnostic infrastructure and core engines are built, committed, and green — last unified `pnpm verify` passed with **322 tests**, clean Vite build, and a license scan of 210 deps (no AGPL/GPL). This includes the tool registry + lazy plugin loader, locale-pack system, PWA app shell, WASM compute abstraction, and the calc / calendar / id / text / payroll / reminders / backend engines.

**In flight (uncommitted).** Deferred follow-ups the foundation deliberately stubbed: lunar/六曜 calendar tables, full OpenCC 繁簡, regex + serial text tools, payroll reverse-calc, and a new `@zii/compute-wasm` package wiring real WASM bundles (pdf/image/heic/qr/video/archive) behind M4's lazy descriptors.

**What does *not* yet exist:** real tool UI screens (the app shell only loads the sample `hello-tool`), any populated market locale pack, mobile/desktop builds, live gov-data feeds, and any deployment. The engines are real libraries; they are not yet assembled into something a person can use.

> **Strategic note on the chosen approach.** This roadmap builds **all four markets (TW/HK/JP/EN) in parallel**, per direction. That maximizes reach but carries the project's two biggest non-technical risks — **scope breadth** (~200 universal tools × 4 localized cores) and **live-data freshness** (lottery numbers, transit ETAs, tax tables rot fast). Every phase below therefore has an explicit **data-trust** and **maintenance** exit criterion, not just a feature checklist. If sustained upkeep capacity proves thin, the recommended fallback is to sequence Taiwan → JP/HK → EN rather than abandon scope mid-phase.

---

## Phase 1 — Land the in-flight work & wire the first real tools

**Goal:** close out the deferred follow-ups and prove the full path from engine → registry → usable UI screen with a handful of real tools, in all four market shells.

**Deliverables**

- Commit and verify the in-flight work: lunar/六曜 calendar, OpenCC 繁簡, regex/serial text tools, payroll reverse-calc, `@zii/compute-wasm`.
- Real WASM bundles wired behind M4's lazy ops (pdf merge/split, image compress/resize, HEIC→JPG, QR) — proven on-device, code-split, license-clean.
- A **tool-screen contract**: the standard pattern (input form → engine call → result/export) every tool page follows, plus 8–10 universal tools shipped against it (percentage/tip, unit + currency convert, char-count/case, JSON↔CSV, QR generate, hash, PDF merge, image compress).
- App shell upgraded from the `hello-tool` demo to a real registry-driven tool grid with working market switch.

**Exit criteria:** `pnpm verify` green including the newly committed packages; a user can open the PWA, pick any of the 4 markets, and actually *use* ≥10 universal tools offline; WASM ops run client-side with no upload.

---

## Phase 2 — Universal tool breadth (the shared backbone)

**Goal:** build out the ~200-tool universal catalog (`docs/FEATURE-CATALOG.md`) — the portable layer that's ~40–50% of every market's daily usage.

**Deliverables**

- **File conversion:** documents, images, audio, video, archives, ebooks, fonts.
- **PDF toolkit:** merge, split, compress, convert, OCR, fill, sign, watermark, redact, protect.
- **Image tools:** compress, resize (regional presets), crop, background-remove, favicon, EXIF strip.
- **Calculators:** percentage, tip + split, discount, date/age, BMI, scientific.
- **Currency (live FX), unit converter, text tools, generators (QR/password/UUID/barcode), encoding/hashing/dev tools (Base64, JSON/YAML/XML, regex, hash, JWT, cron).**
- **Document scanner / OCR:** camera/file → deskewed searchable PDF (web/tesseract fallback now; native OCR in Phase 4).
- Lazy-loading / code-splitting kept honest so the bundle stays small as the catalog grows.

**Exit criteria:** universal catalog substantially shipped and tested; each tool offline-capable or clearly flagged as needing the thin backend; bundle-size budget held; no AGPL/GPL deps introduced.

---

## Phase 3 — Four market locale packs (in parallel)

**Goal:** populate the localized core — the ~50% of each market's usage that creates loyalty — as **config + data packs** plugging into existing engines, not new architecture. Built concurrently for all four markets, reusing CJK work across TW/HK/JP.

**Per-market deliverables** (from the feature catalogs)

- **🇹🇼 Taiwan:** 統一發票對獎 + 載具/手機條碼 · 民國⇄西元⇄農曆 + 國定假日 · 勞健保/勞退/薪資實領 · 身分證/統編 · 3+3 郵遞區號 + 地址英譯 · 繁簡/注音/全形半形 · 垃圾車/天氣/地震/AQI · 雙鐵/捷運/YouBike.
- **🇭🇰 Hong Kong:** 八達通餘額 · MTR/巴士/渡輪 ETA · 中電/煤氣/差餉 bills · 颱風信號/暴雨/AQHI · 薪俸稅 + MPF + 遣散費 · HKID/BR · 繁簡/粵拼 · FPS 轉數快 · general vs statutory holidays.
- **🇯🇵 Japan:** 和暦⇄西暦⇄旧暦 + 六曜 · 手取り(健保/厚生年金/所得税/住民税) · ふるさと納税 · コンビニ払い + PayPay · ゴミ分別 · 郵便番号→住所 + ヘボン式 · 全角/半角/ふりがな · 気象庁 天気/地震/台風 · 乗換 + Suica残高 · マイナンバー/法人番号.
- **🇺🇸🇬🇧🇨🇦🇦🇺 English region:** PDF + e-signature · paycheck/take-home (IRS/HMRC/CRA/ATO) · imperial↔metric + cooking · time-zone meeting planner · mortgage/loan/retirement · tip + sales tax/VAT/GST · subscription tracker · Luhn/ABA/IBAN/SIN/TFN · ZIP/postcode standardization · holiday/PTO planner · **jurisdiction switch** (US vs Commonwealth dates/units/spelling/tax year).

**Cross-cutting:** every pack is **versioned, dated, and auditable**; tax/holiday/FX numbers carry an effective date and source. The thin no-retention backend ships its **gov-data proxy + cache** for the feeds that can't run client-side (lottery results, transit ETAs, utility bills).

**Exit criteria:** each market's "core 70%" tools usable end-to-end; every data-backed number traceable to a dated source; a documented update process exists for each live feed (this is the maintenance gate, not optional).

---

## Phase 4 — Mobile & desktop (multi-platform)

**Goal:** ship beyond the PWA to where these tools are actually used — phones (transit cards, camera, reminders) and desktop.

**Deliverables**

- **Capacitor iOS/Android:** native camera OCR (Apple Vision / ML Kit, tesseract as web fallback), push notifications for the reminder engine, capability-detected **NFC** for transit-card balance reads (Octopus/Suica/PASMO), share-sheet integration for file tools.
- **Tauri desktop** for the heavier file/PDF/office workflows.
- App-store readiness: privacy nutrition labels (easy — local-first by design), per-platform packaging, offline precache + service-worker hardening, Playwright E2E (deferred from M3).

**Exit criteria:** installable iOS/Android/desktop builds passing store review; native OCR + push + NFC working on device; reminders fire offline; E2E suite green in CI.

---

## Phase 5 — AI layer & intelligence

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

| Phase | Theme | Primary outcome |
|-------|-------|-----------------|
| 1 | Land in-flight + first real tools | Engine→UI path proven; ~10 universal tools usable |
| 2 | Universal breadth | ~200 shared tools shipped |
| 3 | Four locale packs (parallel) | Each market's sticky local core usable + auditable data |
| 4 | Mobile & desktop | Installable apps; native OCR/push/NFC |
| 5 | AI layer | NL routing + privacy-preserving assistance |

**Biggest risks to watch (unchanged from the assessment):** parallel scope across 4 markets, and keeping live gov/tax/transit data fresh. Phases 3+ live or die on the *maintenance* exit criteria, not the feature lists.
