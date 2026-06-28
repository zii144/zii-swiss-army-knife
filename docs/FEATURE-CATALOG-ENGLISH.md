# Zii Swiss Army Knife — English-Region Feature Catalog (US / UK / Canada / Australia)

*A localized inventory of tools aimed at solving ~70% of the everyday digital chores of people in English-speaking countries.*

Last updated: June 28, 2026

---

## 1. Vision

Daily chores in the English-speaking world are very different from East Asian markets. In Taiwan the killer features are uniquely local (e-invoice lottery, garbage-truck times, ROC/lunar calendar, labor-insurance payroll). In the US/UK/Canada/Australia there is **no e-invoice lottery, no garbage-truck app habit, no national-ID checksum culture**. Instead, the high-frequency, sticky pain points cluster around a different set of chores:

- **File & document wrangling** — PDF tools (merge / split / compress / fill / sign), file conversion (PDF↔Word/Excel, HEIC→JPG, video/audio), and OCR/scanning. E-signature is genuinely huge here (legally backed by the ESIGN Act / UETA).
- **Money math** — mortgage, loan, retirement (401k/ISA/super), tip + sales tax, currency conversion, and above all **take-home / paycheck calculators** tied to a complicated tax system (IRS in the US; PAYE/HMRC in the UK).
- **Measurement conversion** — the US still runs on **imperial / US-customary units**, so imperial↔metric and cooking conversions are an everyday need that barely exists in metric countries.
- **Time coordination** — time-zone conversion and meeting scheduling, driven by the world's most distributed/remote workforce.
- **Text & developer utilities** — word counter, case converter, JSON/regex/base64, QR codes, password generators.

This document ranks those needs by **frequency × reach**, marks the **core daily 70% (Tier 1)**, then expands into a full catalog. Design principles follow the master catalog (privacy-first, batch processing, offline-capable, no ads, no watermarks). The differentiator versus the dozens of ad-laden "free online tools" sites is **local-first processing** of sensitive data (salary, tax forms, IDs, financial documents) — a strong and credible selling point in a privacy-conscious, breach-weary market.

> Read alongside: `FEATURE-CATALOG.md` (general/universal master catalog) and `FEATURE-CATALOG-TAIWAN.md` (Taiwan localization branch). This file is the English-region branch.

---

## 2. Localization facts (regional differences — these ripple across many features)

These facts must live in one auto-updatable config shared by many tools. The biggest design consequence: **US vs UK/Commonwealth divergence** in spelling, dates, units, currency, and ID/banking formats.

| Topic | United States | UK | Canada | Australia |
|-------|--------------|-----|--------|-----------|
| **Date format** | MM/DD/YYYY | DD/MM/YYYY | YYYY-MM-DD or DD/MM (mixed) | DD/MM/YYYY |
| **Units** | Imperial / US-customary (miles, lb, °F, US cups/fl oz) | Metric officially, but miles, stone/lb, pints in daily life | Metric (some US-customary leakage) | Metric |
| **Spelling** | -ize, color, center | -ise, colour, centre | mostly UK spelling | UK spelling |
| **Currency** | $ USD | £ GBP | $ CAD | $ AUD |
| **National ID** | SSN (XXX-XX-XXXX, no public checksum) | National Insurance number (2 letters + 6 digits + 1 letter) | SIN (9 digits, **Luhn-checkable**) | Tax File Number (TFN, 9 digits, weighted checksum) |
| **Bank routing** | ABA routing number (9 digits, **MOD-10 weighted checksum**) | Sort code (6 digits) + account no. | Transit + institution number | BSB (6 digits) + account no. |
| **Postal code** | ZIP / ZIP+4 (5 or 9 digits) | Alphanumeric postcode (e.g. SW1A 1AA) | Alphanumeric (e.g. K1A 0B1) | 4-digit postcode |
| **Tax authority / filing** | IRS; file by ~Apr 15; W-2 & 1099 due Jan 31 | HMRC; PAYE auto, Self Assessment by Jan 31 | CRA; file by Apr 30 | ATO; file by Oct 31 |
| **Tax year** | Calendar year (Jan–Dec) | 6 Apr – 5 Apr | Calendar year | 1 Jul – 30 Jun |
| **Retirement** | 401(k), IRA, Roth; SS wage base $184,500 (2026) | Workplace pension, ISA, auto-enrolment | RRSP, TFSA, CPP 5.95% | Superannuation, employer 12% (from Jul 2025) |
| **Sales tax** | Added at register; varies by state/city (0–~10.75%) | VAT 20% included in price | GST/PST/HST | GST 10% included |
| **Tipping** | Strong norm, 15–25% (20% baseline) | Optional, ~10–12.5% | 15–20% | Uncommon |

