# Zii 万能ツール — 日本市場 機能カタログ (Japan Feature Catalog)

*A localized utility catalog aimed at solving ~70% of the everyday digital chores that Japanese people (会社員 / general public) do in their daily routine.*

Last updated: 2026-06-28 (令和8年)

---

## 1. Vision (定位)

Japanese daily chores differ sharply from those of US/EU users. A "Swiss army knife" app for Japan cannot just be a file converter + calculator. The tasks Japanese people do every day — and can't quit — are intensely local: **和暦⇄西暦 conversion (令和8年 = 2026), 六曜 (大安/仏滅) lookup for auspicious days, ふるさと納税 limit calculators, 確定申告/年末調整 helpers, take-home pay (手取り) calculators with 健康保険・厚生年金 deductions, コンビニ払い (convenience-store barcode bill payment), ゴミ分別 (complex municipal garbage-sorting rules), 全角/半角 text conversion, 郵便番号→住所 autofill, and 乗換案内 (train transfer) with Suica/PASMO balance.**

This document ranks these needs by **frequency × penetration**, marks the core functions making up the **daily 70%** (Tier 1), then expands into a full catalog. Design principles carry over from the master catalog (privacy first, batch processing, offline-capable, no ads/no watermark), but data sources shift heavily to Japanese government open data (気象庁 JMA, デジタル庁/総務省, 国税庁, 日本年金機構, 日本郵便) and local services (Yahoo!乗換案内, PayPay, マネーフォワード).

> Companion reading: `FEATURE-CATALOG.md` (general master catalog) and `FEATURE-CATALOG-TAIWAN.md` (Taiwan localization). This file is the Japan localization branch.

---

## 2. Localization facts (在地化基本事実 — affects multiple features)

Load-bearing constants. Keep them in one auto-updatable config shared across every tool.

- **和暦 (Japanese era / 元号)**: Government documents and most forms use era years, not 西暦. Current era **令和 (Reiwa)** began **2019-05-01** (令和元年). Rule: **令和 year + 2018 = 西暦** (令和8年 = 2026); mnemonic: read "018" as "れいわ". Prior eras: 平成 (1989–2019; +1988), 昭和 (1926–1989; +1925), 大正, 明治. Era changes happen mid-year, so one 西暦 year can span two eras — conversion tables must handle the boundary (e.g., 2019 = 平成31年 until Apr 30, 令和元年 from May 1).
- **マイナンバー (My Number / 個人番号)**: **12 digits**, 12th is a check digit. Validatable offline: multiply digits 1–11 (from most significant) by weights `6,5,4,3,2,7,6,5,4,3,2`, sum, mod 11; if remainder ≤ 1 → check digit = 0, else 11 − remainder. The **マイナンバーカード** (My Number Card) is the physical IC card used for コンビニ交付, 健康保険証 (now the primary route as paper 保険証 is phased out), e-Tax 確定申告, and マイナポータル login.
- **法人番号 (Corporate Number)**: **13 digits** (12-digit base + 1 leading check digit). The インボイス制度 **登録番号 (registration number) = "T" + 13-digit 法人番号**. Both are publicly searchable and validatable.
- **郵便番号 (postal code)**: 7 digits in **〒XXX-XXXX** format. Address order is largest→smallest: 都道府県 (prefecture) → 市区町村 (city/ward) → 町名・丁目 (town/chome) → 番地・号 (banchi-go) → building. Postal-code → address autofill is ubiquitous on Japanese forms (commonly via the **zipcloud API**).
- **消費税 (consumption tax)**: standard **10%**, reduced rate **8%** (軽減税率) for food/drink excluding alcohol & eating-out, and newspapers (subscription, ≥2×/week). **インボイス制度** (qualified-invoice system) started **2023-10-01**; phased input-tax-credit transition (80% then 50%) runs to **2029-09-30**.
- **社会保険 (social insurance) deductions** (令和8年 / 2026): **厚生年金 18.3%** split 50/50 (employee 9.15%); **健康保険** rate varies by prefecture (協会けんぽ ~10%, split 50/50); **雇用保険** rate set yearly by 厚労省; **介護保険** added for ages 40–64. All computed off the **標準報酬月額** grade table (32 grades for 厚生年金). Take-home (手取り) is typically **~75–85%** of gross (額面).
- **住民税 (resident tax)**: levied by the municipality where you had a 住民票 on **January 1**, based on **previous year's** income; roughly 10% income-based + per-capita portion.
- **税のスケジュール**: 確定申告 (final tax return) for 令和7年分 income runs **2026-02-16 to 03-16** (e-Tax opens 01-05). 会社員 with one employer and salary ≤ ¥20M are normally covered by 年末調整 and need not file — but 医療費控除 / ふるさと納税 (>5 自治体) require 確定申告.
- **2026 税制改正**: 基礎控除 raised from ¥480k toward up to ¥950k for lower/mid incomes — changes 手取り and slightly lowers ふるさと納税 limits. Calculators must be year-versioned.
- **祝日 (public holidays)**: 16 national holidays/year. **ハッピーマンデー制度** moves 成人の日 (2nd Mon of Jan), 海の日 (3rd Mon of Jul), 敬老の日 (3rd Mon of Sep), スポーツの日 (2nd Mon of Oct) to Mondays. **振替休日** (substitute holiday) applies when a holiday falls on Sunday; **国民の休日** fills a weekday sandwiched between two holidays. 2026 has notable runs around early May (GW) and the Sep 21/22/23 "オセロ" cluster.
- **六曜 (rokuyō)**: 大安 / 友引 / 先勝 / 先負 / 仏滅 / 赤口 cycle, mechanically derived from the 旧暦 (lunisolar) date. Heavily consulted for weddings, 引っ越し, openings, funerals (友引 avoided for 葬式). Computable offline from the lunar date.

