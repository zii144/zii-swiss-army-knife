# Zii 萬用工具 — 香港市場功能藍圖 (Hong Kong Feature Catalog)

*An in-app toolkit aimed at solving roughly 70% of a Hong Konger's everyday digital chores*

Last updated: 28 June 2026

---

## 1. Vision (定位)

A Hong Konger's daily admin looks nothing like a Western user's, so a winning "Swiss army knife" app here cannot just be a file converter + calculator. The daily essentials are intensely local: topping up and checking the **八達通 (Octopus)** card, watching the **MTR / 巴士 / 小巴 (bus / minibus)** ETA, paying **中電/港燈 (electricity)、煤氣 (Towngas)、水費 (water)、差餉 (rates)**, handling **薪俸稅 (salaries tax)** and **強積金 (MPF)**, checking whether the **天文台 (Observatory)** has hoisted the **八號風球 (Typhoon Signal No. 8)** or a **黑色暴雨警告 (Black Rainstorm)**, validating an **HKID** or **BR number**, and converting **繁簡 / 粵拼 (Traditional-Simplified / Jyutping)**.

This document ranks those needs by **frequency × penetration**, flags the **daily 70% (Tier 1)**, then expands the full catalogue. Design principles carry over from the master catalogue (privacy-first, batch processing, offline-capable, no ads, no watermarks), but the data sources are almost entirely Hong Kong government open data and local services.

> Read alongside: `FEATURE-CATALOG.md` (the general master toolkit) and `FEATURE-CATALOG-TAIWAN.md` (sister localisation). This is the Hong Kong localisation branch.

---

## 2. Localization facts (在地化基本事實 — affect multiple features)

These facts cut across many tools and should live in one auto-updatable config file shared by every feature.

- **No postal codes (沒有郵政編碼)**: Hong Kong has never adopted a postcode system (small city, dense postal network). When a foreign web form demands one, Hongkong Post advises leaving it blank or entering `000`, `0000`, `000000`, or `HKG` — a constant friction point for HK users on overseas sites.
- **Three-region address hierarchy**: Addresses are written unit → floor → block/building → street number + street → district → region, where region is one of **香港 (Hong Kong Island) / 九龍 (Kowloon) / 新界 (New Territories)** (plus outlying islands under NT). 18 districts (e.g. 中西區、灣仔、東區、油尖旺、觀塘、沙田…). Both English and Chinese addresses are valid for local mail; Chinese is written large→small (opposite order to English).
- **HKID number (香港身份證號碼)**: format `XX999999(C)` or `X999999(C)` — one or two letters, six digits, and a check digit in brackets (0–9 or `A`). The check digit is computed with an ISBN-10-style weighted sum mod 11, **fully verifiable offline** (see §10).
- **Business Registration Number (商業登記號碼, BRN)**: 8 digits issued by the IRD, printed on the BR Certificate; it is the first 8 digits of the longer Unique Business Identifier (UBI). Distinct from the Companies Registry CRN.
- **Tax year is 1 Apr – 31 Mar.** Salaries tax returns (BIR60) are issued in May, with a standard deadline around 2 June; e-filing via **eTAX** grants an automatic 1-month extension. **Provisional tax (暫繳稅)** is charged for the coming year on top of the prior year's bill — a recurring source of confusion.
- **Salaries tax (薪俸稅)** is progressive (2% / 6% / 10% / 14% / 17%) capped by a **two-tier standard rate** (15% on first HK$5M of net income, 16% above). 2025/26 Basic Allowance is **HK$132,000**. **No capital gains tax, no GST/VAT, no dividend or interest tax.**
- **MPF (強積金)**: employer and employee each contribute **5%** of relevant income, between a **min HK$7,100** and **max HK$30,000** monthly relevant income (so max mandatory contribution is **HK$1,500/month** each side). Employee mandatory contributions are tax-deductible up to **HK$18,000/yr**; TVC + deferred annuity deduction capped at **HK$60,000/yr** combined. **MPF offsetting of severance/long-service payments was abolished from 1 May 2025** (for service on/after that date).
- **Statutory holidays ≠ General holidays.** In 2026 there are **15 statutory holidays** (labour, Cap. 57) but **17 general ("bank") holidays**. The statutory count rises by one every two years toward 17 by 2030 (Easter Monday became statutory in 2026). Banks/offices follow the 17; many manual workers historically only got the statutory list — a real payroll edge case.
- **Lunar-driven holidays**: Lunar New Year (農曆新年), Ching Ming (清明), Buddha's Birthday (佛誕), Tuen Ng/Dragon Boat (端午), Mid-Autumn (中秋), Chung Yeung (重陽) all shift each year. 2026 is the **Year of the Horse (馬年)**; LNY Day 1 is **17 Feb 2026**.
- **Currency**: HKD is pegged to the USD (~7.75–7.85 band). Hong Kong is intensely international, so multi-currency (USD / RMB / JPY) conversion and 找換店 (money-changer) rate comparison are everyday needs, not just for travel.

