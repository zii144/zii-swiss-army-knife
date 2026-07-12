# Zii Swiss Army Knife — Cross-Market Research Overview

*Consolidated view of all market research: General + Taiwan + Hong Kong + Japan + English-speaking region.*

Last updated: June 28, 2026

---

## 0. What this document is

This is the umbrella view over five research files produced so far. Read this first, then drill into any single market.

| File | Scope |
|------|-------|
| `FEATURE-CATALOG.md` | Universal/general toolkit (~200 tools): file conversion, PDF, image, calculators, text, dev, generators, etc. |
| `FEATURE-CATALOG-TAIWAN.md` | Taiwan localization — the 14-item "core 70%" + full local catalog |
| `FEATURE-CATALOG-HONGKONG.md` | Hong Kong localization — 14-item core + full local catalog |
| `FEATURE-CATALOG-JAPAN.md` | Japan localization — 14-item core + full local catalog |
| `FEATURE-CATALOG-ENGLISH.md` | US/UK/Canada/Australia — 15-item core + full local catalog |

The central finding: **the feature *shapes* repeat across every market, but the *content* is local.** Every market needs a calendar/holiday tool, a take-home-pay calculator, ID validation, address/postal tools, bill reminders, transport, and (for CJK markets) text conversion — but the rules, data sources, and formats differ completely. That pattern is the single most important input to the tech stack plan: build a **shared core engine + pluggable per-market localization packs**.

---

## 1. The universal core (shared by all markets)

These tools work everywhere with little or no localization. They are the portable backbone and should be built once.

- **File conversion** — documents, images (incl. HEIC→JPG), audio, video, archives, ebooks, fonts.
- **PDF toolkit** — merge, split, compress, convert, OCR, fill, sign, watermark, redact, protect.
- **Image tools** — compress, resize (with regional photo/social presets), crop, background remove, favicon, EXIF strip.
- **Calculators (math/everyday)** — percentage, tip + split bill, discount, date difference/age, BMI, scientific.
- **Currency converter** — live FX; relevant in every market (travel + cross-border).
- **Unit converter** — universal, though imperial↔metric matters most in the English region.
- **Text tools** — word/char count, case convert, find/replace, diff, sort, dedupe, lorem ipsum, Markdown.
- **Generators** — QR (URL/Wi-Fi/vCard/payment), password + strength, UUID, barcode.
- **Encoding / hashing / dev tools** — Base64, URL encode, JSON/YAML/XML, regex, hash, JWT, cron.
- **Document scanner / OCR** — camera → deskewed, searchable PDF.
- **Reminder engine** — bills, renewals, expiries, deadlines (content localized, mechanism shared).

> Roughly 40–50% of each market's "core 70%" is actually this shared layer wearing local clothing.

---

## 2. The localized core — what makes each market sticky

The remaining ~50% of each market's daily usage is intensely local. This is where loyalty (and defensibility vs. generic Western tools) is won.

### Taiwan 🇹🇼
統一發票對獎 + 載具/手機條碼 · 垃圾車時間/即時位置 · 民國⇄西元⇄農曆 + 國定假日(無補班) · 勞健保/勞退6%/薪資實領 · 身分證/統編驗證 · 3+3郵遞區號 + 地址英譯 · 繁簡/注音/全形半形/字數 · 天氣/地震/AQI · 交通違規罰單/監理 · 雙鐵/捷運/YouBike · ibon 超商列印 · 農民曆/黃道吉日 · 報稅 · 匯率.

### Hong Kong 🇭🇰
八達通 (Octopus) 餘額/增值 · MTR/巴士/小巴/渡輪 ETA · 中電/港燈/煤氣/水費/差餉 bills · 颱風信號(T1–T10)/暴雨警告/AQHI · 薪俸稅 + 強積金(MPF) + 遣散費/長服金 · HKID/BR 驗證 · no-postcode address tools · 繁簡/粵拼(Jyutping)/全形半形 · iAM Smart 智方便 · FPS 轉數快 · 按揭/印花稅/HKEX · 通用/general holidays(15 vs 17) · 黃曆/通勝 · 馬會/六合彩.

### Japan 🇯🇵
和暦⇄西暦⇄旧暦 + 元号 + 六曜(大安/仏滅) · 手取り(健康保険/厚生年金/雇用保険/所得税/住民税) · ふるさと納税 上限シミュ · コンビニ払い(払込票) + PayPay · ゴミ分別 + 収集日 · 郵便番号→住所 + ヘボン式英語化 · 全角/半角/ふりがな/文字数 · 気象庁 天気/地震/緊急地震速報/台風/花粉 · 乗換案内 + Suica/PASMO 残高 · マイナンバー/法人番号/インボイス登録番号 · 確定申告/年末調整/医療費控除 · 新NISA/住宅ローン · 履歴書/年賀状/印鑑 · 祝日(ハッピーマンデー).