---

## 3. Core 70%: features touched daily/weekly (Tier 1)

Priority build set — the bulk of daily usage. Frequency and local data/rule source noted below.

| # | Feature | Typical frequency | Local data / rule source |
|---|---------|------------------|--------------------------|
| 1 | **和暦 ⇄ 西暦 ⇄ 旧暦 converter + 元号 table + 年齢/干支/厄年 calculator** | Filling any form, anytime | 国立天文台暦計算室、内閣府元号 |
| 2 | **祝日 / 連休 / 振替休日 calendar + 六曜 (大安/仏滅) + 二十四節気** | Planning leave, weddings, moves | 内閣府 祝日、国立天文台 暦要項 |
| 3 | **手取り (take-home pay) calculator** — 健康保険/厚生年金/雇用保険/所得税/住民税 deductions | Monthly / at job change | 日本年金機構、協会けんぽ、国税庁 |
| 4 | **ふるさと納税 控除上限額シミュレーション** | Seasonal, very popular | 総務省 ふるさと納税のしくみ |
| 5 | **コンビニ払い / 払込票 barcode payment guide + 口座振替 + PayPay** | Monthly–quarterly | PayPay請求書払い、PayB、各事業者 |
| 6 | **支払い・更新リマインダー** (電気/ガス/水道/携帯/NHK/家賃/保険/各種税) | Monthly | 各事業者、自治体 |
| 7 | **ゴミ出し** — sorting lookup + collection-day reminder (municipality-specific) | Almost daily | 各自治体（横浜市/大阪市等）、さんあ〜る/ごみスケ |
| 8 | **郵便番号 → 住所 autofill + 日本語住所 → 英語 (ヘボン式) 変換** | Online shopping, forms, shipping | 日本郵便、zipcloud API |
| 9 | **全角 ⇄ 半角 + ひらがな/カタカナ/ローマ字 変換 + ふりがな + 文字数カウント** | Office work, daily | NFKC正規化、各種変換ツール |
| 10 | **天気 / 地震 / 緊急地震速報 / 台風 / 花粉 / 警報・注意報** | Daily | 気象庁 (JMA) 防災情報 |
| 11 | **乗換案内** (train transfer/route, fare) + Suica/PASMO 残高 (native NFC plugin only — FeliCa, capability-detected, manual-entry fallback) + 定期券 | Commute, daily | Yahoo!乗換案内、ジョルダン、JR東日本 |
| 12 | **為替換算** (JPY⇄USD 等, 旅行両替) | Weekly → daily before travel | 為替レート、各両替所 |
| 13 | **マイナンバー / 法人番号 / インボイス登録番号 validation** + コンビニ交付ガイド | Forms, dev, verifying invoices | 国税庁公表サイト、デジタル庁 |
| 14 | **家計簿 / レシート読み取り / ポイントカード管理** | Per purchase | マネーフォワード、くふうZaim |

> Making these 14 smooth covers the large majority of an ordinary Japanese office worker's / household's daily digital chores.

---

## 4. Calendar, eras, holidays & 暦注 (曆法・祝日・擇日)

Japan's most distinctive, high-frequency lookup cluster.