---

## 3. Core 70%: features people touch daily/weekly (Tier 1)

The priority build set — the bulk of daily usage. Frequency and the local data/rule source noted.

| # | Feature | Typical frequency | Local data / rule source |
|---|---------|-------------------|--------------------------|
| 1 | **八達通 (Octopus) balance + transaction history (NFC tap) + top-up reminders + auto-reload tracking** *(NFC read is a capability-detected bonus — Octopus is FeliCa, needs a native plugin and not all phones support it; manual entry / Octopus-app deep-link is the fallback — see §4)* | Daily | Octopus App / NFC; Octopus Wallet, FPS top-up |
| 2 | **Transport ETA hub**: MTR / 港鐵, KMB 九巴 / Citybus / 城巴, 小巴 (minibus, GMB), 渡輪 (ferry), 輕鐵 (Light Rail), fares & journey time | Commute, daily | DATA.GOV.HK real-time ETA (KMB/LWB, MTR Bus, GMB), MTR Mobile |
| 3 | **Bill reminder centre**: 中電/港燈 (electricity), 煤氣 (Towngas), 水費 (water), 差餉/地租 (rates & gov rent), 寬頻/電話 (broadband/telecom), credit card | Monthly / quarterly | CLP, HK Electric, Towngas, WSD, RVD billing cycles |
| 4 | **Weather & warnings**: 天文台 forecast, 颱風信號 (T1/T3/T8/T9/T10), 暴雨警告 (Amber/Red/Black), 雷暴/酷熱/寒冷, AQHI air quality | Daily, urgent in season | HKO open data, EPD AQHI |
| 5 | **Public holiday + lunar calendar + 黃曆/通勝**: general vs statutory holidays, 農曆 conversion, 馬年/生肖, leave-planning ("which days to take off") | Form-filling, leave planning | GovHK holiday gazette, Chinese almanac |
| 6 | **Take-home pay / MPF calculator**: net salary after MPF, overtime, year-end bonus (雙糧/花紅), salaries tax estimate, severance/LSP | Monthly / yearly | MPFA rules, IRD salaries tax bands, Labour Dept calculator |
| 7 | **Currency converter**: HKD ↔ USD / RMB / JPY etc.; 找換店 vs bank rate comparison | Weekly, daily near travel | HKAB rates, money-changer aggregators (e.g. CashChanger) |
| 8 | **HKID / BR number / phone validation + generator (test data)** | Forms, dev, checking | IRD/ImmD check-digit formula (offline) |
| 9 | **HK address tools**: district lookup, no-postcode handling, Chinese ↔ English address, address normalisation | Mailing, online forms | Hongkong Post ALS, address format rules |
| 10 | **Chinese text tools**: 繁↔簡 conversion (HK 用語 localisation), 全形/半形, 粵拼 (Jyutping) annotation, Chinese character count | Daily office work | OpenCC, LSHK Jyutping, local lexicons |
| 11 | **iAM Smart (智方便) companion**: which gov e-services are available, e-ME stored data, renewal/expiry alerts deep-links | Periodic, high value | Digital Policy Office iAM Smart |
| 12 | **FPS / e-payment helper**: 轉數快 (FPS) QR/identifier handling, PayMe/AlipayHK/Octopus payee notes, bill-pay routing | Frequent | HKMA FPS, wallet providers |
| 13 | **Property & investment calculators**: 按揭 (mortgage), 印花稅 (stamp duty, residential + stock), HKEX trade cost | Periodic, high stakes | GovHK stamp duty scale, HKEX fees |
| 14 | **Convenience-store / printing / document helper**: 影印/打印, ID-photo sizes, scan-to-PDF *(use native on-device OCR — Apple Vision / Google ML Kit — for Traditional Chinese; tesseract.js is a web/offline fallback only)*, store-pickup parcel tracking | Weekly | 7-Eleven / Circle K, local print services |