### English region 🇺🇸🇬🇧🇨🇦🇦🇺
PDF + **e-signature** (ESIGN/UETA) · HEIC→JPG file conversion · **paycheck/take-home** (IRS/HMRC/CRA/ATO) · **imperial↔metric + cooking** conversion · **time-zone + meeting planner** · mortgage/loan/401k/retirement · tip + sales tax/VAT/GST · subscription + bill tracker · ID/banking validation (Luhn/ABA/IBAN/SIN/TFN) · ZIP/postcode + address standardization · holiday + PTO planner · **jurisdiction switch** (US vs Commonwealth: dates, units, spelling, currency, tax year).

---

## 3. Cross-market feature matrix

How the same *feature shape* manifests per market. ✅ = high-priority local variant; ➖ = present but lower priority/less localized.

| Feature shape | Taiwan | Hong Kong | Japan | English |
|---|---|---|---|---|
| Calendar / era conversion | 民國/農曆 ✅ | 農曆 ✅ | 和暦/旧暦/六曜 ✅ | Gregorian only ➖ |
| Public-holiday + leave planner | ✅ (無補班) | ✅ (15 vs 17) | ✅ (ハッピーマンデー) | ✅ (PTO planner) |
| Take-home pay calculator | 勞健保/勞退 ✅ | MPF/薪俸稅 ✅ | 社会保険+税 ✅ | IRS/PAYE/CRA/ATO ✅ |
| Income-tax / filing helper | 綜所稅 ✅ | salaries+provisional ✅ | 確定申告/ふるさと納税 ✅ | refund/self-assess ✅ |
| National-ID validation | 身分證/統編 ✅ | HKID/BR ✅ | マイナンバー/法人番号 ✅ | SSN(mask)/SIN/TFN ➖ |
| Address + postal tool | 3+3 + 英譯 ✅ | no-postcode ✅ | 〒→住所 + 英語 ✅ | ZIP/postcode std ✅ |
| CJK text (繁簡/full-half/phonetic) | 注音 ✅ | 粵拼 ✅ | 全角半角/ふりがな ✅ | — (grammar/case) ➖ |
| Transit card balance | 悠遊卡 ➖ | 八達通 ✅ | Suica/PASMO ✅ | — (no equivalent) |
| Public-transport ETA/route | ✅ | ✅ (DATA.GOV.HK) | 乗換案内 ✅ | ➖ (Google Maps owns it) |
| Bill payment reminders | ✅ | ✅ | コンビニ払い ✅ | subscriptions ✅ |
| Weather / disaster alerts | 地震/颱風/AQI ✅ | 颱風/暴雨/AQHI ✅ | 地震/台風/花粉 ✅ | severe weather ➖ |
| Garbage/recycling schedule | 垃圾車 ✅ | ➖ (shelved scheme) | ゴミ分別 ✅ | — |
| Convenience-store services | ibon ✅ | ➖ | コンビニ交付 ✅ | — |
| Almanac / auspicious days | 黃道吉日 ✅ | 通勝 ✅ | 六曜 ✅ | — |
| Mortgage / property + stamp duty | ✅ | 印花稅 ✅ | 住宅ローン ✅ | ✅ (PMI/HOA) |
| Stock/investment calc | 0050/0056 ✅ | HKEX ✅ | 新NISA ✅ | 401k/ISA ✅ |
| Currency converter | ✅ | ✅ (intl city) | ✅ | ✅ |
| Gov digital-ID companion | — | iAM Smart ✅ | マイナンバーカード ✅ | ➖ |
| E-signature | ➖ | ➖ | 電子印鑑 ➖ | ✅ (legal anchor) |
| Unit + cooking conversion | ➖ | ➖ | ➖ (legacy 坪/合) | ✅ (imperial) |
| PDF toolkit | ✅ | ✅ | ✅ (縦書き) | ✅ (anchor) |
| File conversion | ✅ | ✅ | ✅ | ✅ (HEIC anchor) |