- **和暦 ⇄ 西暦** two-way conversion, including era boundaries (令和8年 = 2026; 令和 + 2018; 平成 + 1988; 昭和 + 1925). Inline form widget for "convert this date field."
- **新暦 ⇄ 旧暦 (lunisolar)** conversion, 閏月 handling, 旧暦 birthday lookup.
- **元号一覧** with start/end dates (明治・大正・昭和・平成・令和) and overlap handling.
- **年齢計算**: 満年齢 vs 数え年 (counted age: born = 1, +1 every Jan 1). 干支 (十二支: 2026 = 午年/horse). **厄年 (yakudoshi)** lookup by 数え年 (men 大厄 42, women 大厄 33), plus 前厄/後厄.
- **祝日 / 連休 calendar**: 16 national holidays, ハッピーマンデー (成人の日/海の日/敬老の日/スポーツの日 fixed to Mondays), 振替休日, 国民の休日; "how to take leave for the longest break" planner.
- **六曜 (大安/仏滅/先勝/友引/先負/赤口)**: derived from 旧暦; meanings and 吉時 (e.g., 先勝 = morning lucky, 先負 = afternoon lucky); good days for 結婚/引っ越し/開業/納車, avoid 友引 for 葬式. Computable offline.
- **二十四節気 + 雑節 + 七十二候**: 立春・立夏・立秋・立冬, 節分, 土用 (18 days before each 立~), 八十八夜, 入梅, 半夏生; plus 五節句. Source: 国立天文台 暦要項.
- **行事・記念日**: お正月, 節分, ひな祭り, お盆, お彼岸, 七五三, 大晦日; countdowns to 確定申告 deadline, 年末調整, ボーナス, 給料日.

---

## 5. Take-home pay, tax & social insurance (財稅・給与計算機)

Designed around the Japanese system; grades/rates are year-versioned.

### 5.1 給与・労働 (payroll & labor)
- **手取り (take-home) calculator**: from 額面, deduct 健康保険・厚生年金・雇用保険(・介護保険 40+)・所得税・住民税 to get net; reverse to employer cost.
- **社会保険料 calculator** off **標準報酬月額** grades: 厚生年金 18.3% (employee 9.15%), 健康保険 (~10%, prefecture-specific, employee ~5%), 雇用保険 (yearly rate), 介護保険 (ages 40–64). Includes 標準賞与額 for ボーナス.
- **所得税 (源泉徴収) calculator**: from 課税所得 (額面 − 各種控除); progressive brackets; 復興特別所得税 ×1.021.
- **住民税 calculator**: ~10% 所得割 + 均等割, based on **previous year** income, billed by Jan-1 municipality.
- **残業代 (overtime) calculator**: 法定外 ≥25% 割増, 深夜 ≥25%, 休日 ≥35%, **月60時間超 ≥50%** (now applies to SMEs since 2023-04). Monthly 所定労働時間 = (365 − 年間休日)×8 ÷ 12.
- **有給休暇 (paid leave) accrual**: grant days by 勤続年数 (6 months → 10 days, scaling up), 時季 rules.
- **時給 ⇄ 月給 ⇄ 年収** conversion, 最低賃金 (by prefecture) lookup, ボーナス/退職金 estimates.

### 5.2 確定申告・控除 (tax return & deductions)
- **年末調整 vs 確定申告** explainer + checklist (who must file; 会社員 with 医療費控除 / ふるさと納税 >5 自治体 / 副業 etc.).
- **源泉徴収票** reader/explainer (支払金額, 給与所得控除後の金額, 所得控除の額, 源泉徴収税額).
- **医療費控除 calculator**: deduct (医療費 − min(¥100k, 所得×5%)); refund ≈ deduction × (所得税率 + 住民税10%); **セルフメディケーション税制** alternative (OTC, max ¥88k, mutually exclusive).
- **確定申告 schedule** (令和7年分: 2026-02-16 to 03-16; e-Tax from 01-05) + e-Tax via マイナンバーカード guide.
- **各種控除**: 基礎控除 (2026改正), 配偶者(特別)控除, 扶養控除, 生命保険料控除, 寄附金控除 (ふるさと納税).

### 5.3 ふるさと納税 (furusato nozei) — flagship
- **控除上限額シミュレーション** by 年収 × 家族構成 (上限 ≈ 住民税所得割 × 20% + 2,000; self-pay ¥2,000).
- Breakdown: 所得税 refund = (寄付 − 2,000) × 所得税率 ×1.021; 住民税 基本分 = (寄付 − 2,000) × 10%; 住民税 特例分 = (寄付 − 2,000) × (90% − 所得税率×1.021).
- **ワンストップ特例** eligibility checker (≤5 自治体, no 確定申告 otherwise needed) vs 確定申告 route.
- 2026 税制改正 (基礎控除引き上げ) impact warning.

### 5.4 投資・ローン (investing & loans)
- **新NISA calculator** (since 2024): つみたて投資枠 ¥1.2M/yr + 成長投資枠 ¥2.4M/yr, total ¥3.6M/yr, lifetime ¥18M, tax-free; compound-growth simulator.
- **株 tools**: 日経平均 / TOPIX context, 投資信託 returns, 配当利回り, NISA vs 特定口座 (20.315% tax).
- **住宅ローン calculator**: 元利均等 vs 元金均等 repayment, ボーナス払い, fixed/変動金利, 繰り上げ返済; **住宅ローン控除** estimate.
- **年金 (pension) estimate** (国民年金 / 厚生年金), iDeCo; **為替** JPY↔USD/EUR with cash/spot spread for travel.