> Nail these 14 and you cover the overwhelming majority of a typical Hong Kong office worker's / household's daily digital chores.

---

## 4. 八達通 & everyday payments (Octopus & payments)

The highest-frequency, stickiest feature group in Hong Kong life.

- **八達通 balance + transaction history via NFC**: tap card to phone to read remaining value and recent transactions; categorise into a lightweight expense log.
- **Top-up + Auto-Add-Value (自動增值) tracking**: monitor balance, alert when low, log Octopus Wallet / FPS top-ups; track Auto-Add-Value triggers (typically +HK$250/HK$500) against the linked card.
- **Octopus negative balance / deposit logic** explainer (card can go to ~HK$ -35 before re-tap; HK$50 deposit on standard cards) and **refund / surrender** guidance.
- **FPS (轉數快) helper**: store and validate FPS identifiers (mobile / email / FPS ID), generate FPS QR to collect money, split-the-bill (AA制) with FPS notes — never moving money in-app (compliance).
- **Wallet payee notes**: PayMe (HSBC), AlipayHK, WeChat Pay HK, BoC Pay, Tap & Go — store frequent payees, fee notes, and what each merchant accepts.
- **Spending log & monthly analysis** from imported Octopus/card records, categorised (transport / dining / convenience).
- **Receipt / 報帳 (expense claim) generator** for office workers (travel + claim sheets, common at HK corporates).

> **NFC feasibility caveat (八達通 reads).** Octopus is **FeliCa (NFC-F)**, which **Web NFC cannot read** (it is NDEF-only) — so balance/history reading needs a **native plugin** (capawesome, paid; or the free Exxili Capacitor NFC plugin). **iOS:** works on iPhone 7+ via CoreNFC but requires the `com.apple.developer.nfc.readersession.felica.systemcodes` entitlement + declared system codes, and only via a modal prompt (no background reads); purse balance is readable (service `0x0117`, block `0x8000`). **Android:** only phones with a FeliCa secure element can read it (mostly Japan-market phones, Pixel 6+, some flagships) — **most non-HK / global Android phones cannot**. Therefore treat Octopus balance reading as a **capability-detected bonus feature**, always with **manual entry / a deep-link to the official Octopus app** as fallback.

---

## 5. Bills & payments (繳費與帳務)

The app cannot move money (compliance) but can **organise, remind, estimate, and route**.

- **Bill calendar + due-date reminders**: 中電 (CLP) / 港燈 (HK Electric) electricity, 煤氣 (Towngas), 水費 (WSD water), 差餉 + 地租 (rates & government rent), broadband/telecom, mobile, credit cards, management fees (管理費), school fees.
- **Billing-cycle awareness built in**:
  - **Electricity**: CLP (serves Kowloon, NT, outlying islands, ~80% of population) bills roughly every **~60 days**; HK Electric serves HK Island + Lamma. Note: **CLP is discontinuing credit-card auto-pay from 1 July 2026** — alternatives are bank auto-transfer, FPS, AlipayHK, APA, cash, cheque.
  - **Water (水費)**: WSD bills **every 4 months** (a 4-month period = 121.64 days). 4-tier tariff: **first 12 m³ free**, then $4.16, $6.45, $9.05 per m³; plus sewage charge ($2.92/m³, first 12 m³ exempt). A built-in usage estimator is useful.
  - **差餉 (rates) + 地租 (government rent)**: payable **quarterly in advance**, last-day-for-payment usually end of **Jan / Apr / Jul / Oct**. Rates = a percentage of **rateable value (應課差餉租值)**; domestic ≤ HK$550,000 RV at 5%, progressive above. Government rent = **3% of rateable value**, billed together. Quarterly rates concessions are common in budgets — flag them.
- **Late-fee / surcharge prompts** per utility rules; **account-number storage** (電費戶口/水錶號) for fast reference.
- **Payment-channel routing**: convenience store (7-Eleven, Circle K, U select) bill payment, PPS (繳費靈), bank/FPS, AlipayHK, e-Cheque; step-by-step guidance per channel.
- **Utility credit-card rebate comparison** (which card is best for paying utilities) as pure informational content.
- **Auto-pay set-up reminders & checklist** (especially relevant given the CLP credit-card auto-pay sunset).