**US tax season anchors (2026):** IRS began accepting returns Jan 26, 2026; W-2 and 1099-NEC due to recipients Jan 31; filing deadline ~Apr 15. SS tax 6.2% to a $184,500 wage base; Medicare 1.45% + 0.9% additional over $200k/$250k; 2026 standard deduction $16,100 single / $32,200 joint.

**E-signature legality:** Federal ESIGN Act (2000) + UETA (adopted by 47 states + DC) make e-signatures legally equivalent to wet-ink for most documents (exceptions: wills, some family-law and UCC instruments). This makes a built-in e-sign/fill-PDF tool both useful and trustworthy.

---

## 3. Core 70%: features people touch daily/weekly (Tier 1)

Priority build list — the bulk of daily usage. Frequency and the data/rule source are noted.

| # | Feature | Typical frequency | Local data / rule source |
|---|---------|-------------------|--------------------------|
| 1 | **PDF toolkit** — merge / split / compress / rotate / reorder / fill forms / **e-sign** / OCR / convert | Daily (office workers) | ESIGN/UETA validity; runs local |
| 2 | **File / document conversion** — PDF↔Word/Excel/PPT, **HEIC→JPG**, image↔image, video↔MP4, audio↔MP3, zip/rar | Several times/week | iOS default HEIC; cross-platform sharing |
| 3 | **Take-home / paycheck & salary calculator** — gross↔net, by jurisdiction | Each pay period / job change | IRS brackets, SS/Medicare, state tax; HMRC PAYE/NI; CRA; ATO |
| 4 | **Unit & measurement converter** — imperial↔metric, length/weight/volume/temperature, **cooking conversions** | Daily (kitchen, DIY, work) | US-customary vs metric divergence |
| 5 | **Currency converter** — USD/GBP/EUR/CAD/AUD etc., travel + work | Weekly → daily before/during travel | Live FX (ECB, OANDA-style feed) |
| 6 | **Calculators bundle** — percentage, **tip + sales tax + split bill**, discount, date difference / age, BMI | Daily | State sales-tax tables; tipping norms |
| 7 | **Mortgage / loan / amortization calculator** | Major life events + browsing | Bankrate/SmartAsset-style logic; PMI, taxes, insurance |
| 8 | **Time-zone converter + world clock + meeting planner** | Daily (remote/global teams) | IANA tz database; 92% of remote teams span 2+ regions |
| 9 | **Text tools** — word/character counter, case converter, find-replace, diff, remove duplicates, sort, lorem ipsum | Daily (writers/office) | — |
| 10 | **Image tools** — compress, resize, crop, **background remover**, format convert, favicon | Several times/week | Social/marketplace size presets |
| 11 | **QR code generator + reader** — URL, **Wi-Fi**, vCard, text, email | Weekly | 37%+ US adults scan QR; vCard, Wi-Fi top uses |
| 12 | **Password generator + strength checker** | Weekly | NIST guidance; zxcvbn; local processing |
| 13 | **Bill & subscription reminder + budget tracker** (organize/remind, not pay) | Monthly cycle, checked weekly | User-entered; manual or import |
| 14 | **Document scanner / OCR** — phone camera → cropped, deskewed, searchable PDF (receipts, IDs, forms) | Several times/week | On-device OCR |
| 15 | **Developer/data utilities** — JSON format/validate, base64, URL encode, hash, UUID, regex tester | Daily (devs, power users) | Client-side |