---

## 6. Bills, payments & accounting (繳費與帳務)

The app cannot move money (compliance), but it can organize, remind, calculate, and guide.

- **支払いカレンダー + 期限リマインダー**: 電気/ガス/水道, 携帯 (docomo/au/SoftBank/楽天), NHK受信料, 家賃, クレジットカード, 各種保険, 自動車税/固定資産税/住民税 brackets.
- **コンビニ払い (払込票) guide**: read the barcode on a 払込票 and pay via **PayPay請求書払い**, **PayB** (口座振替), **d払い**, **au PAY** — without going to the store; or in-store at セブン/ローソン/ファミマ.
- **口座振替 (auto-debit) / 電子マネー (Suica/PASMO/iD/QUICPay) / QRコード決済 (PayPay/楽天ペイ/d払い/au PAY)** comparison & setup checklist; point-back card comparison for utilities (info-only).
- **お客様番号 / 契約番号** storage with quick fill.
- **家計簿 (household budget)**: マネーフォワード ME / くふうZaim-style — **レシート読み取り** (camera OCR to line items), 口座/カード linkage (read-only), monthly category analysis. *OCR*: on mobile use native on-device OCR (Apple Vision / Google ML Kit), which handle Japanese (incl. 縦書き via Vision) well; use tesseract.js only as a web/offline fallback (it degrades on photos with complex backgrounds).
- **ポイントカード管理**: store multiple point balances (T/楽天/Ponta/dポイント/PayPayポイント), expiry reminders, consolidated graph.
- **レシート / 領収書 → 経費精算 (expense report)** for 会社員 出張/立替.

---

## 7. Daily chores (生活雜事)

- **ゴミ出し (garbage)**: the hardest local problem — sorting rules differ wildly by 自治体. Per-address collection schedule (燃えるゴミ/燃えないゴミ/資源ごみ/プラ/缶・びん・ペットボトル/粗大ごみ), **item-name search** ("what bin does X go in?"), day-before reminders, 粗大ごみ booking guide. Mirror municipal apps (さんあ〜る, ごみスケ, 各市ごみ分別アプリ).
- **天気 / 防災**: pinpoint 天気, 降水確率, 紫外線, **花粉 (pollen) forecast** (スギ/ヒノキ season); **地震** info + **緊急地震速報** (issued when intensity ≥5弱 predicted), 津波警報, **台風** track, 警報・注意報・特別警報 (municipal-level), 線状降水帯, alert levels (警戒レベル). Source: 気象庁 (JMA).
- **マイナンバーカード サービス**: コンビニ交付 (住民票・印鑑登録証明書・課税証明書 at マルチコピー機 nationwide), 健康保険証 registration & usage, マイナポータル (薬剤情報・健診・行政手続検索), e-Tax 確定申告, iPhone搭載マイナンバーカード.
- **印鑑 (hanko) culture**: 実印 (印鑑登録), 銀行印, 認印 distinction; when each is required; 押印 廃止 trend (since 1997 guideline) but still needed where a form has a 押印欄; 履歴書 uses 認印 (~1.5cm), not シャチハタ.
- **書類スキャン**: 領収書/請求書/契約書 photo → de-skew → PDF, 証明写真 sizing. *OCR*: on mobile use native on-device OCR (Apple Vision / Google ML Kit), strong on Japanese (incl. 縦書き via Vision); tesseract.js only as a web/offline fallback (degrades on photos with complex backgrounds).

---

## 8. Japanese text tools (日本語文書工具)

Extremely high-frequency in Japanese office work.

- **全角 ⇄ 半角 (zenkaku/hankaku)** for 英数字・カタカナ・記号・スペース — one of the most-used Japanese text operations; **NFKC正規化** option.
- **ひらがな ⇄ カタカナ ⇄ ローマ字 (ヘボン式)** conversion, real-time.
- **ふりがな (furigana / ruby)** auto-generation over 漢字 (incl. 名前 reading guess), 縦書き ruby support.
- **漢字 → 読み (reading)** lookup, 名前の読み方 推定, 異体字 / 旧字体 / 新字体, 機種依存文字 (環境依存) warnings, Unicode lookup.
- **文字数 / 文字種カウント**: total, by 漢字/ひらがな/カタカナ/英数/記号, 句読点 (、。), 行数, 段落; 原稿用紙 (400字) count.
- **縦書き ⇄ 横書き**, 約物・句読点 normalization, **数字 → 漢数字 / 大字 (壱弐参…)** for 金額表記 on 領収書/契約書.
- **敬語 / ビジネスメール templates** (お世話になっております…), 顔文字/絵文字, general text utils (case, dedupe, sort, diff, Markdown).