---

## 6. Daily chores (生活雜事)

- **Weather & civil-protection**: 天文台 (HKO) forecast by district, **typhoon signals 颱風信號** (No. 1 standby → No. 3 strong wind → No. 8 NE/NW/SE/SW gale → No. 9 increasing gale → No. 10 hurricane), **rainstorm warnings 暴雨警告** (Amber / Red / Black), thunderstorm, very-hot / cold weather, landslip, and **AQHI air quality** (1–10+; reduce activity at 7, stop at 10). Push alerts and a clear "**should I go to work / is school suspended?**" status card (T8+ or Black Rainstorm = work/school typically suspended).
- **"Extreme Conditions" status** (post-typhoon) explainer for the 2-hour return-to-work rule.
- **Convenience-store / printing helper**: nearest 7-Eleven / Circle K services, **影印/打印 (photocopy/print)** specs and price guidance (A4 B&W, A3 colour, 4×6 photo), **證件相 (ID-photo)** size table (HKID, passport, visa), scan-to-PDF, fax-replacement, store-to-store parcel pickup / tracking codes.
- **Document scanning & filing**: photograph bills/receipts/important docs, auto-deskew, convert to PDF, store encrypted locally. On mobile, use **native on-device OCR (Apple Vision / Google ML Kit)** — both handle Traditional Chinese well; keep **tesseract.js as a web/offline fallback only** (it degrades on photos with complex backgrounds).
- **Recycling / waste**: building/estate refuse and recycling guidance; (note: the planned MSW charging scheme 垃圾收費 was shelved — keep this configurable rather than a hard dependency).

---

## 7. Calendar, holidays & almanac (曆法、節日與擇日)

- **公曆 ⇄ 農曆 (Gregorian ⇄ lunar) conversion**, leap-month handling, lunar-birthday matching.
- **Public holiday calendar** distinguishing **general holidays (17 in 2026)** from **statutory holidays (15 in 2026)** — a genuine HK pain point for employers/HR and shift workers; show the convergence path to 17 by 2030.
- **Substitution rules**: when a holiday falls on a Sunday, the following weekday becomes the substitute general holiday (e.g. 2026 Ching Ming and Chung Yeung fall on Sundays → Monday substitute).
- **Leave-planning ("請假攻略")**: how to chain annual leave around long weekends and the 2026 LNY / Easter / Mid-Autumn clusters.
- **生肖 / 干支** (2026 = 馬年), traditional festivals (新年, 清明, 端午, 盂蘭/中元, 中秋, 重陽, 冬至).
- **黃曆 / 通勝 / 擇日 (Chinese almanac)**: auspicious days (宜忌) for 嫁娶 (wedding), 搬屋 (moving), 開市 (opening business), 祭祀; auspicious hours (吉時) — culturally high-engagement.
- **Countdown / important dates**: birthdays, tax-payment day, rates due dates, 八達通 expiry, anniversaries.

---

## 8. Finance & tax calculators (財稅與投資計算機)

Built to Hong Kong rules; bands/rates updatable yearly.

### 8.1 Salary, MPF & labour
- **Take-home pay**: net salary after **MPF 5%** (capped HK$1,500/mo), with employer-cost reverse calculation.
- **MPF contribution calculator**: mandatory (5% within $7,100–$30,000 relevant income) + voluntary/TVC, with tax-deduction caps (HK$18,000 mandatory; HK$60,000 TVC+annuity).
- **MPF retirement projection** (accumulation estimate with assumed returns).
- **Overtime / bonus**: 雙糧 (13th-month), 花紅 (discretionary bonus), end-of-year payment.
- **Severance (遣散費) / Long Service Payment (長期服務金)** per Cap. 57: monthly-rated = ⅔ × last month's wages × years (wage capped at HK$22,500/mo), **overall cap HK$390,000**; severance needs ≥24 months continuous, LSP needs ≥5 years; you get one, not both. Reflect the **post-1 May 2025 MPF-offset abolition** split.
- **Statutory holiday pay / annual leave / 713 average-wage** helpers.
- **Hourly ⇄ monthly ⇄ annual** conversion; **Statutory Minimum Wage** reference.