> An app that nails these 15 covers the vast majority of the everyday digital chores of a typical English-speaking office worker or household.

---

## 4. PDF & document toolkit (the anchor feature group)

PDF is the single most-searched online-tool category in the English market, and e-signature adoption is now near-universal across industries.

- **Organize:** merge, split, extract pages, reorder, rotate, delete pages, insert pages.
- **Compress / optimize** for email size limits (Gmail 25 MB, etc.).
- **Fill & sign** PDF forms — type into form fields, draw/type/upload a signature, add date and initials. Legally valid under ESIGN/UETA.
- **Request e-signatures** (multi-party signing workflow, audit trail) — the premium/DocuSign-style use case.
- **OCR** scanned PDFs into searchable/selectable text (English + multilingual).
- **Convert:** PDF→Word/Excel/PPT and back; PDF→images; images→PDF.
- **Annotate / redact / watermark / add page numbers / Bates numbering** (legal/admin).
- **Protect:** password-encrypt, unlock (with permission), flatten.
- **Privacy angle:** process locally so tax forms, contracts, medical records, and pay stubs never leave the device — the trust differentiator vs. upload-based competitors.

---

## 5. File & format conversion

- **Documents:** PDF↔Word/Excel/PowerPoint; Markdown↔HTML; CSV↔Excel↔JSON; ePub/mobi.
- **Images:** **HEIC/HEIF→JPG/PNG** (huge — iPhone default format breaks on Windows/Google/old apps), PNG↔JPG↔WebP↔SVG, batch convert, AVIF.
- **Video:** MOV→MP4 (iPhone footage), MKV/AVI/WebM→MP4, GIF↔MP4, extract audio.
- **Audio:** MP4→MP3, WAV/FLAC/M4A↔MP3, ringtone (M4R) maker, bitrate/quality control.
- **Archives:** zip/unzip, extract rar/7z/tar.
- **Batch everything**, drag-and-drop, no per-file upload — local conversion is the privacy + speed win.

---

## 6. Calculators (finance, everyday math, health)

### 6.1 Money / finance
- **Mortgage calculator** — monthly payment with principal, interest, **PMI, property tax, home insurance, HOA**; amortization schedule; extra-payment & refinance scenarios. (US Bankrate/Zillow/SmartAsset patterns; UK/Canada/AU variants.)
- **Loan / auto loan / personal loan** — EMI/monthly payment, total interest, payoff date.
- **Retirement** — 401(k) with employer match, IRA/Roth, **compound interest / savings goal**; UK pension/ISA; Canada RRSP/TFSA; Australia superannuation.
- **Currency converter** with live rates; travel cash-vs-card comparison; multi-currency.
- **Simple/compound interest, APR↔APY, inflation / purchasing power**.
- **Debt payoff** (snowball/avalanche).

### 6.2 Tax & payroll (jurisdiction-aware)
- **Take-home / paycheck calculator** — gross→net by pay frequency, with federal + state tax, SS (6.2% to wage base), Medicare (1.45% + 0.9%), 401(k)/HSA pre-tax (US); PAYE + NI + student loan + salary sacrifice (UK); CPP/EI + federal/provincial (Canada); PAYG + Medicare levy + HECS + super (Australia).
- **Income tax estimator / refund estimator** — brackets, standard vs itemized deduction.
- **Self-employment / 1099 tax** estimator (US); quarterly estimated-tax helper.
- **Sales tax by state** (US) / VAT (UK) / GST (Canada/AU) calculator.
- **Hourly↔salary↔annual** conversion; overtime; minimum-wage reference.

### 6.3 Everyday math
- **Tip calculator** — 15/18/20/25%, pre- vs post-tax, **split the bill** N ways, round up.
- **Percentage** — % of, % change, increase/decrease, reverse percentage.
- **Discount / final price**, markup/margin.
- **Date difference / duration / age**, add/subtract days, business-days, countdown to a date.
- **Fuel cost / mileage (MPG / L/100km)**, fuel reimbursement (IRS mileage rate).