**Reading the matrix:**
- **CJK cluster (TW/HK/JP)** shares a deep spine: lunar calendar + almanac, ID checksums, CJK text conversion, NFC transit cards, convenience-store services, bill-payment culture, weather/disaster alerts. A feature built for one is ~60–70% reusable across the other two (different data, same shape).
- **English region** diverges hardest: no transit-card/almanac/garbage/checksum culture; instead PDF+e-sign, imperial/cooking conversion, time-zone planning, and a jurisdiction switch dominate.
- **Universally hot everywhere:** take-home pay, public holidays, currency, mortgage/investment, PDF, file conversion, bill reminders.

---

## 4. Strategic implications

1. **Architecture must be locale-pluggable.** The same engine (calendar, payroll, ID-validation, address, text) takes a per-market rule/data pack. Don't fork the app per country — fork the config. (Drives the tech stack plan.)
2. **Privacy/offline-first is a universal differentiator** in all four markets — sensitive inputs (salary, tax, national ID, financial docs, transit records) should be processed on-device. This is the consistent answer to "why not just use a random website?"
3. **Government open data is the backbone in Asia.** TW (財政部/CWA/data.gov.tw), HK (DATA.GOV.HK/HKO), JP (気象庁/国税庁/デジタル庁/日本郵便) all expose free, reliable APIs. The English region leans more on FX + tax-bracket + holiday feeds.
4. **Sequencing:** the shared core (§1) is the cheapest, most reusable build and serves every market on day one. Each market then gets its localized "core 70%" pack. Start with the two highest-conviction markets (Taiwan — already specced; plus one of HK/Japan given CJK reuse) before the English region, which is more crowded/competitive.
5. **CJK reuse compounds.** Building Taiwan first de-risks HK and Japan because the calendar/text/ID/transit/convenience-store shapes carry over. The English region is a separate, larger investment with different competition (ad-heavy free-tool sites) and a different hero set (PDF/e-sign, money math, conversions).

---

## 5. Suggested global build order

1. **Shared core** (§1) — file/PDF/image/text/calc/converter/generator/scanner/reminder. One codebase, all markets.
2. **Taiwan localization pack** (done — `FEATURE-CATALOG-TAIWAN.md`).
3. **Japan + Hong Kong packs** — exploit CJK + calendar + ID + transit reuse from Taiwan.
4. **English-region pack** — jurisdiction switch (US→UK→CA→AU), PDF/e-sign + money math + conversions as hero features.
5. **Differentiators across all** — command palette, reminder automation, AI assistant (OCR receipts/bills, summarize/translate), optional encrypted sync.

**Two feasibility constraints (verified — see `TECH-STACK-PLAN.md` Appendix) that shape sequencing:**
- **Receipt/document OCR** (a hero flow in every market) should use **native on-device OCR** (Apple Vision / Google ML Kit) on mobile, with tesseract.js as the web/offline fallback — not tesseract.js for camera captures.
- **Transit-card balance via NFC** (悠遊卡 / 八達通 / Suica) is a **capability-detected bonus, not a launch dependency**: Octopus/Suica are FeliCa, which Web NFC can't read and most non-Japan Android phones lack the hardware for. Always ship manual entry + official-app deep-link. (Taiwan's EasyCard is MIFARE-based — easier, but still treat balance-read as bonus.)

See `TECH-STACK-PLAN.md` for how to implement this architecture.

---

## 5b. New markets (2026-07) — KR / CA / AU / DE / FR

Phase 3 expansion shipped **10 offline tools each** for `ko`, `en-ca`, `en-au`, `de`, and `fr`. See:
`FEATURE-CATALOG-KOREA.md` · `FEATURE-CATALOG-CANADA.md` · `FEATURE-CATALOG-AUSTRALIA.md` · `FEATURE-CATALOG-GERMANY.md` · `FEATURE-CATALOG-FRANCE.md`.

Live gov feeds and NFC remain out of scope; engines live in `@zii/payroll` + `@zii/id` with dated configs.

## 6. Source files

All facts and citations live in the per-market files; each has its own linked **Sources** section:
`FEATURE-CATALOG.md` · `FEATURE-CATALOG-TAIWAN.md` · `FEATURE-CATALOG-HONGKONG.md` · `FEATURE-CATALOG-JAPAN.md` · `FEATURE-CATALOG-ENGLISH.md`


## Additional market packs (2026-07)

| Market | Doc |
|--------|-----|
| Spain (`es`) | `FEATURE-CATALOG-SPAIN.md` |
| Italy (`it`) | `FEATURE-CATALOG-ITALY.md` |
| Netherlands (`nl`) | `FEATURE-CATALOG-NETHERLANDS.md` |
| Singapore (`en-sg`) | `FEATURE-CATALOG-SINGAPORE.md` |
| India (`en-in`) | `FEATURE-CATALOG-INDIA.md` |