### 8.2 Tax
- **Salaries tax estimator**: progressive 2–17% vs two-tier standard rate (15% / 16%), allowances (Basic HK$132,000, married, child, dependent parent, etc.), deductions (MPF, home-loan interest, approved charitable donations, elderly residential care, qualifying premiums), and one-off budget rebates.
- **Provisional tax (暫繳稅) explainer + estimator** — the "double bill" first-year shock.
- **Profits tax / property tax** quick reference; **personal assessment (個人入息課稅)** election helper.

### 8.3 Investment & property
- **Mortgage (按揭) calculator**: P+I amortisation, stress-test (interest-rate buffer), LTV scenarios (first-time buyer up to 90% on eligible flats), early-repayment.
- **Stamp duty (印花稅) — residential**: Scale 2 ad valorem **1.5% / 2.25% / 3% / 3.75% / 4.25%** by price band, the **HK$100 flat duty for properties ≤ HK$4M**, and the 6.5% flat rate at ≥ HK$100M. Note 2024 abolition of **BSD** and **DSD**, and SSD holding period cut to 2 years. Payment due within 30 days of the agreement.
- **Stamp duty — stocks**: **0.1% per side** (since 17 Nov 2023), charged at settlement (T+2) via HKEX → IRD.
- **HKEX trade-cost calculator**: stamp duty + transaction levy (SFC) + FRC levy + trading fee + brokerage; HSI / ETF reference.
- **Savings goals, simple/compound interest, inflation/purchasing power, insurance/savings-plan IRR.**

---

## 9. Chinese text tools (中文文書工具)

- **繁 ⇄ 簡 conversion** with **Hong Kong-usage localisation** (HK vs Taiwan vs Mainland vocabulary), not just naive character mapping.
- **全形 ⇄ 半形 (full/half-width)** punctuation and alphanumerics — extremely high-frequency in Chinese typesetting.
- **粵拼 (Jyutping) annotation** (LSHK scheme, the HK standard) and Jyutping ⇄ Yale; handle polyphonic characters.
- **Chinese character / word count** (with and without punctuation, lines, paragraphs) for office and content work.
- **Typo / variant-character (異體字) check, rare-character Unicode lookup.**
- **Amount in Chinese capitals (大寫金額)** (壹貳叁…) for cheques and formal documents.
- **HK ↔ English bilingual email / business-letter templates**; general text utilities (case, dedupe, sort, diff, Markdown).

---

## 10. ID, forms & validation (身分、表單與資料驗證)

- **HKID validation / test-data generator** — offline. Algorithm: map letters A→10 … Z→35; for single-letter IDs use 36 (space) in the leading position; weighted sum (positions weighted 9,8,7,6,5,4,3,2); take mod 11; check digit = 0 if remainder 0, `A` if remainder 1, else `11 − remainder`.
- **Business Registration Number (BRN)** format/validity (8 digits) and BRN-vs-CRN-vs-UBI explainer.
- **Phone formatting**: HK numbers are 8 digits (mobiles start 5/6/9, landlines 2/3), country code +852; no area codes.
- **Vehicle plate format** check; **bank account / FPS identifier** formatting; **credit-card Luhn** check; **IBAN/SWIFT** for international transfers (common in HK).
- **HK address normalisation + Chinese ↔ English address translation**, district/region tagging, no-postcode handling.
- **vCard / contacts ⇄ CSV**, business-card (名片) info tidy-up.

---

## 11. Transport & vehicle (交通與監理)

- **Multi-mode ETA & fares**: MTR / 港鐵 (incl. Light Rail 輕鐵), KMB 九巴 / Long Win, Citybus 城巴, GMB **小巴 (green minibus)**, 渡輪 (Star Ferry, outlying-island ferries), peak tram, MTR feeder bus — pulling **real-time ETA from DATA.GOV.HK** open APIs.
- **Octopus fare-saving features**: MTR fare-saver, monthly passes, inter-modal transport subsidy (公共交通費用補貼) tracking.
- **HKeToll (易通行)** companion: free-flow tolling across government tunnels, **time-varying tolls (繁忙時段)** for the three harbour crossings (633 → time-varying scheme), toll-tag/account reminders.
- **Driving licence (車牌) / vehicle licence (行車證) renewal reminders**, International Driving Permit (via iAM Smart), vehicle examination dates.
- **Parking** rates/availability lookup, fuel-price reference.
- **Traffic / journey-time indicators** and incident alerts (HKeMobility).