### 6.4 Health
- **BMI / BMR / calorie / body-fat**, ideal weight, pace/running, due-date, ovulation.

---

## 7. Unit & measurement conversion (a distinctly English-region need)

Because the US runs on US-customary units and the UK is a metric/imperial hybrid, conversion is a genuine everyday chore.

- **Length:** miles↔km, feet/inches↔cm/m, yards.
- **Weight/mass:** lb/oz↔kg/g, **stone** (UK body weight).
- **Volume:** US cups / fl oz / pints / gallons ↔ ml / L; note **US vs UK/imperial pint/gallon differ**.
- **Temperature:** °F↔°C (oven temps, weather, cooking).
- **Cooking / recipe converter** — cups↔grams by ingredient, tablespoon/teaspoon, scaling a recipe up/down, US↔metric recipe rewrite, butter sticks.
- **Area, speed (mph↔km/h), pressure (psi↔bar for tires), fuel economy, shoe/clothing size (US/UK/EU), data/storage, time, angles, energy, power**.
- **Currency** lives here too (treated as a unit by users).

---

## 8. Time, scheduling & calendar

Driven by the world's largest distributed/remote workforce.

- **Time-zone converter** — any city/zone to any other; handles DST automatically.
- **World clock** — pin multiple cities; at-a-glance "is it a sane hour there?".
- **Meeting planner** — overlap grid across attendees' working hours (green/yellow/grey), find the fair slot; export to calendar invite.
- **Unix/epoch timestamp** converter, ISO 8601, military (24h)↔12h time.
- **Date format converter** — MM/DD/YYYY ↔ DD/MM/YYYY ↔ YYYY-MM-DD (the classic US/UK confusion).
- **Holiday calendars** — US federal (11 holidays in 2026), UK bank holidays, Canada/AU public holidays; observed-date logic (Sat→Fri, Sun→Mon).
- **PTO / long-weekend planner** — which days off to take to stretch a holiday; vacation-day budget tracker.
- **Countdown / important dates** — tax day, paydays, renewals, birthdays, anniversaries.
- **Working-days / business-days** between dates; sprint/billing-cycle helpers.

---

## 9. Text tools

- **Word / character / sentence / paragraph / line counter**, reading-time, keyword density.
- **Case converter** — UPPER, lower, Title Case, Sentence case, camelCase, snake_case, kebab-case.
- **Find & replace** (incl. regex), **remove duplicate lines, sort, trim whitespace, remove line breaks**.
- **Text diff / compare** (side-by-side, inline).
- **Lorem ipsum** and dummy-data generators.
- **Slug / permalink generator**, **Markdown ↔ HTML**, Markdown preview.
- **Grammar / spelling / readability** check (US vs UK spelling toggle), passive-voice flagging.
- **Encode/decode** as a text sub-tool (Base64, URL, HTML entities, ROT13, Morse).
- **Email / cover-letter / business-letter templates**; signature-block builder.

---

## 10. Image tools