---

## 9. ID, forms & data validation (身分・表單・資料驗證)

- **マイナンバー (12桁) validation** with check-digit (weights 6,5,4,3,2,7,6,5,4,3,2; mod 11) + test-data generator (dev/QA only).
- **法人番号 (13桁) validation** + lookup via 国税庁法人番号公表サイト.
- **インボイス登録番号 (T + 13桁)** validation + 公表サイト search guide.
- **郵便番号 (7桁) → 住所 autofill** (都道府県/市区町村/町名), 住所正規化, and **日本語住所 → 英語 (ヘボン式)** for 海外発送 (order reversed, numbers like 4-3-8, building in romaji, half-width).
- **電話番号 formatting** (固定: 市外局番; 携帯 0X0), **金融機関コード/支店コード**, 銀行口座 format.
- **クレジットカード Luhn check**, **vCard ⇄ CSV** contacts, **名刺 (business card) OCR → contact** (mobile: native on-device OCR — Apple Vision / Google ML Kit, strong on Japanese incl. 縦書き via Vision; tesseract.js only as a web/offline fallback, weaker on complex backgrounds).
- **履歴書 (rirekisho) helper**: JIS / 厚労省様式 templates, 学歴・職歴 formatting, 西暦/和暦 consistency, photo sizing, 押印 guidance.

---

## 10. Transport & travel (交通與出行)

- **乗換案内 (route/transfer search)**: 電車/新幹線 route, time, **運賃** (IC vs 現金 vs 地域IC), platform, transfers — model on Yahoo!乗換案内 / ジョルダン.
- **Suica / PASMO 残高 (balance)** read via NFC, history; **定期券 (commuter pass)** consideration in routing & 定期代 calc.
  - *NFC feasibility caveat*: Suica/PASMO are **FeliCa (NFC-F)**; **Web NFC cannot read them** (NDEF-only), so this needs a **native plugin** (capawesome — paid; or the free Exxili Capacitor NFC plugin). **iOS** (iPhone 7+) works via CoreNFC but needs the FeliCa systemcodes entitlement (`com.apple.developer.nfc.readersession.felica.systemcodes`) and only via a modal prompt (no background reads); for Japan IC cards iOS reads system code 0x3 (ticketing/balance). **Android**: only phones with a FeliCa secure element can read it — Japan-market phones, Pixel 6+, some global flagships; most non-Japan Android phones cannot. For a Japan-targeted audience this is minor, since domestic phones generally support おサイフケータイ/FeliCa. Treat 残高 reading as a **capability-detected feature** with **manual-entry** fallback.
- **新幹線**: 時刻・料金 (乗車券 + 特急券), 自由席/指定席/グリーン, 早特/EX予約 guidance.
- **バス / 路線図**, **タクシー fare estimate**, **ETC** 料金 & 履歴 organizing, **ガソリン価格** (レギュラー/ハイオク) trends.
- **車検 / 自動車税 / 自賠責保険 / 運転免許 更新** expiry reminders.
- **国内旅行 / 海外旅行**: 為替換算 (JPY↔foreign), チップ/税 calc, 時差, パスポート expiry reminder, 祝日/連休-aware planning.

---

## 11. General tools, localized (通用工具)

Carried over from the master catalog, presented for Japanese contexts.

- **File conversion**: PDF ⇄ Word/Excel, HEIC→JPG, image compression, video/archive conversion.
- **PDF tools**: merge/split/compress/OCR (Japanese 縦書き included)/watermark/電子印鑑 (hanko stamp)/sign.
- **Image tools**: compress, resize (証明写真, SNS sizes), background removal, **QR generation** (incl. URL/Wi-Fi/名刺/PayPay-style payment).
- **Calculators**: 消費税 (10%/8%) tax-in/tax-out, 割り勘 (split bill), discount, unit conversion (寸/坪/合 legacy units).
- **Generators**: QR, password, UUID. **Encode/hash**: Base64, URL encode, SHA/MD5.
- Developer tools (JSON/regex/diff) useful to freelancers & 事務 staff.

---

## 12. Cross-cutting & data sources (跨功能與資料來源)