---

## 12. Government & e-services (政府與電子服務)

- **iAM Smart (智方便) companion**: explain registration (all HKID holders 11+), e-ME stored personal data and auto-form-fill, **iAM Smart+** legally-binding digital signature (Cap. 553), and notifications/expiry alerts.
- **Directory of services that accept iAM Smart login**: **eTAX, eMPF, eHealth (醫健通), SmartPLAY, HKeToll, vehicle licence renewal, IDP application**, and a growing list of bank/insurance/commercial integrations.
- **Government appointment / e-service deep links** (1823 enquiries, GovHK forms).
- **eMPF Platform** awareness: the centralised MPF platform onboarding by scheme.
- **Document checklist generator** for common gov procedures (renew HKID, register marriage, apply for CofE, etc.).

---

## 13. General tools (localized) (通用工具，在地化包裝)

Carry over the general `FEATURE-CATALOG.md` utilities, presented for HK contexts:

- **File conversion**: PDF ⇄ Word/Excel, HEIC→JPG, image compression, media/archive conversion.
- **PDF tools**: merge / split / compress / OCR (incl. Traditional Chinese) / watermark / sign. *(OCR: prefer native on-device engines — Apple Vision / Google ML Kit — on mobile; tesseract.js is a web/offline fallback only.)*
- **Image tools**: compress, resize (incl. HK **證件相 (ID-photo)** and social sizes), background removal, QR generation.
- **Calculators**: percentage, **AA-split (分帳)** for yum-cha / dinner, discount, unit conversion.
- **Generators**: QR (incl. **FPS payment**, Wi-Fi, vCard), password, UUID.
- **Encoding / hashing**: Base64, URL encode, SHA/MD5.
- **Developer tools** (JSON / regex / diff) — useful to HK freelancers and admin staff too.

---

## 14. Cross-cutting & data sources (跨功能與資料來源)

- **Government open data first**: **DATA.GOV.HK** (transport real-time ETA, address lookup), **HKO** weather open data, **EPD** AQHI, **HKMA/HKAB** rates, **IRD/RVD/WSD** billing rules. Reliable and free.
- **Local offline-first**: HKID/BR validation, lunar conversion, 繁簡/全形 conversion, character count, Jyutping, and all calculators run fully offline.
- **Shared config file**: MPF limits, salaries-tax bands/allowances, holiday gazette (general + statutory), stamp-duty scales, water/rates tariffs, currency rates — auto-updated.
- **Privacy**: Octopus records, bills, salary, HKID, BR numbers and other sensitive data are encrypted on-device and never uploaded — a deliberate differentiator vs cloud-first competitors.
- **Reminder engine**: bills, licence/HKID expiry, rates due dates, tax season, typhoon/rainstorm alerts — one unified push centre.
- **PWA / App + desktop widgets**, Traditional-Chinese (HK) UI with Cantonese-friendly wording, English toggle, dark mode, accessibility.

---

## 15. Build phases (建議開發順序)

**Phase 1 — Stickiness core (front of Tier 1):**
Octopus balance/top-up + reminders, transport ETA hub, bill reminder centre, weather & typhoon/rainstorm/AQHI alerts, public-holiday + lunar calendar, take-home-pay/MPF calculator, currency converter, HKID/BR validation, address tools, 繁簡/全形/Jyutping/character-count text tools.

**Phase 2 — Full local toolkit:**
iAM Smart companion + gov e-service directory, FPS/e-payment helper, full finance/tax suite (mortgage, stamp duty, salaries tax, severance/LSP), HKeToll & vehicle/licence reminders, convenience-store/print/ID-photo helper, 黃曆/擇日, Octopus spending log & expense claims.

**Phase 3 — Differentiation:**
General file/PDF/image tools integration, global command-bar search, reminder-engine automation, AI assistant (Chinese summarise/rewrite/translate, bill OCR, receipt recognition), cross-tool linking, optional encrypted cloud sync.

---

## 16. Key takeaways (結論)

Winning the Hong Kong market is not about "more tools" — it's about being **local enough**. Three keys:

1. **Capture the unique high-frequency pain points** — 八達通, transport ETA, utility/差餉 bills, typhoon/rainstorm signals, salaries-tax/MPF, HKID/BR validation, 繁簡/粵拼. Western tools have none of these; Hong Kongers touch them daily.
2. **Lean on government open data** — DATA.GOV.HK transport ETA, HKO weather/warnings, EPD AQHI, IRD/RVD/WSD rules, HKMA/HKAB rates: official, reliable and free.
3. **Privacy and offline** — Octopus records, bills, salary and HKID are highly sensitive; on-device processing is the basis of trust and the differentiator vs cloud-first rivals.

Get the 14 items in §3 smooth and frictionless and you cover roughly 70% of a typical Hong Kong user's daily digital chores.

---

## Sources (資料來源)

- [香港八達通 — 查閱餘額及交易紀錄](https://www.octopus.com.hk/tc/consumer/customer-service/check-balance/index.html)、[八達通 App](https://www.octopus.com.hk/app)、[Octopus 八達通 (App Store)](https://apps.apple.com/hk/app/octopus-%E5%85%AB%E9%81%94%E9%80%9A/id1114430602)
- [iAM Smart 智方便 (Digital Policy Office)](https://www.digitalpolicy.gov.hk/en/our_work/data_governance/common_data_platforms/iam_smart/)、[iAM Smart Functions](https://iamsmart.cyberport.hk/iam-smart/)
- [DATA.GOV.HK — KMB/LWB real-time ETA](https://data.gov.hk/tc-data/dataset/hk-td-tis_21-etakmb)、[MTR Bus real-time ETA](https://data.gov.hk/tc-data/dataset/mtr-mtr_bus-mtr-bus-eta-data)、[hkbus.app](https://hkbus.app/en)、[APP 1933 (KMB/LWB)](https://play.google.com/store/apps/details?id=com.kmb.app1933)
- [CLP 中電 — Billing & payment](https://www.clp.com.hk/en/residential/bills-payment-tariffs-residential)、[HK Electric 港燈 賬單繳費](https://www.hkelectric.com/zh/customer-services/billing-payment-and-tariffs)、[WSD 水費 Water & Sewage Tariff](https://www.wsd.gov.hk/en/customer-services/manage-account-and-water-bills/water-sewage-tariff/index.html)
- [RVD 差餉物業估價署 — Rates](https://www.rvd.gov.hk/en/our_services/rates.html)、[GovHK — Government Rent 地租](https://www.gov.hk/en/residents/housing/private/rate/governmentrent.htm)、[Rates in Hong Kong (Wikipedia)](https://en.wikipedia.org/wiki/Rates_in_Hong_Kong)
- [GovHK — Salaries Tax rates 薪俸稅](https://www.gov.hk/en/residents/taxes/taxfiling/taxrates/salariesrates.htm)、[PwC — HK individual taxes on personal income](https://taxsummaries.pwc.com/hong-kong-sar/individual/taxes-on-personal-income)、[2025/26 HK Tax Facts (PwC)](https://www.pwchk.com/en/tax/hong-kong-budget-2025-2026/tax-facts-and-figures-en.pdf)
- [MPFA — Mandatory contributions (employees)](https://www.mpfa.org.hk/en/mpf-system/mandatory-contributions/employees)、[GovHK — MPF deduction](https://www.gov.hk/en/residents/taxes/salaries/allowances/deductions/mpf.htm)、[eMPF Platform / IRD MPF FAQ](https://www.ird.gov.hk/eng/faq/mpf.htm)
- [HKID check-digit algorithm (sam leung, DEV)](https://dev.to/samleung/understanding-the-hong-kong-identity-card-hkid-symbols-prefixes-and-check-digit-calculation-21la)、[HKID verification (GitHub, KnugiHK)](https://github.com/KnugiHK/Hong-Kong-ID-Card-Verification-Algorithm-MultiLang)
- [Business Registration Number guide (Statrys)](https://statrys.com/hk/guides/company-formation/what-is-a-business-registration-number)、[BRN vs CRN (Sleek)](https://sleek.com/hk/resources/brn-vs-crn/)、[1823 — Unique Business Identifier (UBI)](https://www.1823.gov.hk/en/faq/what-is-the-unique-business-identifier-ubi-of-my-company-entity)
- [Postal codes in Hong Kong (Wikipedia)](https://en.wikipedia.org/wiki/Postal_codes_in_Hong_Kong)、[DATA.GOV.HK — Address Lookup Service (ALS)](https://data.gov.hk/en-data/dataset/hk-dpo-als_01-als)、[Hong Kong address format (Smarty)](https://www.smarty.com/global-address-formatting/hong-kong-address-format-examples)
- [HKO 香港天文台 — Weather warnings & signals](https://www.hko.gov.hk/tc/wxinfo/dailywx/wxwarntoday.htm)、[HK tropical cyclone warning signals (Wikipedia)](https://en.wikipedia.org/wiki/Hong_Kong_tropical_cyclone_warning_signals)、[HKO — Rainstorm Warning System](https://www.hko.gov.hk/en/wservice/warning/rainstor.htm)
- [GovHK — General holidays 2026](https://www.gov.hk/en/about/abouthk/holiday/2026.htm)、[Labour Department — Statutory Holidays 2026](https://www.labour.gov.hk/eng/news/latest_holidays2026.htm)、[HK statutory vs general holidays 2026 (China Briefing)](https://www.china-briefing.com/news/hong-kong-statutory-and-general-holidays-2026/)
- [Jyutping 粵拼 (LSHK)](https://jyutping.org/en/)、[Cantonese to Jyutping converter](https://www.cantonesetools.org/en/cantonese-to-jyutping)、[Cantonese Jyutping converter (traditional/simplified)](https://cantonesepinyin.com/en)
- [Labour Dept — Statutory Employment Entitlements Reference Calculator](https://www.lr.labour.gov.hk/web/en/calculator/index.html)、[Severance & Long Service Payment (1823)](https://www.1823.gov.hk/en/faq/what-employees-are-entitled-to-long-service-payment-or-severance-payment)、[MPF offsetting EasyCal](https://www.offsettingsubsidy.gov.hk/en/calculator.html)
- [GovHK — Stamp Duty Rates 印花稅](https://www.gov.hk/en/residents/taxes/stamp/stamp_duty_rates.htm)、[HK stamp duty calculator 2026 (Tools.RealEstate)](https://www.tools.realestate/s/hongkong/general/hong-kong-stamp-duty-calculator)、[HK Property Stamp Duty Guide 2026/27 (Habitat)](https://www.habitat-property.com/news/buying-property-in-hong-kong/an-expert-understanding-of-hong-kong-stamp-duties)
- [HKEX — Securities trading transaction fees](https://www.hkex.com.hk/Services/Rules-and-Forms-and-Fees/Fees/Securities-(Hong-Kong)/Trading/Transaction?sc_lang=en)、[HK share stamp duty guide (TradeSmart)](https://www.lowrisktradesmart.org/en/blog/hong-kong-stamp-duty-stocks-guide)
- [Faster Payment System 轉數快 (Wikipedia)](https://en.wikipedia.org/wiki/Faster_Payment_System_(Hong_Kong))、[FPS guide (Wise)](https://wise.com/hk/blog/fps-hong-kong)、[HK payment methods 2026 (Statrys)](https://statrys.com/blog/hk-payment-methods)
- [HKeToll 易通行 (Wikipedia)](https://en.wikipedia.org/wiki/HKeToll)、[Transport Department — Toll rates](https://www.td.gov.hk/en/transport_in_hong_kong/tunnels_and_bridges_n/toll_matters/index.html)、[HKeMobility — Real-time toll info](https://www.hkemobility.gov.hk/en/toll-rate/)
- [Hong Kong Jockey Club (Wikipedia)](https://en.wikipedia.org/wiki/Hong_Kong_Jockey_Club)、[Mark Six 六合彩 (Wikipedia)](https://en.wikipedia.org/wiki/Mark_Six)、[Mark Six (HKJC)](https://bet.hkjc.com/en/marksix/home)
- [HKAB — Exchange rates](https://www.hkab.org.hk/en/rates/exchange-rates)、[CashChanger Hong Kong (money-changer rates)](https://cashchanger.co/hong-kong)、[Best currency exchange in HK (MoneySmart)](https://blog.moneysmart.hk/en/budgeting/currency-exchange-place-in-hong-kong-best-places-to-exchange-currency-exchange-rate-comparison/)
