# Zii Swiss Army Knife — Tech Stack & Architecture Plan

*How to build a multi-market, privacy-first, offline-capable utility suite from the research in the feature catalogs.*

Last updated: June 28, 2026

> Companion to `CROSS-MARKET-OVERVIEW.md`. The research's central conclusion — *same feature shapes, local content* — drives every decision here toward a **shared core engine + pluggable per-market locale packs**.

---

## 1. Goals & hard constraints (derived from research)

1. **Privacy / local-first.** Sensitive inputs recur in every market (salary, tax forms, national ID, financial docs, transit records). Default to **on-device processing**; upload only when technically unavoidable, and then to a stateless, no-retention service.
2. **Offline-capable.** Calculators, calendar/era conversion, ID validation, text conversion, and many file operations must work with no network.
3. **Locale-pluggable.** One codebase; per-market rule/data packs (tax brackets, holidays, ID checksums, address formats, text rules). Never fork the app per country.
4. **Breadth without bloat.** ~200 tools across markets — needs lazy-loading, code-splitting, and a plugin-style tool registry so the bundle stays small.
5. **Multi-platform.** Web/PWA first; then mobile (NFC for transit cards, camera for OCR, push for reminders) and desktop.
6. **Trustworthy data.** Tax/holiday/FX/gov data must be versioned, dated, and auditable — wrong numbers destroy trust faster than a missing feature.

---

## 2. Architecture at a glance

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENTS                                │
│   PWA (web)   ·   iOS/Android (Capacitor)   ·   Desktop (Tauri)│
└───────────────┬──────────────────────────────────────────────┘
                │  shared UI + shared core (TypeScript)
┌───────────────▼──────────────────────────────────────────────┐
│  SHARED CORE (pure TS, no UI) — runs on-device                 │
│  • tool registry / plugin loader                               │
│  • calc engine · calendar/era engine · id-validation engine    │
│    · text engine (CJK) · unit/currency engine · format engine  │
│  • LOCALE PACKS (data+rules): TW · HK · JP · EN(US/UK/CA/AU)    │
│  • WASM compute: pdf, image, ffmpeg, ocr, archive              │
│  • local encrypted store (IndexedDB/SQLite) + reminder engine  │
└───────────────┬──────────────────────────────────────────────┘
                │  only when client-side is impossible