- **Compress** (target file size / quality) — for email, web, marketplace listings.
- **Resize / crop** with **presets** (Instagram, LinkedIn banner, profile photo, eBay, passport photo, US 2×2" visa photo, UK 35×45mm).
- **Background remover** (AI), and replace/blur background.
- **Format convert** (see §5), **bulk rename**, EXIF viewer/stripper (privacy).
- **Favicon generator** (multi-size, all platforms), **app-icon** generator.
- **Watermark, collage, meme text, color picker / palette / contrast checker**.
- **Screenshot beautifier**, simple annotate/blur for redacting sensitive info.

---

## 11. Identity, banking & data validation (English-region formats)

Note: unlike Taiwan's checksum-rich ID culture, US SSN has no public checksum — so the value is in **formatting, masking, and test-data generation**, plus the genuinely checkable banking/card numbers.

- **Credit-card Luhn check** + brand detection (Visa/MC/Amex/Discover); generate test card numbers (dev/QA).
- **ABA routing number** validate (MOD-10 weighted checksum) + bank lookup; **IBAN** validate/format (MOD-97); UK **sort code**; Australian **BSB**; Canadian transit number.
- **SSN / SIN / TFN / NI number** format & mask; SIN and TFN have real checksums (validate); generate fake-but-valid for testing.
- **Phone-number formatting** — US (NANP) (xxx) xxx-xxxx, UK, international E.164; extract/normalize from messy text.
- **ZIP / ZIP+4 / postcode** lookup and **address standardization** (USPS-style: parse, correct, abbreviate, capitalize); UK postcode format check.
- **Email validation**, **VAT/EIN** format, **UUID/GUID** validate.
- **vCard / contacts ↔ CSV**, business-card info parser.

---

## 12. Bills, subscriptions & personal admin

The app should **organize, remind, and calculate** — not move money (compliance).

- **Bill calendar + due-date reminders** — utilities, rent/mortgage, phone, internet, insurance, credit cards, loans; color-coded calendar (Prism-style).
- **Subscription tracker** — list recurring charges, renewal dates, flag rarely-used ones, "cancel before free trial ends" alerts (the Rocket Money pain point).
- **Budget tracker** — categorize spending, monthly summary, simple envelope/zero-based budgeting (manual entry or CSV import; offline).
- **Receipt capture → expense report** — scan, OCR, categorize, export for reimbursement (office workers).
- **Invoice & receipt generator** — professional PDF invoices/receipts, line items, tax, branding (freelancers/small biz).
- **Renewal/expiry reminders** — passport, driver's license, car registration/insurance (tabs/MOT in UK), domain names, warranties.
- **Resume / CV + cover-letter builder** (ATS-friendly templates).

---

## 13. Generators, encoding & developer/data tools

Useful to developers but also to admins, marketers, and freelancers.

- **QR code generator** — URL, **Wi-Fi** (instant guest network), vCard contact, text, email, SMS, phone, geo, calendar event; with logo/color; plus **QR reader/decoder**.
- **Password / passphrase generator** (length, character classes, pronounceable), **strength meter** (zxcvbn, time-to-crack), bulk generation.
- **UUID/GUID, random number/string, lorem ipsum, fake-data** generator.
- **Encoding/hashing:** Base64 (incl. file→Base64, data URI), URL encode/decode, HTML entities; **MD5/SHA-1/SHA-256/SHA-512**, HMAC, bcrypt; JWT decoder.
- **JSON** format/validate/minify/JSON↔CSV↔YAML; **XML/YAML** format; **regex tester** with live highlight + cheatsheet; **cron** expression builder; **diff** (text/JSON); **color** converters (HEX/RGB/HSL); **Unix timestamp**; **URL parser**; **.env / config** helpers.
- **Barcode generator** (UPC/EAN/Code-128).

---

## 14. Daily-life chores & utility helpers

The English-region equivalents of Taiwan's "daily chores," shaped by local habits:

- **Document scanner / OCR** — receipts, IDs, insurance cards, kids' school forms, contracts → clean PDF; the everyday "I need to send this back signed" workflow.
- **Weather** — local forecast, severe-weather/heat/storm alerts (NWS in US, Met Office UK, BOM Australia); UV, air quality (AQI).
- **Clipboard manager**, quick **notes / scratchpad**, **to-do list**, **Pomodoro timer / focus**, habit tracker.
- **Calculator history / running tape**, quick math from natural language.
- **Wi-Fi / network helpers** — speed test link, what's-my-IP, password QR for guests.
- **Shopping helpers** — unit-price comparison ($/oz, $/100g), coupon/discount stacking math, gift-tax/gratuity, currency for online shopping abroad.
- **Travel** — packing checklist, tip-by-country guide, mileage/expense log, luggage-size reference, plug/voltage by country.

---

## 15. Cross-cutting concerns & data sources

- **Jurisdiction switch** (US / UK / Canada / Australia) drives date format, units, spelling, currency, tax logic, ID/banking formats — set once, applied everywhere.
- **Local-first / offline:** unit & currency math (with cached rates), all calculators, text tools, PDF/image processing, encoding/hashing, ID/Luhn validation — all run on-device. This is the **privacy differentiator**: tax forms, pay stubs, contracts, SSNs never uploaded.
- **Live-data feeds (cached, auto-refresh):** FX rates, tax brackets/thresholds (updated each tax year), holiday calendars, sales-tax tables.
- **Reminder engine:** unified notification center for bills, subscriptions/free-trial ends, renewals/expiries, tax deadlines (Jan 31 W-2/1099, Apr 15 filing, etc.), meetings.
- **Presets library:** image sizes, paper sizes (US Letter vs A4 — another US/rest-of-world split), recipe/cooking measures, tipping norms.
- **PWA / app + desktop + browser context-menu** integration; light/dark mode; accessibility; US/UK spelling toggle in UI copy.

---

## 16. Suggested build phases

**Phase 1 — stickiness core (front of Tier 1):**
PDF toolkit (merge/split/compress/fill/sign) + file conversion (incl. HEIC→JPG) + OCR scanner; take-home/paycheck calculator (US first, then UK); unit & cooking converter; currency converter; the calculators bundle (tip+tax+split, percentage, mortgage, date difference); time-zone/meeting planner; text tools; image tools; QR + password generators.

**Phase 2 — full localized toolset:**
Bill/subscription/budget tracker + reminder engine; invoice/receipt + resume builder; full tax/payroll suite per jurisdiction (federal+state/PAYE+NI/CPP/PAYG); retirement & loan calculators; ID/banking/address validation; developer/data utilities (JSON/regex/base64/hash/UUID); holiday + PTO planner; weather/alerts.

**Phase 3 — differentiation:**
Unified command palette / global search; reminder automation; AI assistant (summarize/rewrite/translate, receipt-photo recognition, bill/contract OCR + key-fact extraction, fill-form-from-photo); cross-tool workflows (scan → OCR → sign → email); optional encrypted cloud sync; browser extension and OS share-sheet integration.

---

## 17. Key takeaways

The English-region game is won not by being uniquely local (as in Taiwan) but by being **comprehensive, accurate, and trustworthy** in a space currently dominated by ad-heavy, upload-everything "free tools" sites. Three keys:

1. **Lead with document & money work.** PDF + e-signature + file conversion (especially HEIC→JPG) and take-home-pay / mortgage / tip+tax calculators are the genuinely daily, cross-occupation chores. These — not ID-checksum tools — are the high-frequency hits here.
2. **Respect US-vs-Commonwealth divergence.** Date format (MM/DD vs DD/MM), imperial vs metric (a real everyday US chore), $ vs £, ZIP vs postcode, SSN vs NI/SIN/TFN, ABA vs sort code/BSB, US Letter vs A4, calendar-year vs Apr–Apr/Jul–Jun tax years. A clean jurisdiction switch is core infrastructure.
3. **Privacy and offline are the differentiator.** Sensitive inputs (pay, tax forms, contracts, SSNs, financial docs) make local-first processing both a feature and a trust story — the credible answer to "why not just use a random website?".

Get the 15 items in §3 working smoothly and the app covers roughly 70% of the everyday digital chores of a typical English-speaking user.

---

## Sources

**Online tools / utilities (overview):**
- [Free Online Tools 2025 — fixittoolbox](https://fixittoolbox.com/free-online-tools-2025/), [MyClickTools](https://myclicktools.com/), [QuickToolify](https://quicktoolify.com/)
- [Best Word to PDF converter 2025 — TechRadar](https://www.techradar.com/best/word-to-pdf-converter)

**PDF & e-signature:**
- [Best PDF merging software 2025 — TechRadar](https://www.techradar.com/best/best-pdf-merger), [Smallpdf](https://smallpdf.com/), [PDFsam](https://pdfsam.org/), [Jotform: merge PDF files](https://www.jotform.com/blog/merge-pdf-files/)
- [US electronic signature laws (ESIGN Act & UETA) — Docusign](https://www.docusign.com/products/electronic-signature/learn/esign-act-ueta), [ESIGN & UETA legality — BlueInk](https://www.blueink.com/blog/esign-ueta-legality-secure-esignatures), [Are e-signatures legal? — Clio](https://www.clio.com/blog/are-electronic-signatures-legal/)

**File conversion:**
- [HEIC to JPG — heictojpg.com](https://heictojpg.com/), [iMazing Converter](https://imazing.com/converter), [Adobe Express HEIC→JPG](https://www.adobe.com/express/feature/image/convert/heic-to-jpg)
- [CloudConvert MP4→MP3](https://cloudconvert.com/mp4-to-mp3), [Zamzar](https://www.zamzar.com/convert/mp4-to-mp3/), [FreeConvert video tools](https://www.freeconvert.com/convert/video-to-mp3)

**Calculators — finance & tax:**
- [Bankrate Mortgage Calculator](https://www.bankrate.com/mortgages/mortgage-calculator/), [Zillow Mortgage Calculator](https://www.zillow.com/mortgage-calculator/), [SmartAsset Mortgage Calculator](https://smartasset.com/mortgage/mortgage-calculator)
- [IRS Tax Withholding Estimator](https://www.irs.gov/individuals/tax-withholding-estimator), [NerdWallet Tax Calculator](https://www.nerdwallet.com/taxes/calculators/tax-calculator), [2026 Tax Calendar — ReturnMyTax](https://returnmytax.com/tax-calendar), [Important Tax Dates 2026 — TaxAct](https://blog.taxact.com/important-tax-dates-and-deadlines-2026/)
- [NerdWallet 401(k) Calculator](https://www.nerdwallet.com/retirement/calculators/401k-calculator), [Investor.gov Compound Interest Calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator), [Calculator.net 401k](https://www.calculator.net/401k-calculator.html)

**Regional take-home pay (UK / Canada / Australia):**
- [GOV.UK estimate Income Tax](https://www.gov.uk/estimate-income-tax), [Listen to Taxman (UK)](https://listentotaxman.com/), [MoneySavingExpert tax calculator](https://www.moneysavingexpert.com/tax-calculator/)
- [Salary Calculator Canada — Salary After Tax](https://salaryaftertax.com/ca/salary-calculator), [TurboTax Canada (Ontario)](https://turbotax.intuit.ca/tax-resources/ontario-income-tax-calculator), [CRA tax rates & brackets](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)
- [Moneysmart.gov.au income tax calculator (AU)](https://moneysmart.gov.au/work-and-tax/income-tax-calculator), [ATO simple tax calculator](https://www.ato.gov.au/calculators-and-tools/tax-return-simple-tax-calculator), [Australia Pay Calculator (PAYG)](https://www.paycalculators.com.au/)

**Everyday math (tip / sales tax / dates):**
- [Tip & Sales Tax Calculator — Salecalc](https://www.salecalc.com/tiptax), [Restaurant Tax Calculator — Menubly](https://www.menubly.com/tools/restaurant-tax-calculator/), [Restaurant Tip Calculator USA — QuickTipCalc](https://quicktipcalc.com/restaurant-tip-calculator/)
- [Date Calculator — Calculator.net](https://www.calculator.net/date-calculator.html), [Date Duration — timeanddate.com](https://www.timeanddate.com/date/duration.html)

**Units & cooking conversion:**
- [Metric vs Imperial cooking guide — Easy Measure Chef](https://easymeasurechef.com/blog/metric-vs-imperial-cooking.html), [Cooking Measurement Conversion — WebstaurantStore](https://www.webstaurantstore.com/guide/582/measurements-and-conversions-guide.html), [Metric vs Imperial — MasterClass](https://www.masterclass.com/articles/whats-the-difference-between-the-metric-and-imperial-system-plus-a-conversion-chart-for-imperial-and-metric-systems-of-measurement)

**Currency:**
- [OANDA Currency Converter](https://www.oanda.com/currency-converter/en/), [ECB euro reference rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html), [Yahoo Finance currency converter](https://finance.yahoo.com/currency-converter/)

**Time zones & scheduling:**
- [World Time Buddy](https://www.worldtimebuddy.com/), [9 Meeting Planner World Clock Tools — OnceHub](https://www.oncehub.com/blog/9-meeting-planner-world-clock-tools-for-global-teams), [Time Zone Mastery — Kumospace](https://www.kumospace.com/blog/scheduling-meetings-across-time-zones)
- [2026 US Federal Holidays — timeanddate](https://www.timeanddate.com/holidays/us/2026), [Federal Holidays — FederalPay](https://www.federalpay.org/holidays)

**Text & developer tools:**
- [WordCounter.net](https://wordcounter.net/), [Text Toolbox](https://textoolbox.com/), [FreeTextUtils](https://freetextutils.com/)
- [DevUtils](https://devutils.karthikponnam.dev), [W3Schools Developer Tools](https://www.w3schools.com/tools/index.php), [consolelog.tools](https://www.consolelog.tools/)
- [Bitwarden Password Generator](https://bitwarden.com/password-generator/), [Bitwarden Password Strength](https://bitwarden.com/password-strength/), [Security.org password checker](https://www.security.org/how-secure-is-my-password/)

**Image tools:**
- [Photoroom Background Remover](https://www.photoroom.com/tools/background-remover), [Clipping Magic](https://clippingmagic.com/), [RealFaviconGenerator](https://realfavicongenerator.net/), [PicsSizer](https://www.picssizer.com/)

**Validation — banking / ID / address:**
- [ABA Routing Number Validator — Xe](https://www.xe.com/routing-numbers/validator/), [ABA Routing Number — ABA](https://www.aba.com/about-us/routing-number), [Validation Algorithms (Luhn etc.) — BrainJar](http://www.brainjar.com/js/validation/)
- [USPS ZIP Code Lookup](https://tools.usps.com/zip-code-lookup.htm), [Smarty address verification](https://www.smarty.com/products/single-address), [UK postcode format — ideal-postcodes](https://ideal-postcodes.co.uk/guides/uk-postcode-format), [Royal Mail Postcode Finder](https://www.royalmail.com/find-a-postcode)

**Bills, subscriptions, invoices, resumes:**
- [Best Budget Apps 2026 — NerdWallet](https://www.nerdwallet.com/finance/learn/best-budget-apps), [Best Bill Management Apps — National Debt Relief](https://www.nationaldebtrelief.com/blog/financial-wellness/budgeting/best-bill-management-app/), [Track subscriptions — U.S. News](https://money.usnews.com/money/personal-finance/saving-and-budgeting/articles/track-and-manage-subscriptions-with-these-apps)
- [Invoice Generator](https://invoice-generator.com/?locale=en), [Canva Invoice Generator](https://www.canva.com/invoice/), [Invoice Simple Receipt Maker](https://www.invoicesimple.com/receipt-template/receipt-maker)

**Scanning / OCR & QR codes:**
- [Adobe Scan (App Store)](https://apps.apple.com/us/app/adobe-scan-pdf-ocr-scanner/id1199564834), [Best mobile scanning & OCR apps — Zapier](https://zapier.com/blog/best-mobile-scanning-ocr-apps/), [Best OCR software 2025 — TechRadar](https://www.techradar.com/best/best-ocr-software)
- [QR Code Statistics 2026 — QRCodeChimp](https://www.qrcodechimp.com/qr-code-statistics/), [QR Code Generator Statistics — QR Tiger](https://www.qrcode-tiger.com/qr-code-statistics), [QR Code Types — Supercode](https://www.supercode.com/blog/qr-code-types)