- **Government open data first**: 気象庁 (weather/quake/typhoon/警報), デジタル庁/総務省 (My Number, マイナポータル), 国税庁 (法人番号/インボイス公表サイト, 確定申告), 日本年金機構/協会けんぽ (社会保険), 日本郵便 + zipcloud (郵便番号), 国立天文台 暦計算室 (暦/二十四節気), 内閣府 (祝日), each 自治体 (ゴミ分別).
- **Offline-first**: 和暦/旧暦/六曜/年齢/厄年 conversion, マイナンバー/法人番号 validation, 全角/半角・かな・ふりがな・文字数, all calculators (手取り/ふるさと納税/残業代/住宅ローン) — fully offline.
- **Shared config**: 社会保険料率 (令和8年), 標準報酬月額 grades, 税率/控除, 祝日, 為替, 消費税率 — versioned & auto-updated.
- **Privacy**: マイナンバー, 給与, 家計簿, 領収書, 住所 等 stored locally-encrypted, never uploaded — the core trust differentiator vs cloud competitors.
- **Reminder engine**: 支払い, ゴミ出し, 証明書/免許/車検 expiry, 確定申告 season, 年末調整 — unified push center.
- **PWA / app + desktop widget**, full Japanese UI (敬語), dark mode, accessibility, 縦書き-aware rendering.

---

## 13. Build phases (建議開發順序)

**Phase 1 — stickiness core (early Tier 1):**
和暦/旧暦/六曜/祝日 calendar, 手取り (社会保険+税) calculator, ふるさと納税 limit simulator, コンビニ払い/支払いリマインダー, ゴミ出し sorting+reminder, 郵便番号→住所 + 住所英語化, 全角/半角・かな・ふりがな・文字数, 天気/地震/花粉/警報, 乗換案内 + Suica残高, 為替換算, マイナンバー/法人番号/インボイス validation.

**Phase 2 — full local toolkit:**
完整 給与/確定申告/医療費控除/残業代 calculators, 住宅ローン/新NISA/株/年金, 家計簿+レシートOCR+ポイント管理, マイナンバーカード サービスガイド (コンビニ交付/健康保険証/マイナポータル/e-Tax), 履歴書/年賀状/喪中はがき helpers, 新幹線/車検/免許更新 reminders.

**Phase 3 — differentiation:**
通用 file/PDF/image tools, 電子印鑑, global command-palette search, reminder-engine automation, AI assistant (Japanese summarize/rewrite/敬語化/translate, 領収書・請求書 OCR, レシート categorization), cross-tool linking, cloud sync.

---

## 14. Key takeaways (結論)

Winning the Japan market is not about "more tools" — it's about being **deeply local**. Three keys:

1. **Capture the unique high-frequency pain points** — 和暦/六曜, 手取り (社会保険+税), ふるさと納税, コンビニ払い, ゴミ分別, 全角/半角, 郵便番号→住所, 乗換案内+Suica. These don't exist in US/EU tools, yet Japanese people touch them constantly.
2. **Leverage official open data** — 気象庁 (weather/quake), 国税庁 (法人番号/インボイス), デジタル庁 (My Number/マイナポータル), 日本郵便/zipcloud, 国立天文台 (暦), each municipality (ゴミ) — reliable and largely free.
3. **Privacy & offline** — マイナンバー, 給与, 家計簿, 住所 are highly sensitive; local processing is the basis of trust and the differentiator vs "throw it in the cloud" competitors.

Making the 14 items in Section 3 genuinely smooth covers roughly **70%** of an ordinary Japanese user's daily digital chores.

---

## Sources (資料來源)