┌───────────────▼──────────────────────────────────────────────┐
│  THIN BACKEND (stateless, no-retention)                        │
│  • heavy office conversion (LibreOffice headless)              │
│  • gov open-data proxy + cache (TW/HK/JP feeds)                │
│  • FX + tax/holiday config CDN  • push fan-out  • optional sync │
└──────────────────────────────────────────────────────────────┘
```

Principle: **push computation down to the client; keep the backend thin, stateless, and cache-only.** The backend never stores user files or PII.

---

## 2.1 Key technical decisions (firm picks + rationale)

The four choices most worth pinning down, with when to revisit each.

| Decision | Pick | Why | Revisit if |
|---|---|---|---|
| **UI framework** | **React** | Deepest ecosystem for a ~200-tool surface (PDF/image/chart/table libs), biggest hiring pool, shadcn/Radix. Vue is viable and lighter (it-tools proved it) but React's library coverage wins for breadth. | Team is Vue-native, or bundle size becomes the dominant constraint |
| **Mobile shell** | **Capacitor now**, Tauri 2 mobile later | Capacitor is mature with a huge plugin ecosystem incl. FeliCa-capable NFC, and reuses the web app as-is. Tauri 2 mobile (Rust, smaller) is promising but younger. | Tauri's mobile plugin ecosystem matures enough to consolidate desktop+mobile on one Rust shell (~re-evaluate in 12 months) |
| **Backend host** | **Serverless/edge + container workers** | Thin, stateless, no-retention design fits serverless; edge functions handle gov-data proxy/cache + config CDN. Only the heavy conversion queue (LibreOffice/ffmpeg) needs always-on containers (Cloud Run / Fly.io / ECS). | A market needs region-pinned data residency, or conversion volume justifies dedicated infra |
| **AI layer** | **Tiered, on-device first** | Native OCR (Apple Vision / ML Kit) for camera; small local models/rules for field extraction; opt-in **no-retention** cloud LLM only for summarize/translate/rewrite. AI stays an enhancement over deterministic, audited tools. | A capable on-device LLM makes cloud calls unnecessary for text tasks |

---

## 3. Platform strategy

- **Phase 1 — PWA (web).** Fastest path, instant updates, no app-store gatekeeping, installable, offline via service worker. Covers ~80% of tools.
- **Phase 2 — Mobile via Capacitor** (wraps the same web app; reuses 95% of code). Native plugins needed for the sticky local features: **NFC** (transit-card balance — see feasibility note), **camera + on-device OCR** (receipts, docs), **push notifications** (bill/garbage/typhoon reminders), **share-sheet/intent** targets, **widgets** (next garbage day, transit ETA, FX).
- **Phase 3 — Desktop via Tauri 2** (Rust shell, web UI, tiny binaries) for power-user file/PDF/batch work, OS context-menu integration, and a global hotkey command palette. Tauri 2 is stable (2.9.x as of Dec 2025) and now also has mobile targets + built-in NFC/barcode/biometric plugins — a possible future consolidation of the mobile shell, though Capacitor remains the more mature mobile choice today.

Rationale: one TypeScript/web codebase serves all three shells; native capability is added surgically where the research demands it (NFC, camera, push). React Native is the alternative but would fork UI from the web app — rejected for breadth-of-tools reasons.

> **⚠️ NFC transit-card feasibility (verified June 2026).** Reading 八達通 (Octopus) / Suica / PASMO balance is **FeliCa (NFC-F)**, which has real constraints: **Web NFC cannot do it** (NDEF-only, Android-only) — so it must be a **native Capacitor plugin** (e.g. capawesome — paid; or the free Exxili plugin). **iOS:** works on iPhone 7+ via CoreNFC but requires the `com.apple.developer.nfc.readersession.felica.systemcodes` entitlement + declared system codes, and reads only via a modal prompt (no background). **Android:** only phones with a FeliCa secure element can read it — Japan-market phones, Pixel 6+, and some global flagships; **most non-Japan Android phones cannot**. Treat transit-balance reading as a **capability-detected bonus feature**, not a guaranteed cross-device one; always offer manual entry / deep-link to the official app as fallback.

---

## 4. Frontend stack

| Concern | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) | Shared core + UI, type-safe config schemas |
| Framework | **React** (or **Vue 3**) | Largest ecosystem; Vue if mirroring it-tools' proven pattern |
| Meta-framework | **Vite** SPA / optionally **Next.js**/**Nuxt** for SEO landing pages | Each tool page is SEO gold (people search "HEIC to JPG"); SSR the marketing/tool-landing layer, SPA the app shell |
| Styling | **Tailwind CSS** + headless UI (Radix/shadcn) | Fast, consistent, themeable (dark mode, CJK typography, 縦書き support) |
| State | **Zustand**/**Jotai** + **TanStack Query** | Light local state; Query for cached gov/FX data |
| i18n | **i18next** / **vue-i18n** | zh-TW, zh-HK, ja, en-US/GB/CA/AU; locale drives more than strings (see §7) |
| PWA | **Workbox** service worker | Offline cache, background sync for reminders |
| Routing/registry | **plugin tool registry** (lazy `import()` per tool) | Code-split each of ~200 tools; load on demand |

---

## 5. Local-first compute layer (the engine room)

Most "converter" features can run **entirely in the browser via WebAssembly** — which is also the privacy story.

| Capability | Client-side (WASM/JS) | Notes |
|---|---|---|
| **PDF** merge/split/compress/rotate/fill/watermark | `pdf-lib` (MIT), `pdfjs-dist` (Apache-2.0), `pdfium`-wasm (Apache/BSD) | All on-device. **Avoid MuPDF/`mupdf-wasm` — AGPL-3.0** (see §13 licensing) |
| **PDF OCR / scanned docs** | web/offline: `tesseract.js`; mobile camera: **native OCR** (Apple Vision / Google ML Kit) | tesseract.js CJK works but degrades on photos/complex backgrounds — use native on-device OCR for camera captures (see §12) |
| **Office docs** (DOCX/XLSX/PPTX ⇄ PDF) | partial client (`docx`, `xlsx`/SheetJS, `mammoth`) | **High-fidelity conversion needs server LibreOffice** (§8) |
| **Images** convert/compress/resize/HEIC | **`jSquash`** (codecs) + **`wasm-vips`** (heavy ops), `libheif`-wasm, Canvas | ⚠️ **Squoosh/`@squoosh/lib` is deprecated/unmaintained (since 2023)** — use jSquash (Squoosh-derived, maintained) instead |
| **Background removal** | `@imgly/background-removal` (ONNX/WASM) | On-device AI, no upload |
| **Audio/Video** convert/trim/extract | **`ffmpeg.wasm`** (small/medium) + **server fallback** | ⚠️ needs SharedArrayBuffer → COOP/COEP isolation; ~32MB core; 4GB mem cap. Isolate to a dedicated route/worker (see caveat below) |
| **Archives** zip/7z/tar/rar(extract) | `fflate`, `libarchive.js` | Local; rar is extract-only |
| **Hashing/crypto/encoding** | Web Crypto API, `js-sha*` | Trivially local |
| **Barcode/QR** | `qrcode`, `zxing-wasm` | Generate + scan local |

Rule of thumb: **if it can run in WASM under ~30s for typical inputs, it runs on the client.** Only large media and high-fidelity office conversion fall back to the server.

**ffmpeg.wasm caveat (verified June 2026):** it requires `SharedArrayBuffer`, which only works under **cross-origin isolation** (`COOP: same-origin` + `COEP: require-corp`). Those headers break cross-origin iframes, fonts, and third-party scripts unless each sends `Cross-Origin-Resource-Policy` or is proxied. The multi-thread core (~32 MB) is faster but flagged unstable; the single-thread core is more reliable but slower. 32-bit WASM caps memory at 4 GB (Chrome kills tabs ~2 GB). **Mitigation:** scope COOP/COEP to a dedicated, isolated `/convert` route or run ffmpeg in an isolated worker so the rest of the app keeps normal embeds; lazy-load the core with a progress bar; segment large files; warn above ~500 MB and route them to the server worker.

---

## 6. The shared core packages (monorepo)

Pure-TypeScript, UI-free, fully unit-tested, reusable across web/mobile/desktop. Suggested monorepo (pnpm workspaces + Turborepo):

```
packages/
  core-calc/        # percentage, tip, mortgage/loan, amortization, BMI…
  core-payroll/     # take-home pay; pluggable per-jurisdiction rule modules
  core-tax/         # income tax / VAT-GST / refund; per-market packs
  core-calendar/    # Gregorian⇄ROC/和暦⇄lunar, holidays, 六曜, 節氣, leave planner
  core-id/          # checksum validators+generators (身分證/統編/HKID/BR/マイナンバー/法人番号/Luhn/ABA/IBAN/SIN/TFN)
  core-address/     # postal lookup, address normalize, CJK↔romanized address
  core-text/        # 繁簡(OpenCC), 全角半角(NFKC), 注音/粵拼/ふりがな, char-count
  core-units/       # unit + cooking + currency conversion
  core-format/      # JSON/YAML/XML/CSV, regex, diff, base64…
  core-reminders/   # scheduling rules, recurrence, notification payloads
  locale-packs/     # tw, hk, jp, en-us, en-gb, en-ca, en-au  (data + rule modules)
  ui/               # shared component library
