# Zii — Marketing Research & Product Roadmap Plan

*Regional demand analysis, top-10% usage concentration, competitive positioning, and a marketing-aligned build sequence for [zii.tools](https://zii.tools).*

Last updated: July 1, 2026

> **Companion docs:** `CROSS-MARKET-OVERVIEW.md` (feature strategy) · `ROADMAP.md` (engineering phases) · per-market `FEATURE-CATALOG-*.md` (detailed specs)

---

## 1. Executive summary

**What Zii is today:** A privacy-first, offline-capable PWA utility suite at `zii.tools` with **21 universal tools** shipped (PDF merge/split, image compress/convert, QR generate/scan, calculators, text tools, dev encoders). Eight UI languages (en, zh-TW, zh-HK, ja, ko, es, fr, de). All processing runs on-device — no uploads, no accounts.

**Market opportunity:** The online utility-tool category is enormous and fragmented. Incumbent leaders (iLovePDF ~216–238M visits/mo, Smallpdf ~35M total visits / ~58M search visits depending on source, TinyWow ~2.4M) process files on remote servers and monetize via freemium caps, ads, and subscriptions. A growing privacy-conscious segment (DuckDuckGo referrals, GDPR-aware EU users, developers who self-host IT-Tools) wants the same breadth without uploading sensitive documents.

**Core marketing insight:** ~**10% of tool categories drive ~70–80% of real usage** across every region. PDF compress/merge/split, image compress/convert, and QR generation account for the bulk of traffic on multi-tool sites. Regional locale packs (Taiwan invoice lottery, Japan 和暦/手取り, Hong Kong Octopus/MTR, US paycheck/e-sign) create **defensible retention** that generic Western competitors cannot copy.

**Recommended strategy:** Win SEO on the universal top-10% with a **provable privacy story** (Network tab = zero uploads), but do not try to outspend incumbents on generic "PDF tools" terms. Start with long-tail intent where local processing is a conversion hook: **compress PDF no upload**, **HEIC to JPG no upload**, **resize image locally**, and **private PDF merge/split**. Sequence: **Universal heroes → Taiwan + CJK cluster → English region → Mobile native → AI assist.**

---

## 2. Regional market research

### 2.1 Global traffic geography (category incumbents)

Competitor traffic data (Similarweb, May–Jun 2026) reveals where demand concentrates:

| Region cluster | Share of iLovePDF traffic | Share of Smallpdf traffic | Implication for Zii |
|----------------|---------------------------|---------------------------|---------------------|
| **South Asia (India-led)** | ~18–22% | ~18% | Highest volume, price-sensitive, mobile-heavy; privacy messaging less differentiated vs. "free unlimited" |
| **Southeast Asia (ID, VN, PH)** | ~5–12% combined | ~4–8% | Fast-growing; English UI sufficient; PDF + image compress heroes |
| **Latin America (BR, MX, CO)** | ~12–15% combined | ~5–8% | Spanish UI (already supported) unlocks organic reach |
| **United States** | ~5–7% | ~10% | Higher ARPU potential; e-sign, paycheck calc, HEIC→JPG are anchors |
| **Western Europe (DE, FR, IT, UK)** | ~8–12% combined | ~8–10% | GDPR/privacy angle strongest; de/fr UI already in app |
| **East Asia (TW, JP, HK, KR)** | <3% each on Western incumbents | <2% each | **Underserved by iLovePDF/Smallpdf localization** — Zii's multi-market packs are a moat |

**Secondary data point (MiOffice 2026 report, 35k users):** 82% of file-processing tool traffic came from South & Southeast Asia; 47% of sessions were mobile. Google organic search drove ~76.5% of acquisition. PDF operations represented ~36% of tool page views; image processing represented ~33%; video ~17%; AI-powered tools ~11%.

**Industry growth (APAC PDF software):** Asia-Pacific PDF software market projected at **14.4% CAGR (2025–2033)**; Japan's document-processing and software markets growing on digitization mandates and SME paperless push. Taiwan and Japan are listed explicitly in APAC market reports as growth markets alongside India and Australia.

### 2.1.1 Research refinements from fresh internet review

The updated research does **not** change the overall strategy, but it sharpens the first six months:

| Finding | Product implication |
|---------|---------------------|
| iLovePDF and Smallpdf dominate broad head terms with very high authority. | Avoid broad "PDF tools" launch messaging; target long-tail zero-upload/offline phrases first. |
| File processing is nearly mobile-parity: ~47% of sessions are phone/tablet. | Phase 0 must include mobile-first file pickers, touch-friendly drag/reorder, and memory limits, not just desktop workflows. |
| Image compress, PDF compress, and image resize are the top three event drivers in the 35k-user file-processing dataset. | Move PDF compress + image resize from "early roadmap" to launch gate. |
| PDF compression demand includes web-performance use cases: linearization, metadata stripping, image DPI presets. | Build compression presets: Email, Web/Fast View, Print, and Max Compression. |
| Privacy-first alternatives (PDF4.dev, LocalPDF, FileMint, NeatKit) are using the same "no upload" story. | Zii needs proof assets and broader market/local scope; privacy alone is now table stakes in this niche. |
| HEIC remains a cross-platform pain because iPhones default to HEIC and Windows/web forms often reject it. | HEIC→JPG/WebP/PDF should ship before lower-frequency document converters. |
| QR code scanning/generation is mainstream in the US and global restaurant/marketing workflows. | Keep QR in the top-10% set; upgrade it with Wi-Fi, vCard, event, and batch modes rather than treating it as done. |

### 2.2 Region-by-region demand profile

#### 🌏 Global / language-agnostic (40–50% of Zii's addressable usage)

| Need | Frequency | Search intent examples | Zii status |
|------|-----------|------------------------|------------|
| PDF compress | Daily (office) | "compress pdf", "reduce pdf size" | ❌ Not yet |
| PDF merge / split | Daily | "merge pdf free", "split pdf" | ✅ Shipped |
| Image compress / resize | Daily | "compress image", "resize photo" | ✅ Compress; resize pending |
| Image format convert (incl. HEIC) | Weekly | "heic to jpg", "webp to png" | ✅ Partial (PNG/JPEG/WebP) |
| QR code generator | Weekly | "qr code generator" | ✅ Shipped |
| Unit / currency convert | Weekly | "unit converter", "currency converter" | ✅ Units; FX pending |
| Dev encoders (Base64, hash, URL) | Daily (devs) | "base64 encode", "sha256 hash" | ✅ Shipped |
| JSON / YAML tools | Daily (devs) | "json formatter", "json to yaml" | ✅ Shipped |

#### 🇹🇼 Taiwan (highest-conviction primary market)

| Tier-1 local need | Why it wins | Competition |
|-------------------|-------------|-------------|
| 統一發票對獎 + 載具 | Unique, bi-monthly ritual; extreme stickiness | 財政部 app, fragmented web tools |
| 垃圾車時間/位置 | Daily habit, municipality-specific | 各縣市 app, Facebook pages |
| 民國⇄西元⇄農曆 + 國定假日 | Form-filling constant | Calendar apps (no single tool) |
| 薪資實領試算 (勞健保/勞退) | Monthly; sensitive data | MoneyDJ, spreadsheets |
| 身分證/統編驗證 | Form validation | Scattered validators |
| 繁簡/全形半形/注音 | Daily office work | 繁化姬, OpenCC sites |

**Marketing angle:** 「資料不上傳的台灣日常工具箱」— privacy-first for salary, ID numbers, and invoice data that users refuse to paste into random websites.

#### 🇭🇰 Hong Kong

| Tier-1 local need | Why it wins | Competition |
|-------------------|-------------|-------------|
| 八達通餘額/增值 | Daily tap-to-pay culture | Octopus official app |
| MTR/巴士 ETA | Commute daily | MTR Mobile, Citymapper |
| 颱風/暴雨/AQHI | Urgent seasonal | HKO app |
| 薪俸稅 + MPF 計算 | Monthly/payroll cycle | IRD calculators, spreadsheets |
| HKID/BR 驗證 | Forms, dev | Scattered |
| 繁簡/粵拼 | Office daily | OpenCC, CantoDict |

**Marketing angle:** Bilingual (zh-HK + en) utility hub replacing 10 bookmarked gov/transport sites.

#### 🇯🇵 Japan

| Tier-1 local need | Why it wins | Competition |
|-------------------|-------------|-------------|
| 和暦⇄西暦 + 六曜 | Form + auspicious-day lookup | コジツ, calendar apps |
| 手取り計算 | Job changes, monthly | マネーフォワード, free calc sites |
| ふるさと納税 上限 | Seasonal spike (Nov–Dec) | Dedicated simulators |
| 郵便番号→住所 | Shopping/forms constant | 日本郵便, zipcloud |
| ゴミ分別/収集日 | Daily municipal rules | さんあ〜る, municipal apps |
| 全角半角/ふりがな | Office daily | Various one-off tools |

**Marketing angle:** 「ブラウザ完結・オフライン対応の万能ツール」— offline PWA matters in transit (地下鉄) and during disasters (地震/台風).

#### 🇺🇸🇬🇧🇨🇦🇦🇺 English region

| Tier-1 local need | Why it wins | Competition |
|-------------------|-------------|-------------|
| PDF + **e-signature** | Legally anchored (ESIGN/UETA) | DocuSign, Smallpdf Pro |
| **HEIC→JPG** conversion | iPhone default format pain | CloudConvert, iLovePDF |
| Paycheck / take-home calc | Every pay period | ADP, PaycheckCity, spreadsheets |
| Imperial↔metric + cooking | US-specific daily | Google, unit sites |
| Time-zone meeting planner | Remote work daily | WorldTimeBuddy |
| Tip + sales tax + split | US dining culture | Tip calculators (fragmented) |

**Marketing angle:** "Your files never leave your device" vs. upload-based iLovePDF/Smallpdf — strongest where users process tax forms, pay stubs, and contracts.

#### 🇰🇷 Korea · 🇪🇸 LATAM · 🇪🇺 EU (secondary locales already in UI)

Korean (`ko`) and Spanish (`es`) UI exists but no locale pack yet. Spain + Latin America align with iLovePDF's #4–6 traffic markets (Mexico, Colombia). German/French UI supports DACH/France privacy-conscious segments. **Quick win:** SEO landing pages + localized meta (already prerendered) without full locale packs.

---

## 3. Top 10% usage analysis

### 3.1 Methodology

"Top 10%" here means the **small subset of tools that drive a disproportionate share of traffic and processing events** on multi-tool platforms — not 10% of Zii's 200-tool catalog (~20 tools), but the **~8–12 hero tools** that appear in every competitor's homepage and sitemap.

Sources synthesized:
- MiOffice 2026 file-processing report (35k users, 30-day event counts)
- Similarweb traffic by country for iLovePDF, Smallpdf, TinyWow
- Semrush/search-volume snapshots for PDF task queries (US dataset)
- Zii internal catalogs (`FEATURE-CATALOG*.md`) Tier-1 tables per market

### 3.2 Universal top 10% (cross-market heroes)

These **12 tools** represent ~70–80% of processing volume on general utility sites. The first four should be treated as a launch gate because they combine high frequency, clear SEO intent, and a credible local-processing advantage:

| Rank | Tool | ~Usage share | Zii today | Priority |
|------|------|--------------|-----------|----------|
| 1 | **Image compress** | ~12% | ✅ | Maintain; add batch + size target |
| 2 | **PDF compress** | ~11% | ❌ | **P0 launch gate — highest missing hero** |
| 3 | **Image resize** | ~9% | ❌ | **P0 launch gate** |
| 4 | **Image convert** (incl. HEIC) | ~6% | ✅ Partial | **P0 launch gate — add HEIC/HEIF** |
| 5 | **PDF split** | ~4% | ✅ | Maintain |
| 6 | **PDF merge** | ~4% | ✅ | Maintain |
| 7 | **Background remove** (image) | ~4% | ❌ | P1 — high growth |
| 8 | **PDF → Word** | ~3% | ❌ | P1 — server or WASM quality tradeoff |
| 9 | **JPG ↔ PDF** | ~3% | ❌ | P0/P1 — easy PDF adjacency |
| 10 | **QR code generator** | ~3% | ✅ | Maintain; add Wi-Fi/vCard/event/batch |
| 11 | **Video/audio convert** (MP4→MP3) | ~3% | ❌ | P2 |
| 12 | **Word/char count** | ~2% | ✅ | Maintain; CJK already differentiated |

**Category rollup:** PDF operations ≈ **36%** of tool-page views; image operations ≈ **33%**; video ≈ **17%**; AI-powered image/document tools ≈ **11%**. This means early Zii should act like a **PDF + image utility suite with dev/text depth**, not a generic 200-tool directory yet.

### 3.2.1 Fine-tuned priority order

The roadmap should bias toward tools with all four properties: high search frequency, short time-to-value, strong no-upload proof, and low data-maintenance burden.

| Order | Build | Why now |
|-------|-------|---------|
| 1 | **PDF compress** with Email/Web/Fast View/Print presets | Highest missing universal hero; strong privacy + mobile pain. |
| 2 | **Image resize** with social/document presets | Top-three event driver; pairs naturally with existing image compress. |
| 3 | **HEIC/HEIF → JPG/WebP/PDF** | Clear compatibility pain for iPhone → Windows/web forms. |
| 4 | **JPG/PNG/WebP → PDF** | Easy PDF adjacency; common school/admin/expense use case. |
| 5 | **QR generator upgrade** (Wi-Fi, vCard, event, batch) | Existing shipped tool can become more SEO-competitive quickly. |
| 6 | **JSON formatter + password/UUID** | Low-complexity developer long-tail; reinforces IT-Tools alternative story. |
| 7 | **Currency converter** | Globally useful but requires dated/rate-source trust work. |
| 8 | **Background remove** | Fast-growing, but model size/performance makes it a second wave. |
| 9 | **PDF→Word/OCR/e-sign** | High value, but quality and legal/workflow expectations are harder. |
| 10 | **Video/audio convert** | Real demand, but heavier WASM/mobile memory risk; defer until PWA cache and perf are proven. |

### 3.3 Regional top 10% (locale-specific heroes)

Each market adds **3–5 tools** that match or exceed universal heroes in *session frequency* for local users:

| Market | Local top-5 (retention drivers) | Universal overlap |
|--------|--------------------------------|-------------------|
| 🇹🇼 Taiwan | 發票對獎, 垃圾車, 薪資試算, 民國曆, 身分證驗證 | PDF, image compress, QR |
| 🇭🇰 Hong Kong | 八達通, MTR ETA, 颱風信號, MPF/薪俸稅, HKID | PDF, image compress, QR |
| 🇯🇵 Japan | 和暦/六曜, 手取り, ふるさと納税, 郵便番号, ゴミ分別 | PDF, image compress, QR |
| 🇺🇸 EN | E-sign PDF, paycheck calc, HEIC→JPG, timezone planner, tip+tax | PDF suite, image, QR |

**Combined product rule:** Ship **12 universal heroes + 5 local heroes per active market** to capture both acquisition (SEO) and retention (daily habit).

### 3.4 What Zii already covers vs. gap

| Layer | Shipped (21 tools) | Missing for top-10% coverage |
|-------|-------------------|-------------------------------|
| PDF | merge, split | **compress**, rotate, JPG↔PDF, OCR, e-sign |
| Image | compress, convert (PNG/JPEG/WebP) | **resize**, **HEIC**, background remove |
| Text/dev | count, case, diff, fullwidth, regex, base64, hash, url, json-csv/yaml | JSON formatter, UUID, password gen |
| Calc | tip/%, units, BMI, loan, date | **currency (live FX)**, sales tax |
| Generator | QR gen + scan | Wi-Fi/vCard modes, barcode |
| Local (any market) | — | All Tier-1 locale tools |

**Coverage score:** ~55% of universal top-10% shipped; ~0% of locale top-10% shipped.

---

## 4. Competitive landscape

### 4.1 Competitor map

```
                    BREADTH (many tool categories)
                              ↑
          TinyWow ●           │           ● iLovePDF
       UltimateTools ●        │        ● Smallpdf
              Neatkit ●       │     ● Convertio
                  Zii ★       │  ● Adobe Acrobat
            IT-Tools ●        │
                              │
    PRIVACY ←─────────────────┼─────────────────→ CONVENIENCE
    (client-side)             │              (cloud, accounts)
                              │
           PDF4.dev ●         │        ● Sejda
          LocalPDF ●          │        ● PDF24
                              ↓
                    DEPTH (PDF-only specialists)
```

★ = Zii target position: **broad catalog + privacy-first + multi-market locale packs**

### 4.2 Head-to-head comparison

| Dimension | **Zii** | iLovePDF / Smallpdf | TinyWow / UltimateTools | IT-Tools | Neatkit / PDF4.dev |
|-----------|---------|---------------------|-------------------------|----------|-------------------|
| **Monthly visits** | Pre-launch | iLovePDF ~216–238M; Smallpdf ~35M total / ~58M search by source | ~2.4M / ~1M | High dev mindshare; traffic varies by mirror/source | Smaller but directly comparable privacy niche |
| **Tool count** | 21 (→200 planned) | ~25 free | 50–100+ | 80+ dev | 16–30 |
| **Processing** | ✅ Client-side | ❌ Server upload | ❌ Mostly server | ✅ Client-side | ✅ Client-side |
| **Offline PWA** | ✅ | ❌ | ❌ | Partial | ✅ |
| **Accounts required** | No | No (basic) / Yes (pro) | No | No | No |
| **Free limits** | None | iLovePDF file-size/ads; Smallpdf commonly 2 tasks/day or hour by source | Ads; some limits | None | None |
| **Multi-language** | 8 langs + hreflang SEO | Limited | EN-centric | EN + community | EN |
| **Locale packs (TW/HK/JP)** | Planned (engines built) | ❌ | ❌ | ❌ | ❌ |
| **Mobile app** | PWA (native planned) | ✅ iOS/Android | Web only | Web only | PWA |
| **OCR / e-sign** | Planned | ✅ (paid) | Partial | ❌ | Partial |
| **License** | Clean (no AGPL) | Proprietary | Proprietary | **GPL-3.0** | Proprietary |
| **Monetization** | None yet | iLovePDF ~$48–84/yr; Smallpdf ~$108–180/yr depending plan/source | Ads + premium | Donations / self-host | Mostly free/API/pro experiments |

### 4.3 Competitor strengths to respect

| Competitor | What they do better | Zii counter-position |
|------------|--------------------|-----------------------|
| **iLovePDF** | Brand, SEO scale, 238M visits, full PDF suite | Provable zero-upload; no caps; TW/HK/JP local tools |
| **Smallpdf** | Polished UX, desktop app, e-sign workflow | Privacy + offline; no 2-tasks/hour limit |
| **TinyWow** | Tool breadth + AI writing | No ads; on-device; trustworthy for sensitive files |
| **IT-Tools** | Dev-tool depth, 39k GitHub stars, self-host crowd | Broader non-dev tools + locale packs; permissive license |
| **Adobe Acrobat** | OCR quality, enterprise trust, editing | Free, no account, local-first for casual users |
| **LocalPDF / PDF4.dev** | PDF depth, client-side proof points | Multi-category + Asia locale moat |
| **MoneyForward / 財政部** (JP/TW) | Local finance/invoice authority | Complement, don't replace — calculator + privacy layer |

### 4.4 Zii's defensible differentiators

1. **Privacy proof, not privacy policy** — WASM client-side processing verifiable in DevTools; no retention backend (`retainedCount = 0`).
2. **Workflow breadth beyond PDF** — privacy-first PDF competitors exist, but most stop at PDF; Zii can connect PDF, image, QR, text, calculators, and locale tools.
3. **Multi-market locale packs** — no competitor combines universal tools with 統一發票, 八達通, 和暦, 和 ESIGN/paycheck math in one pluggable architecture.
4. **Offline PWA** — usable on planes, in tunnels, during disasters; incumbents fail without connectivity.
5. **CJK-native text tools** — fullwidth/halfwidth, CJK-aware word count, 繁簡/注音/粵拼/ふりがな (engines `@zii/text`, `@zii/calendar`, `@zii/id` already in monorepo).
6. **License-clean** — no GPL contagion (IT-Tools is GPL-3.0); enterprise-friendly.

---

## 5. Product roadmap plan (marketing-aligned)

This roadmap **merges engineering phases from `ROADMAP.md` with go-to-market priorities** derived from regional research and top-10% usage data.

### Phase 0 — Launch readiness (Now → 4 weeks)

**Goal:** Ship a credible SEO surface that can rank for narrow, high-intent universal queries before competing on broad head terms.

| Workstream | Deliverables | Marketing outcome |
|------------|--------------|-------------------|
| **Hero gap fill** | PDF compress, image resize, HEIC→JPG/WebP/PDF, JPG/PNG/WebP→PDF | Cover 4 of top-12 universal tools |
| **PDF compression quality** | Email/Web Fast View/Print/Max presets; metadata stripping; optional linearization | Compete on the exact "reduce file size" jobs users search for |
| **Mobile UX** | Touch-first file picker, reorder, batch progress, memory warnings | Fit the ~47% mobile session reality |
| **SEO** | Prerendered tool pages (done), sitemap, structured data (done), localized titles for top tools | Index 25+ landing pages per locale |
| **Trust signals** | "Zero upload" badge, Network-tab verification guide, privacy page, per-tool local-processing note | Conversion vs. iLovePDF and privacy-first clones |
| **Analytics** | Privacy-preserving analytics (Plausible/Fathom or self-host Umami) | Region + tool funnels without PII |
| **Performance** | Lighthouse 90+, WASM code-split | Mobile 47% session share |

**Exit KPI:** 30+ indexable tool URLs · top-10% coverage ≥75% · Core Web Vitals green · p95 PDF/image operation under 5s for normal mobile-sized files.

---

### Phase 1 — Universal backbone (Weeks 4–16)

**Goal:** Own the "privacy-first TinyWow/iLovePDF alternative" niche in EN + ES + DE + FR markets.

| Priority | Tools to ship | SEO targets |
|----------|---------------|-------------|
| P0 | PDF rotate/reorder/delete pages; QR Wi-Fi/vCard/event/batch; JSON formatter | "rotate pdf no upload", "wifi qr code", "json formatter" |
| P0 | Currency converter (live FX, dated rates) | "currency converter" |
| P1 | UUID/password generator, JWT decoder, cron parser | Dev long-tail via IT-Tools overlap |
| P1 | Image background remove (on-device model) | "remove background no upload" |
| P1/P2 | PDF→Word/OCR/e-sign exploration with quality gates | "pdf to word", "sign pdf free offline" |
| P2 | Video→MP3, archive zip/unzip | TinyWow parity after mobile memory confidence |

**Go-to-market:**
- Launch on Product Hunt, Hacker News ("Show HN: offline PDF tools"), r/privacy, r/selfhosted
- Comparison landing pages: "Zii vs iLovePDF", "Zii vs Smallpdf" (honest feature tables)
- Developer docs: verify zero-upload in DevTools (step-by-step)

**Exit KPI:** 50+ tools · 10k MAU · avg session ≥2 tools · 60% organic search share · at least 30% of organic landings on "no upload/offline/private" long-tail pages.

---

### Phase 2 — Taiwan locale pack (Weeks 12–24, parallel with Phase 1 tail)

**Goal:** First sticky market — convert SEO traffic into daily-use retention.

| Priority | Feature | Retention loop |
|----------|---------|----------------|
| P0 | 統一發票對獎 + 中獎推播 | Bi-monthly return |
| P0 | 民國⇄西元⇄農曆 + 國定假日 | Form-filling daily |
| P0 | 薪資實領試算 (115年級距) | Monthly |
| P1 | 身分證/統編驗證, 3+3 郵遞區號 | Utility |
| P1 | 垃圾車時間 (選定 6 縣市 MVP → 22) | Daily habit |
| P2 | 繁簡/注音, 天氣/AQI/地震 | High frequency |
| Gate | Dated source registry for invoice numbers, holidays, payroll brackets, and city data | Trust / maintenance |

**Go-to-market:**
- PTT, Dcard, Facebook 工具社團 — 「不上傳的發票對獎/薪資計算」
- LINE 官方帳號: 發票開獎日推播
- App Store (TW) PWA wrapper or Capacitor app

**Exit KPI:** TW locale DAU/WAU ≥20% · 發票對獎 MAU ≥5k · NPS ≥40 · all tax/holiday/payroll outputs show source + effective date.

---

### Phase 3 — CJK expansion: Hong Kong + Japan (Weeks 20–36)

**Goal:** Reuse 60–70% of Taiwan engine work; capture underserved East Asian demand.

| Market | P0 features | Shared engine reuse |
|--------|-------------|---------------------|
| 🇭🇰 HK | Lunar/general-vs-statutory holidays, MPF/薪俸稅, HKID, MTR ETA, 颱風 | Calendar, payroll, ID, weather |
| 🇯🇵 JP | 和暦/六曜, 手取り, 郵便番号, ゴミ分別 MVP | Calendar, payroll, address, reminders |
| Gate | Per-market data-source registry + update owner | Prevent stale local data from damaging trust |

**Go-to-market:**
- HK: LIHKG, Snow.gg, 香港01 tool articles
- JP: Yahoo!知恵袋 answers, はてなブックマーク, ふるさと納税 season SEO (Nov)

**Exit KPI:** 3 active locale packs · locale DAU ≥15% per market · CJK retention > EN retention · zero undated government/tax data in production UI.

---

### Phase 4 — English region pack (Weeks 28–44)

**Goal:** Compete for US/UK paycheck + e-sign + HEIC traffic where ARPU and privacy concern are highest.

| P0 | E-sign PDF (ESIGN-compliant) · paycheck calc (US MVP → UK/CA/AU) · imperial/cooking converter · timezone meeting planner |
| P1 | Sales tax by state · mortgage with PMI · subscription reminder |
| P2 | Luhn/ABA/IBAN validators · W-2 field explainer |
| Gate | Jurisdiction switch for tax year, date format, units, and spelling |

**Go-to-market:**
- SEO: "paycheck calculator 2026", "sign pdf free offline", "heic to jpg no upload"
- Partnerships: remote-work newsletters, privacy-focused YouTubers
- US tax season push (Jan–Apr)

**Exit KPI:** EN-region MAU ≥25% of total · e-sign tool ≥1k uses/week in tax season · paycheck results show tax year/source version.

---

### Phase 5 — Mobile native + growth loops (Weeks 36–52)

**Goal:** Meet 47% mobile demand with native capabilities incumbents charge for.

| Capability | Platform | Unlocks |
|------------|----------|---------|
| Capacitor iOS/Android | Native | App Store discovery, push (發票/颱風/ゴミ), share sheet |
| Camera OCR | Vision / ML Kit | Receipt scan, document scanner hero |
| NFC transit read | FeliCa (bonus) | Octopus/Suica balance — capability-gated |
| Tauri desktop | Win/Mac/Linux | Heavy PDF batch workflows |

**Exit KPI:** App store 4.5+ rating · mobile DAU ≥50% · push opt-in ≥30% (locale markets).

---

### Phase 6 — AI assist layer (Week 52+)

**Goal:** "Do it for me" without breaking privacy trust — only after deterministic tools are trustworthy.

| Feature | Constraint |
|---------|------------|
| NL tool routing ("compress these 5 PDFs") | On-device intent → registry |
| Payslip/receipt → calculator prefill | On-device OCR + parsing; no upload default |
| Smart reminders from bill photos | Local extraction → reminder engine |
| Market-aware form explainers | Static templates first; LLM optional opt-in |

**Exit KPI:** AI-assisted sessions ≥10% · zero silent PII uploads · user-visible data boundary.

---

## 6. Go-to-market channel plan

| Channel | Regions | Tactics |
|---------|---------|---------|
| **Google SEO** | Global | Tool-specific landing pages × 8 langs; long-tail "no upload" modifiers |
| **Content marketing** | EN, TW, JP | Comparison posts, privacy guides, tax-season calculators |
| **Community** | EN | HN, Reddit (r/privacy, r/productivity), Product Hunt |
| **Community** | TW | PTT, Dcard, FB groups |
| **Community** | JP | はてな, Yahoo!知恵袋, X |
| **App stores** | TW/HK/JP first | "工具", "実用", "發票", "八達通" keywords |
| **Partnerships** | EN | Remote-work / privacy newsletters |
| **Self-host / OSS angle** | EN dev | Open-core registry; contrast with IT-Tools GPL |

**Monetization options (future, not Phase 0–1):**
- Optional encrypted sync (E2E)
- Pro: batch OCR, e-sign workflows, team self-host license
- Never: ads on free tier (conflicts with privacy brand)

---

## 7. KPIs & success metrics

| Metric | Phase 0 | Phase 1 | Phase 2–3 | Phase 4+ |
|--------|---------|---------|-----------|----------|
| Indexable tool URLs | 30+ | 80+ | 120+ | 200+ |
| MAU | 1k | 10k | 50k | 200k |
| Top-10% tool coverage | 75% | 90% | 90% + locale | Full |
| Organic search share | 50% | 60% | 65% | 70% |
| Mobile session share | 40% | 45% | 50% | 50%+ |
| Locale pack DAU share | — | — | ≥20% TW | ≥15% per market |
| Avg tools/session | 1.5 | 2.0 | 2.5 | 3.0 |
| p95 client-side op time (PDF compress) | <5s | <3s | <3s | <2s |

---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SEO dominated by iLovePDF DA | High | High | Long-tail "privacy/offline/no upload" + locale keywords |
| Scope creep (200 tools × 4 markets) | High | High | Strict top-10% sequencing; maintenance exit criteria per `ROADMAP.md` |
| Live gov data staleness | Medium | Critical | Versioned, dated, auditable data packs; visible "effective date" |
| WASM performance on mobile | Medium | Medium | Code-split; native fallback in Phase 5 |
| Browser memory limits on large PDFs/HEIC batches | Medium | Medium | File-size warnings, chunked processing where possible, desktop/Tauri path for heavy workflows |
| Privacy-first competitors copy the same "no upload" copy | High | Medium | Show proof in product, add locale packs, publish network-verification guide |
| OCR quality vs. Adobe | Medium | Medium | Native Vision/ML Kit on mobile; set expectations on web |
| GPL contamination via deps | Low | High | License scan in CI (already enforced) |

---

## 9. Immediate next actions (July 2026)

1. **Ship PDF compress** with Email/Web Fast View/Print/Max presets, metadata stripping, and clear local-processing copy.
2. **Ship image resize + HEIC/HEIF conversion** with batch support and mobile memory warnings.
3. **Add JPG/PNG/WebP → PDF** to complete the first PDF/image adjacency loop.
4. **Upgrade QR generator** with Wi-Fi, vCard, calendar/event, and batch modes.
5. **Publish privacy verification page** — step-by-step DevTools proof; core conversion asset.
6. **Deploy analytics** — tool-level funnels by region without PII, including organic query-page segmentation.
7. **Start Taiwan P0 locale pack data registry** before feature UI: 發票 source, 民國/holiday source, payroll bracket source.
8. **Create comparison content** — `/vs/ilovepdf`, `/vs/smallpdf`, `/vs/pdf4dev`, and `/vs/localpdf` prerendered pages for EN + zh-TW.

---

## 10. Sources & references

### Traffic & market data
- Similarweb / Semrush summaries: iLovePDF (~216–238M visits/mo by source, May–Jun 2026), Smallpdf (~35M total visits / ~58M search visits by source), TinyWow (~2.4M) — via semrush.com, reviewbolt.com, ahrefstop.com, seektool.ai
- MiOffice 2026 File Processing Report (35k users): tool ranking, 36% PDF page views, 33% image processing, 82% South/Southeast Asia traffic, 47% mobile, 76.5% organic search — mioffice.ai/blog/2026-file-processing-report
- APAC PDF software market 14.4% CAGR and global PDF software 12.4% CAGR — cognitivemarketresearch.com
- Global PDF editor/software APAC fastest-growing ~12.1% CAGR — dataintelo.com

### Competitors & alternatives
- iLovePDF vs Smallpdf vs PDF4.dev — pdf4.dev/blog
- Privacy-first PDF alternatives — extractivo.com, ihatepdf.cv, pdfteq.com, localpdf.online
- HEIC local conversion positioning — microapp.io, heic.dev, Adobe HEIC conversion guide
- QR adoption statistics — amraandelma.com, imqrscan.com
- IT-Tools (39k GitHub stars, GPL-3.0) — github.com/CorentinTh/it-tools
- Neatkit (client-side PWA) — neatkitapp.com, dev.to/chazchege

### Internal research
- `docs/CROSS-MARKET-OVERVIEW.md`
- `docs/FEATURE-CATALOG.md` + `FEATURE-CATALOG-TAIWAN.md` + `FEATURE-CATALOG-HONGKONG.md` + `FEATURE-CATALOG-JAPAN.md` + `FEATURE-CATALOG-ENGLISH.md`
- `ROADMAP.md` (engineering phases)
- `packages/app/src/lib/catalog.ts` (shipped tool inventory)

---

*This document should be updated quarterly or when major competitors shift pricing/privacy posture.*