- [和暦・西暦早見表【令和8年（2026）】(寺田税理士事務所)](https://taxlabor.com/%E5%92%8C%E6%9A%A6%E8%A5%BF%E6%9A%A6%E6%97%A9%E8%A6%8B%E8%A1%A8/)、[2026年は令和何年？(Indeed)](https://jp.indeed.com/career-advice/useful-business-tips/reiwa-seireki-2026-conversion-table)、[西暦和暦変換ツール（ちょっと便利帳）](https://www.benricho.org/nenrei/sei-wa-conv.html)
- [国立天文台暦計算室 令和8年(2026)暦要項 二十四節気および雑節](https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html)、[二十四節気（国立国会図書館 日本の暦）](https://www.ndl.go.jp/koyomi/chapter3/s7.html)、[雑節の計算（こよみ8）](https://koyomi8.com/zassetsu.php)
- [国民の祝日について（内閣府）](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)、[2026年の祝日は？（政府広報オンライン）](https://www.gov-online.go.jp/article/202112/entry-9910.html)、[ハッピーマンデー・2026年連休一覧](https://lifenoblog.com/life/calendar-holiday/)
- [六曜 - Wikipedia](https://ja.wikipedia.org/wiki/%E5%85%AD%E6%9B%9C)、[吉凶を表す言葉①六曜（国立国会図書館）](https://www.ndl.go.jp/koyomi/chapter3/s3.html)
- [数え年の計算ツール（満年齢との違い・厄年）](https://oihaimaker.jp/page/kazoedoshi/)、[2026年版 年齢早見表・干支・厄年（benri.jp）](https://www.benri.jp/calc/nenrei)、[厄年チェック自動計算ツール](https://www.yakuyoke-yakubarai-jinja.com/toshi-count/index.html)
- [マイナンバーのチェックデジット計算（Qiita）](https://qiita.com/kmz_kappa/items/af18ac7b6b8bfe9041b0)、[個人番号検査用数字を算出する算式（PDF）](https://abbma2.sakura.ne.jp/bwu70270/wp-content/uploads/2015/10/102d2232e91e286772e102d54be88e3d1.pdf)、[マイナンバー12桁チェックデジットの仕組み（AQlier）](https://aqlier.com/2025/07/10/my_number_check_digit/)
- [マイナンバーカードでできること（総合サイト）](https://www.kojinbango-card.go.jp/card/advantage/)、[コンビニ交付（デジタル庁）](https://digital-agency-news.digital.go.jp/articles/2024-10-08)、[マイナンバーカードの健康保険証利用（厚労省）](https://www.mhlw.go.jp/stf/newpage_40391.html)、[iPhoneのマイナンバーカード（デジタル庁）](https://services.digital.go.jp/mynumbercard-iphone/usecase/)
- [国税庁法人番号公表サイト](https://www.houjin-bangou.nta.go.jp/)、[法人番号のチェックデジット計算（国税庁PDF）](https://www.houjin-bangou.nta.go.jp/documents/checkdigit.pdf)、[国税庁インボイス制度適格請求書発行事業者公表サイト](https://www.invoice-kohyo.nta.go.jp/)、[登録番号とは（国税庁）](https://www.invoice-kohyo.nta.go.jp/about-toroku/index.html)
- [確定申告とは・2026年最新（三菱UFJ銀行）](https://www.bk.mufg.jp/column/others/b0055.html)、[2026年提出（令和7年分）確定申告の変更点（マネーフォワード）](https://biz.moneyforward.com/tax_return/basic/43836/)、[年末調整と確定申告の違い（弥生）](https://www.yayoi-kk.co.jp/shinkoku/oyakudachi/shotokukojo-2/)、[給与所得者の確定申告（国税庁）](https://www.nta.go.jp/publication/pamph/koho/campaign/r6/Jan/03.htm)
- [No.1120 医療費控除（国税庁）](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm)、[セルフメディケーション税制（日本一般用医薬品連合会）](https://www.jfsmi.jp/lp/tax/refund/)、[医療費控除はいくらから（moneiro）](https://moneiro.jp/media/article/medical-deduction-tax-return-from)
- [令和8年度 厚生年金保険料率（社労士ナビ）](https://www.chukidan.jp/navi/column/insurance/13963/)、[厚生年金保険料額表（日本年金機構）](https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/index.html)、[2026年社会保険料率まとめ（まき社労士）](https://maki-sharoushi.com/26shahoryoritsu/)、[厚生年金 標準報酬月額上限引き上げ（厚労省）](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000147284_00024.html)
- [税金・社会保険料・手取り計算シミュレーション](https://www.mmea.biz/simulation/calculation/)、[給与手取り計算シミュレーション2026（社労士クラウド）](https://sharoushi-cloud.com/kyuyo-keisan-tool/)、[手取りの計算方法（三井住友カード）](https://www.smbc-card.com/nyukai/magazine/fremaga/money/net_salary.jsp)、[2026年版 給与手取り・所得税・住民税計算ツール（ZEIMO）](https://zeimo.jp/tools/41838)
- [残業代の割増率25%/35%/50%（マネーフォワード）](https://biz.moneyforward.com/payroll/basic/82774/)、[割増賃金の計算方法（神奈川労働局PDF）](https://jsite.mhlw.go.jp/kanagawa-roudoukyoku/content/contents/001107232.pdf)
- [総務省 ふるさと納税のしくみ（税金の控除）](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html)、[ふるさと納税 控除上限額シミュレーション（ふるさとチョイス）](https://www.furusato-tax.jp/about/simulation)、[控除上限シミュレーター2026改正対応（くらしの計算機）](https://calclife.net/tax/furusato)、[2026（令和8年）の限度額（アルビノ）](https://www.albino.co.jp/simulator-hometown-tax/)
- [消費税の軽減税率制度・インボイス制度（国税庁）](https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/index.htm)、[インボイス制度開始（政府広報オンライン）](https://www.gov-online.go.jp/useful/article/202210/1.html)、[適用税率のインボイス記載方法（請求ABC）](https://media.invoice.ne.jp/column/invoices/applicable-tax-rate-invoice.html)
- [新NISAとは（マネックス証券）](https://info.monex.co.jp/nisa/nisa2024/index.html)、[NISAを利用する皆さまへ（金融庁PDF）](https://www.fsa.go.jp/policy/nisa2/about/nisa2024/slide_202406.pdf)、[新NISAは日本株式を押し上げたのか（ニッセイ基礎研究所）](https://www.nli-research.co.jp/report/detail/id=81042?site=nli)
- [住宅ローンシミュレーション（JAバンク）](https://www.jabank.org/money/homeloan_shinki/)、[元利均等返済と元金均等返済どっちがお得（三井住友銀行）](https://www.smbc.co.jp/kojin/money-viva/housing_loan/repayment/)、[住宅ローン金利の計算（イオン銀行）](https://www.aeonbank.co.jp/column/mortgageloan/kinri/keisan/)
- [PayPay請求書払い](https://paypay.ne.jp/guide/bill-payment/)、[PayB（ペイビー）払込票をスマホで支払い](https://payb.jp/)、[スマホで払込票バーコードを読み取るコンビニ決済4社](https://ebisumart.com/blog/sp-haraikomi/)
- [家計簿アプリ くふうZaim](https://zaim.net/)、[家計簿アプリおすすめ比較（マイベスト）](https://my-best.com/2204)、[Zaim vs マネーフォワードME レシート読み取り比較](https://www.money-leaf.net/comparison-receipt/)
- [ごみの分別を調べる（横浜市）](https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/gomi-recycle/gomi/dashikata.html)、[ごみ分別アプリ「さんあ〜る」(App Store)](https://apps.apple.com/jp/app/id977071564)、[ごみスケ](https://gomisuke.jp/)、[資源・ごみ分別アプリ（名古屋市）](https://www.city.nagoya.jp/kurashi/gomi/1012183/1012187/1012188.html)
- [気象庁 防災情報](https://www.jma.go.jp/jma/menu/menuflash.html)、[緊急地震速報（警報）及び（予報）について（気象庁）](https://www.jma.go.jp/jma/kishou/know/jishin/eew/shikumi/shousai.html)、[あなたの街の防災情報（気象庁）](https://www.jma.go.jp/bosai/)、[警報・注意報（tenki.jp）](https://tenki.jp/bousai/warn/)
- [Yahoo!路線情報（乗換案内・時刻表・運行情報）](https://transit.yahoo.co.jp/)、[乗換案内NEXT（ジョルダン）](https://mb.jorudan.co.jp/os/norikae.cgi?c=25&incs=utf8)、[「乗換案内」でSuica・PASMO残高を確認する方法](https://bemate.co.jp/blogkarasu/2026/02/09/ic-card-balance/)、[定期券使用時の運賃計算（JR東日本 Suica）](https://www.jreast.co.jp/en/suica/ic/use/auto_pay/others/commute.html/)
- [郵便番号検索API（zipcloud）](http://zipcloud.ibsnet.co.jp/doc/api)、[JavaScriptで郵便番号から住所を自動入力（kasumiblog）](https://kasumiblog.org/javascript-postcode-address-autofill/)
- [JuDress 日本語住所を英語住所に変換](https://judress.tsukuenoue.com/)、[住所を英語表記に変換「君に届け！」](https://kimini.jp/)、[英語での住所の書き方（Bizmates）](https://www.bizmates.jp/blog/english-address-notation/)
- [文字数カウント（LUFT）](https://www.luft.co.jp/cgi/str_counter.php)、[全角半角変換ツール（データのじかん）](https://data.wingarc.com/zenkaku-hankaku)、[ローマ字ひらがな変換ツール（ラッコ）](https://rakkokeyword.com/techo/tool-romaji-hiragana/)
- [ふりがなアプリ（App Store）](https://apps.apple.com/jp/app/%E3%81%B5%E3%82%8A%E3%81%8C%E3%81%AA/id924351286)、[ふりがな機能（Canva・縦書きルビ対応）](https://www.canva.com/ja_jp/features/furigana/)、[Adding Japanese Ruby / Furigana（JCinfo）](https://www.jcinfo.net/en/tools/kana)
- [履歴書に印鑑は必要？（マイナビ転職）](https://tenshoku.mynavi.jp/knowhow/rirekisho/40/)、[履歴書に印鑑は必要？認印・シャチハタ（リクナビNEXT）](https://next.rikunabi.com/tenshokuknowhow/rirekisho/kihon03/)
- [喪中の年賀状の基本マナー（カメラのキタムラ 2026午年）](https://nenga.kitamura.jp/useful/1106719/)、[喪中はがきはいつ出す（おたより本舗）](https://mochu.jp/mh/page/manner/index.html)、[来年は午年・十二支の由来（富士フイルム）](https://www.postcard.jp/column/34nenga-eto.html)
- [旅行用 通貨換算アプリおすすめ8選（アプリブ）](https://app-liv.jp/lifestyle/all/1479/)、[海外旅行向け通貨換算アプリ（ミサトリップ）](https://misatrip.com/currency-app/)