apps/
  web/  mobile/  desktop/  backend/
```

Each engine exposes a stable interface and accepts a **locale pack** at runtime. Example: `core-payroll.compute(gross, localePack.payrollRules)` — Taiwan's 勞健保/勞退 module, Japan's 社会保険 module, and the US IRS module all satisfy the same contract.

---

## 7. Localization architecture (the make-or-break)

Locale is **not just translated strings** — it selects rules, formats, data sources, and even which tools appear.

A locale pack is a versioned, dated bundle:

```jsonc
// locale-packs/tw/2026.json  (illustrative)
{
  "market": "TW", "year": 2026, "effectiveDate": "2026-01-01",
  "dateFormat": "yyyy/MM/dd", "calendars": ["gregorian","roc","lunar"],
  "currency": "TWD", "units": "metric",
  "payroll": { "laborInsuranceGrades": [...], "healthInsuranceRate": 0.0517, "pensionEmployer": 0.06 },
  "tax": { "brackets": [...], "deductions": {...} },
  "holidays": { "source": "dgpa", "list": [...], "makeUpWorkdays": false },
  "id": { "validators": ["roc-nid","roc-ubn","arc"] },
  "address": { "postcode": "3+3", "order": "big-endian" },
  "dataSources": { "einvoice": "...", "weather": "cwa", "transit": "tdx" },
  "tools": { "enabled": ["einvoice-lottery","garbage-truck", ...] }
}
```

Design rules:
- **Versioned by year/effective-date.** Tax brackets, insurance grades, FX, holidays change; keep historical versions so past calculations stay reproducible.
- **Hot-updatable from CDN** without an app release (config, not code).
- **Tool visibility is locale-driven** — 統一發票對獎 only shows in TW; e-signature foregrounded in EN.
- **Fallback chain** — `en-CA → en-GB → en` so Commonwealth variants inherit.
- **Schema-validated** (Zod) at build and load time; a bad config must fail loudly, never silently miscalculate.

---

## 8. Thin backend & services

Keep it small, stateless, no user-data retention.

| Service | Tech | Purpose |
|---|---|---|
| **Heavy doc conversion** | LibreOffice headless / Gotenberg in a container | High-fidelity DOCX/XLSX/PPTX⇄PDF that WASM can't match; files streamed, never stored |
| **Large media conversion** | server ffmpeg workers (queue) | Fallback when ffmpeg.wasm is too slow/big |
| **Gov open-data proxy + cache** | edge functions + KV/Redis cache | Normalize + cache TW/HK/JP feeds (transit ETA, weather, e-invoice numbers); shields rate limits, adds CORS, smooths schemas |
| **Config/CDN** | object storage + CDN | Locale packs, tax/holiday/FX data, OCR language models |
| **FX rates** | scheduled fetch → cache | Central bank / aggregator feeds; cached, never per-user |
| **Push fan-out** | FCM/APNs + a scheduler | Reminders computed locally; backend only relays scheduled pushes |
| **Optional sync** | end-to-end encrypted blob store | Favorites/history/settings sync; zero-knowledge, opt-in |

Backend language: **Node/TypeScript** (share types with the core) for API/edge, plus containerized **Go or Rust** workers for CPU-heavy conversion queues. Host on serverless/edge where possible; containers for the conversion workers.

---

## 9. Data & config pipeline

The riskiest non-code asset is the **rules data**. Treat it like code:

- **Source-controlled config repo** with the locale-pack JSON, each entry citing its authority + retrieval date.
- **Automated ingestion jobs**: FX (daily), gov holiday gazettes (annual), tax brackets (per budget/tax year), insurance grades (annual), sales-tax tables (US, periodic).
- **Validation + diff review**: every data change runs schema validation + a human-reviewed diff + golden-test recalculation (e.g., "net pay for these 20 sample salaries must match expected").
- **Dated releases** published to CDN; clients pin to the latest effective version and can compute historical years.
- **Provenance surfaced in-app**: "Tax year 2026, source: 財政部, updated 2026-01-05" builds trust and covers liability.

---

## 10. Government open-data integrations (per market)

The Asian markets' stickiness depends on these; build a normalizing adapter per source.

- **Taiwan:** 財政部電子發票平台 (invoice numbers), CWA 氣象開放資料 (weather/quake/AQI), TDX 運輸資料流通服務 (transit), data.gov.tw (垃圾車 routes), 台灣銀行 (FX), 監理服務網 (info/links).
- **Hong Kong:** DATA.GOV.HK (KMB/MTR/GMB/ferry real-time ETA, Address Lookup Service), HKO (typhoon/rainstorm/AQHI), HKMA/HKAB (rates), RVD/WSD/IRD (rules).
- **Japan:** 気象庁 JMA (weather/quake/緊急地震速報/台風), 国税庁 (法人番号/インボイス公表サイト), デジタル庁/マイナポータル, 日本郵便 + zipcloud (postal→address), 国立天文台 暦計算室 (暦/二十四節気), per-municipality ゴミ APIs.
- **English region:** FX feeds (ECB/central banks), IRS/HMRC/CRA/ATO bracket data (manually curated), IANA tz database, national holiday data, USPS/Royal Mail address tools (where licensable).

Pattern: **adapter normalizes each feed into a shared internal schema**, cached at the edge; client consumes one consistent shape regardless of source. Compliance: respect each portal's terms; cache to minimize load; never proxy auth-gated personal data (e.g., e-invoice login, iAM Smart, マイナポータル) — deep-link to the official app instead.

---

## 11. Reminder / notification engine

Cross-cutting and high-value in every market (bills, garbage, typhoon, expiries, tax deadlines).

- **Rules live on-device** (recurrence, lead time, locale calendar awareness — e.g., skip a holiday).
- **Local notifications** when possible (no server needed, privacy-preserving).
- **Server push** only for time-critical external triggers (typhoon signal hoisted, transit disruption) via FCM/APNs.
- **Background sync** (Workbox) to refresh ETAs/weather before a scheduled reminder fires.
- Unified **notification center** UI; one consent surface.

---

## 12. AI layer (Phase 3 differentiator)

- **On-device OCR, tiered by platform (verified June 2026):** on mobile use **native on-device OCR — Apple Vision (iOS) and Google ML Kit (Android)** — both have strong CJK (Chinese/Japanese, incl. separate script models) and run offline; on web/desktop use **`tesseract.js`**. tesseract.js handles clean documents well but accuracy drops sharply on photos with complex backgrounds, so it's the fallback, not the camera-capture path. This keeps the hero "snap a receipt/発票" flow accurate while preserving an offline web option.
- **Small-model first** for privacy on other tasks: receipt/bill field extraction, classification, 繁簡/敬語 rewriting where feasible.
- **Cloud LLM (opt-in)** for heavier summarize/translate/rewrite and document Q&A — with explicit consent and no-retention API usage; never auto-send sensitive docs.
- **Use cases from research:** receipt/発票/レシート photo → structured expense line items; bill OCR → reminder auto-fill; contract/源泉徴収票 key-fact extraction; Chinese/Japanese summarize/translate/敬語化; "fill this form from a photo."
- Keep AI as an **enhancement layer over deterministic tools**, never a replacement for the audited calculators.

---

## 13. Security, privacy & compliance

- **On-device encryption** for stored sensitive data (IndexedDB via SQLCipher-style / WebCrypto-derived keys); biometric unlock on mobile.
- **No-retention backend**: conversion services stream and discard; logs scrub PII.
- **Zero-knowledge sync** (opt-in): client-side encryption, server stores only ciphertext.
- **Regulatory posture:** GDPR/UK-GDPR (EN), Taiwan PDPA, Hong Kong PDPO, Japan APPI — minimized data collection makes most of this straightforward.
- **No money movement** (explicit in all catalogs): the app organizes/reminds/calculates but never executes payments or trades — avoids payment-institution licensing.
- **Don't proxy government auth**: deep-link to official apps for anything behind iAM Smart / マイナポータル / 財政部 login.
- **SBOM + dependency scanning** (the WASM/JS supply chain is large); CSP, Subresource Integrity.

### 13.1 Open-source license compliance (verified June 2026 — important for a commercial app)

The WASM media/PDF stack contains copyleft licenses that can force source disclosure. Audit before shipping:

- **Avoid AGPL-3.0 in the proprietary client/SaaS:** **MuPDF / `mupdf-wasm` is AGPL-3.0** — using it in a distributed app or network service triggers full source-disclosure of *your* app, or requires a paid commercial license from Artifex. **Use MIT/Apache PDF libs instead** (`pdf-lib` MIT, `pdf.js` Apache-2.0, PDFium Apache/BSD). Same caution for any GPL/AGPL tool pulled in for "convenience."
- **LGPL components are usable but need care:** **FFmpeg** (LGPL-2.1+ in default builds, but **GPL** if compiled with GPL-only encoders like x264/x265) and **libheif/libde265** (LGPL/GPL depending on build). Ship **LGPL-only builds**, keep them dynamically linked / as separate WASM modules, and avoid GPL encoders unless you accept GPL. ffmpeg.wasm's prebuilt cores include GPL components — pick or build the LGPL variant for a closed-source product.
- **Prefer permissive everywhere it matters:** `jSquash` (Apache-2.0), `wasm-vips`/libvips (LGPL — dynamic), `tesseract.js`/Tesseract (Apache-2.0), `zxing-wasm` (Apache-2.0), `fflate` (MIT), `qrcode` (MIT) are all fine.
- **Process:** run automated **license scanning** (e.g. an SPDX/license-checker gate in CI) and maintain a NOTICE file; treat any new (A)GPL transitive dependency as a build-breaking finding.

---

## 14. Testing, quality & CI/CD

- **Golden tests for every calculator** — fixed inputs → expected outputs per locale-year; a data update must not silently change a result without review.
- **Unit tests** on all core engines (checksum validators especially — easy to verify against published algorithms).
- **E2E** (Playwright) on top tools per platform; visual regression for CJK/縦書き rendering.
- **WASM perf budgets** — size + runtime thresholds; lazy-load gates.
- **Config CI** — schema validation + diff review + recalculation suite on every locale-pack change.
- **CI/CD:** monorepo pipeline (Turborepo remote cache), preview deploys per PR, staged rollout, feature flags per tool/market.

---

## 15. Recommended stack — summary

| Layer | Recommendation |
|---|---|
| Language | TypeScript (strict) end-to-end |
| Web | React + Vite (SPA app) + Next.js for SEO tool-landing pages; Tailwind + shadcn/Radix |
| Mobile | Capacitor (reuse web) + native plugins: NFC (FeliCa caveats), camera/**native OCR** (Apple Vision/ML Kit), push, widgets, share |
| Desktop | Tauri 2 (Rust shell, web UI, global hotkey palette) |
| Core | pnpm + Turborepo monorepo; pure-TS engines; Zod-validated locale packs |
| Client compute | ffmpeg.wasm (LGPL build, isolated route), pdf-lib/pdf.js/PDFium (**not MuPDF/AGPL**), tesseract.js, libheif, **jSquash + wasm-vips** (not Squoosh), imgly bg-removal, zxing-wasm, Web Crypto |
| State/data | Zustand/Jotai + TanStack Query; IndexedDB (encrypted) / SQLite on native |
| Backend | Node/TS edge + serverless; Go/Rust conversion workers; LibreOffice/Gotenberg container |
| Data | Config repo + ingestion jobs + CDN; versioned, dated, cited |
| Infra | Edge/serverless host + CDN + KV/Redis cache; FCM/APNs; object storage for E2E sync |
| AI | On-device OCR/extraction first; opt-in cloud LLM, no-retention |
| Quality | Golden tests, Playwright E2E, config CI, perf budgets, SBOM scanning |

---

## 16. Phased technical rollout

1. **Foundation:** monorepo, tool registry, locale-pack schema, shared UI, PWA shell, client WASM pipeline (PDF/image/HEIC/QR/hash) — **license-clean libs from day one** (no AGPL; LGPL ffmpeg build; jSquash not Squoosh). Ship the universal core to web.
2. **Taiwan pack + data pipeline:** calendar/payroll/ID/text/address engines + TW locale pack + gov-data adapters + reminder engine. First market live.
3. **Mobile (Capacitor):** camera + **native OCR (Apple Vision / ML Kit)** as the scanning hero, push, widgets, share. Add **Japan + HK packs** (CJK reuse). **NFC transit-balance is a capability-detected bonus, not a launch dependency** (FeliCa hardware gaps) — ship with manual entry + official-app deep-link.
4. **Backend conversion + English region:** LibreOffice/Gotenberg + media workers; English locale packs (US→UK→CA→AU) with jurisdiction switch; PDF/e-sign + money-math + conversion heroes.
5. **Desktop + AI + sync:** Tauri 2 app, command palette, AI assistant, opt-in encrypted sync, browser extension / OS share targets.

---

## 17. Top technical risks & mitigations

- **WASM bundle bloat** → aggressive code-splitting, per-tool lazy load, on-demand WASM fetch; perf budgets in CI.
- **Wrong rules data** (tax/holiday/FX) → versioned config, golden recalculation tests, human diff review, in-app provenance.
- **Gov API instability / terms** → edge cache + graceful degradation; adapters isolate breakage; never hard-depend on a single feed (e.g., TW 補班 rule changed in 2025 — config, not code).
- **High-fidelity office conversion** → accept server fallback; set client/server boundary by file size + fidelity need.
- **NFC/FeliCa fragmentation** → capability-detect; many Android phones can't read FeliCa at all, so transit-balance is a bonus, never a dependency; always offer manual entry + official-app deep-link.
- **Breadth → maintenance cost** → plugin architecture, shared engines, golden tests so a 200-tool surface stays sane.

---

*Bottom line:* a **TypeScript monorepo** with **pure-TS core engines + Zod-validated, versioned locale packs**, **WASM-powered on-device compute**, a **thin stateless backend**, and a **Capacitor/Tauri** multi-platform shell delivers the research's two non-negotiables — *broad coverage* and *local-first privacy* — while making each new market a **config + data** effort rather than a new app.

---

## Appendix — Verification log (June 2026)

This plan was fact-checked against current sources. Verdict: **the core architecture (TS monorepo, locale packs, local-first WASM, thin backend, Capacitor + Tauri) holds.** Five corrections were applied:

| Checked | Finding | Action taken |
|---|---|---|
| Squoosh / `@squoosh/lib` | **Deprecated & unmaintained** since 2023 | Switched image stack to **jSquash + wasm-vips** |
| MuPDF / `mupdf-wasm` | **AGPL-3.0** — source-disclosure risk for a commercial app | Dropped it; use **pdf-lib / pdf.js / PDFium**; added §13.1 license audit |
| ffmpeg.wasm | Real: needs **COOP/COEP isolation**, ~32 MB core, 4 GB cap; default cores include GPL parts | Added isolation/segmentation mitigations + LGPL-build requirement; server fallback |
| NFC transit-card balance (FeliCa) | iOS needs FeliCa entitlement + modal; **most non-Japan Android can't read FeliCa**; Web NFC can't do it | Re-scoped to **capability-detected bonus**, native plugin only, manual-entry fallback |
| CJK OCR via tesseract.js | Works but weak on photos/complex backgrounds | Mobile camera OCR → **native Apple Vision / Google ML Kit**; tesseract.js for web/offline |

Also confirmed sound as specified: **Tauri 2** (stable 2.9.x, Dec 2025; mobile + NFC/barcode plugins), **Capacitor** maturity and FeliCa-capable community NFC plugins (capawesome paid / Exxili free), **tesseract.js** CJK + vertical (`jpn_vert`) support, and **Gotenberg/LibreOffice** for server-side high-fidelity office conversion.

**Verification sources:**
- [Squoosh repo (GoogleChromeLabs)](https://github.com/GoogleChromeLabs/squoosh) · [jSquash (maintained, Squoosh-derived)](https://github.com/jamsinclair/jSquash) · [wasm-vips](https://github.com/kleisauke/wasm-vips)
- [MuPDF license (AGPL/commercial)](https://mupdf.readthedocs.io/en/1.27.0/license.html) · [pdf-lib (MIT)](https://github.com/Hopding/pdf-lib) · [pdf.js (Apache-2.0)](https://github.com/mozilla/pdf.js) · [PDFA survey of open-source PDF solutions](https://pdfa.org/wp-content/uploads/2021/06/Survey-of-OpenSource-Solutions.pdf)
- [ffmpeg.wasm — cross-origin isolation issue #234](https://github.com/ffmpegwasm/ffmpeg.wasm/issues/234) · [#353 COI breaks ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm/issues/353)
- [TRETJapanNFCReader (FeliCa/CoreNFC)](https://github.com/treastrain/TRETJapanNFCReader) · [Metrodroid iOS NFC limits](https://www.metrodroid.org/metrodroid/ios) · [Capawesome Capacitor NFC plugin](https://github.com/capawesome-team/capacitor-nfc) · [Exxili Capacitor NFC (FeliCa)](https://github.com/Exxili/capacitor-nfc) · [reading Suica with CoreNFC](https://blog.kalan.dev/en/devnote/core-nfc-en)
- [tesseract.js](https://github.com/naptha/tesseract.js) · [Apple Vision vs Google ML Kit on-device OCR](https://www.bitfactory.io/de/dev-blog/comparing-on-device-ocr-frameworks-apple-vision-and-google-mlkit/) · [ML Kit text recognition (CJK script models)](https://developers.google.com/ml-kit/vision/text-recognition/v2/android)
- [Tauri 2.0 stable release](https://v2.tauri.app/blog/tauri-20/) · [Tauri develop docs](https://v2.tauri.app/develop/)
