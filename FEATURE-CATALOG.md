# Zii Swiss Army Knife — Comprehensive Feature Catalog

*A research-backed inventory of everyday office utilities to build into one place.*

Last updated: June 28, 2026

---

## 1. Vision

One app that quietly kills the dozen browser tabs every office worker keeps open: the file converter, the currency check, the "what's 18% of this", the timezone math, the PDF merge, the password generator. The goal is breadth (cover the long tail of small daily tasks) plus trust (most operations run locally, privately, instantly, with no upload and no ads).

The categories below are organized by user intent, not by technology. Each tool is one job done well. The competitive references (IT-Tools, Smallpdf, iLovePDF, CloudConvert, PowerToys, TinyPNG, and the various calculator/text-tool sites) are noted in Sources.

---

## 2. Design principles

- **Local-first / privacy-first.** Wherever technically possible, process in-browser/on-device so files never leave the user's machine. This is the single biggest differentiator of tools like IT-Tools and TinyPNG.
- **Zero friction.** No login required for core tools. Paste-and-go. Remember recent inputs.
- **Batch by default.** Most office pain is doing one operation to 30 files. Every converter/compressor should accept multiple files.
- **Instant + offline.** Tools should work without a network connection where feasible (great as a PWA / desktop app).
- **Universal search.** A command-palette (à la PowerToys Run) to jump to any tool by typing.
- **Consistent UX.** Same layout for every tool: input on top, options on the side, output + copy/download below. History and favorites.
- **No ads, no watermarks, no artificial size caps** on the free tier — the recurring complaint about incumbents.

---

## 3. File conversion

The headline feature. Incumbents (CloudConvert, Convertio, FreeConvert, AnyConv) cover 200–300+ formats. A credible "swiss army knife" needs deep coverage across these families.

### 3.1 Documents
- PDF ⇄ Word (DOCX/DOC), PDF ⇄ Excel (XLSX), PDF ⇄ PowerPoint (PPTX)
- DOCX ⇄ PDF / TXT / RTF / ODT / HTML / Markdown
- Markdown ⇄ HTML ⇄ PDF ⇄ DOCX
- TXT / RTF / ODT / Pages → DOCX / PDF
- HTML → PDF (web page to PDF), EPUB → PDF

### 3.2 Spreadsheets & data
- CSV ⇄ Excel (XLSX/XLS), CSV ⇄ TSV, CSV ⇄ JSON, JSON ⇄ XML, JSON ⇄ YAML, JSON ⇄ TOML
- Excel → PDF, Excel → HTML table, Excel → CSV (per-sheet)
- SQL ⇄ CSV/JSON, JSON → SQL insert statements

### 3.3 Images
- JPG ⇄ PNG ⇄ WebP ⇄ AVIF ⇄ GIF ⇄ BMP ⇄ TIFF
- HEIC/HEIF → JPG/PNG (iPhone photos — very common office pain)
- SVG → PNG/JPG (rasterize) and PNG/JPG → SVG (vectorize)
- RAW camera formats (CR2, NEF, ARW) → JPG/PNG
- ICO ⇄ PNG (favicon/icon work)
- PDF → image (per page) and images → single PDF

### 3.4 Audio
- MP3 ⇄ WAV ⇄ AAC ⇄ FLAC ⇄ OGG ⇄ M4A ⇄ WMA
- Video → audio extraction (MP4 → MP3)
- Bitrate / sample-rate adjustment, mono/stereo, trim

### 3.5 Video
- MP4 ⇄ MOV ⇄ AVI ⇄ MKV ⇄ WebM ⇄ WMV ⇄ FLV
- GIF ⇄ MP4 (and video → animated GIF)
- Resolution / compression / framerate changes, trim & clip

### 3.6 Archives
- ZIP ⇄ RAR ⇄ 7Z ⇄ TAR ⇄ GZ ⇄ BZ2
- Create, extract, inspect contents, password-protect, split into volumes

### 3.7 E-books
- EPUB ⇄ MOBI ⇄ AZW3 ⇄ PDF ⇄ FB2 ⇄ TXT

### 3.8 Fonts & misc
- TTF ⇄ OTF ⇄ WOFF ⇄ WOFF2 ⇄ EOT
- vCard (VCF) ⇄ CSV (contacts), ICS calendar import/export
- Base64 ⇄ file (encode any file to a data URI and back)

---

## 4. PDF toolkit

PDFs are the connective tissue of office work; Smallpdf and iLovePDF prove the demand. A full suite:

- **Organize:** merge, split, extract pages, delete pages, reorder/organize, rotate, crop, add/remove blank pages
- **Optimize:** compress (reduce size), repair corrupted PDF, flatten
- **Convert:** to/from Word, Excel, PowerPoint, JPG, HTML, plus PDF/A archival format
- **Edit:** add text/images/shapes, annotate & highlight, redact (true content removal), add page numbers, headers/footers, watermark, Bates numbering
- **Forms:** fill PDF forms, create fillable forms, flatten form fields, extract form data
- **Security:** password-protect/encrypt, unlock (remove known password), permission controls
- **Sign:** e-signature, request signatures, certificate/digital signature
- **Read & extract:** OCR scanned PDFs into searchable/editable text, extract all images, extract tables to Excel, extract text
- **Compare:** diff two PDF versions

---

## 5. Image tools

Beyond conversion — quick edits people do constantly:

- **Compress** (smart lossy/lossless, like TinyPNG) with batch + size-target mode
- **Resize** to exact pixels, by percentage, or social-media presets (LinkedIn banner, Instagram, YouTube thumbnail, profile photo)
- **Crop** (freeform, fixed aspect ratio, circle)
- **Background remover** (on-device AI) and background replace/color fill
- **Bulk rename / bulk convert / bulk resize**
- **Favicon & app-icon generator** (all sizes + manifest snippet from one image)
- **Image to text (OCR)** in many languages
- **Color picker / eyedropper** from an image, and palette extractor
- **Meme generator** (top/bottom caption), watermark/stamp, add text
- **Upscale / enhance** (AI super-resolution), denoise
- **Photo metadata (EXIF) viewer & stripper** (privacy)
- **Screenshot annotator** (arrows, blur sensitive info, crop)
- **Collage / combine images**, spritesheet maker
- **Placeholder image generator** (dummy images at any dimension)

---

## 6. Text & writing tools

- **Word & character counter** (words, characters, sentences, paragraphs, reading time, keyword density)
- **Case converter** (UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT_CASE)
- **Find & replace** (with regex), remove duplicate lines, sort lines, shuffle, dedupe
- **Text diff / compare** (word- and character-level, Git-style)
- **Remove extra spaces / line breaks**, trim, change line endings (CRLF/LF)
- **Lorem ipsum / dummy text generator** (plain, HTML, Markdown)
- **Slugify** (text → URL slug)
- **Reverse text, count occurrences, extract emails/URLs/numbers from text**
- **Markdown editor + live preview**, Markdown ⇄ HTML, Markdown table generator
- **Spell/grammar check** and **tone/rewrite** helpers
- **Text-to-speech** and **speech-to-text (dictation)**
- **Whitespace / invisible character detector**, Unicode inspector
- **ASCII art / banner generator**, fancy-text (Unicode styles) generator
- **Translate** (multi-language)

---

## 7. Calculators

### 7.1 Everyday
- Basic & scientific calculator (with history tape)
- Percentage calculator (of, increase/decrease, markup, what % is X of Y)
- Tip calculator + bill splitter
- Discount / sale-price calculator
- Fuel cost & mileage, cooking/recipe scaler, fraction calculator
- Random number / dice / coin flip / decision picker

### 7.2 Financial
- Loan / EMI calculator with amortization schedule
- Mortgage calculator (down payment, PMI, 15- vs 30-year compare)
- Interest (simple & compound), savings goal, ROI
- Currency converter (live rates, 150+ currencies)
- Salary calculator (hourly ⇄ annual, gross ⇄ net), overtime
- Tax / VAT / sales-tax calculator, invoice total
- Tip/commission, break-even, profit margin & markup
- Crypto converter, investment/retirement projector

### 7.3 Date & time
- Date difference (days/weeks/months between two dates)
- Add/subtract days/weeks/months from a date
- Age calculator (years, months, days)
- Business-days / working-days calculator (skip weekends & holidays)
- Countdown / deadline timer, week-number lookup
- Time zone converter & world clock, meeting-time finder across zones
- Duration calculator (add up hours), timesheet helper
- Unix timestamp ⇄ human date, cron expression builder & explainer

### 7.4 Health & personal
- BMI, BMR/calorie needs, body-fat
- Due-date, ovulation, pace/running, water intake

### 7.5 Math & science
- Unit-aware scientific/expression evaluator
- Equation solver, matrix ops, statistics (mean/median/SD), permutations
- Base/number-system converter (binary/octal/decimal/hex)
- Roman numeral converter, GPA calculator, ratio/proportion

---

## 8. Converters (units & standards)

- **Unit converter:** length, weight/mass, temperature, area, volume, speed, pressure, energy, power, data storage, fuel economy, angle, time
- **Currency converter** (live + historical)
- **Time zone converter**
- **Number-base converter** (bin/oct/dec/hex + arbitrary base)
- **Data-size converter** (bits/bytes/KB/MB/GB/TB, decimal vs binary)
- **Cooking measurement converter** (cups/grams/ml, oven temps)
- **Shoe / clothing size converter** (US/EU/UK)
- **Roman numerals, color-format converter** (HEX/RGB/HSL/CMYK)
- **Coordinate converter** (lat/long formats)

---

## 9. Data & developer tools

Even non-developers in office roles hit these via exported data and configs.

- **JSON:** format/beautify, minify, validate, JSON ⇄ YAML ⇄ XML ⇄ CSV ⇄ TOML, JSONPath query, tree viewer
- **CSV:** viewer/editor, CSV ⇄ JSON/Excel, column splitter, dedupe, sort/filter
- **SQL formatter / minifier**
- **XML / HTML formatter & minifier**, HTML entity encode/decode
- **Regex tester** with live match highlighting and cheat sheet
- **Diff checker** (text, JSON, code)
- **URL encode/decode, query-string parser/builder**
- **Cron expression generator & explainer**
- **Markdown ⇄ HTML, table generators** (Markdown/HTML/ASCII)
- **Mock/sample data generator** (names, addresses, emails, fake JSON)
- **Code beautifier/minifier** (JS, CSS, HTML)

---

## 10. Encoding, crypto & security

- **Base64 encode/decode** (text & files), Base32, Base58
- **URL encode/decode, HTML encode/decode**
- **Hash generator** (MD5, SHA-1, SHA-256, SHA-512), file checksum/verify
- **HMAC generator**
- **Bcrypt** hash & compare
- **JWT decoder/inspector**
- **Encrypt/decrypt text** (AES) with passphrase
- **RSA / key-pair generator**
- **Password generator** (length, symbols, pronounceable, bulk) + **password strength meter**
- **Passphrase generator** (word-based)
- **UUID / GUID / ULID / NanoID generator**
- **2FA / TOTP code generator** (from secret)
- **Random string / token / API-key generator**
- **Escape/unescape** (JSON, SQL, regex, shell)

---

## 11. Generators

- **QR code generator** (URL, text, Wi-Fi, vCard, email, SMS, with logo/colors) + **QR/barcode scanner & decoder**
- **Barcode generator** (EAN, UPC, Code128, etc.)
- **Password / passphrase / PIN generator**
- **UUID / ID generators** (see §10)
- **Lorem ipsum / dummy data** (see §6, §9)
- **Color palette generator**, gradient generator (CSS)
- **Signature generator** (draw/type, export PNG)
- **Email signature builder**
- **Invoice / receipt generator** (export PDF)
- **Slug / username / hashtag generators**
- **.gitignore / robots.txt / meta-tag / Open Graph generators**
- **Chart/graph maker** from pasted data (export PNG/SVG)

---

## 12. Color & design

- **Color picker / eyedropper**, screen color picker (PowerToys-style)
- **Color converter** (HEX/RGB/HSL/HSV/CMYK)
- **Palette extractor from image**, palette generator, contrast checker (WCAG accessibility)
- **CSS gradient generator, shadow generator, border-radius previewer**
- **Image color count / dominant colors**

---

## 13. Network & IT utilities

- **IP lookup** (what's my IP, geolocation), IPv4/IPv6 info
- **Subnet calculator (CIDR)**, MAC address lookup
- **DNS lookup, WHOIS, ping/traceroute helper**
- **HTTP status code reference, MIME type lookup**
- **User-agent parser**
- **URL expander/shortener, link preview/unfurl checker**
- **Port reference, HTTP headers inspector**

---

## 14. Productivity & quick utilities

- **Universal command palette / quick launcher** (jump to any tool by name)
- **Clipboard manager / clipboard history**
- **Notes / scratchpad** (auto-saved), sticky notes
- **Pomodoro timer, stopwatch, countdown, alarms**
- **World clock & meeting scheduler across time zones**
- **To-do / checklist**
- **Screen ruler, color picker, screenshot tool** (PowerToys-inspired)
- **Bulk file renamer** (find/replace, regex, sequential numbering — like PowerRename)
- **Duplicate file finder, large file finder, empty-folder cleaner**
- **Text expander / snippets**
- **Unit-aware quick calculator in the search bar** (type "18% of 240")
- **Keyboard shortcut cheat-sheets** for common apps

---

## 15. Office-specific helpers

- **Email tools:** signature builder, subject-line/character counter, "out of office" generator, mail-merge from CSV
- **Meeting tools:** time-zone meeting finder, agenda template, meeting-cost calculator (attendees × hourly rate × duration)
- **Document templates:** invoice, receipt, resume/CV, cover letter, letterhead, memo, NDA, quote/estimate
- **Spreadsheet helpers:** formula explainer, column-letter ⇄ number, range generator, CSV cleaner
- **Presentation helpers:** aspect-ratio/slide-size reference, image-to-slide
- **Naming & formatting:** phone-number formatter, address formatter, name capitalizer
- **Reference cards:** paper sizes (A4/Letter), shipping/label sizes, file-format cheat sheet

---

## 16. Cross-cutting features

- **Batch processing** on every applicable tool
- **History & favorites** per tool; pin most-used tools to a dashboard
- **Dark mode, multi-language UI**
- **PWA / installable desktop app, full offline mode**
- **Drag-and-drop everywhere**, paste-from-clipboard, share-target integration
- **Keyboard-first navigation** + global hotkey to summon the app
- **No-account core**, optional sync for history/favorites
- **Export anywhere:** copy, download, or send result straight into the next tool (chaining)
- **Accessibility:** screen-reader labels, high-contrast, scalable text

---

## 17. Suggested build phases

**Phase 1 — MVP (highest daily frequency, lowest build cost):**
File converter (documents + images + CSV/Excel), PDF merge/split/compress/convert, percentage & tip & loan calculators, currency converter, unit converter, time-zone converter, word counter, case converter, QR generator, password generator, Base64/URL encode-decode, JSON formatter, color picker.

**Phase 2 — Depth:**
Full PDF suite (edit, OCR, sign, redact), audio/video/archive conversion, image compress/resize/background-remove, full calculator library, data/dev tools (regex, diff, YAML/XML), hash/crypto suite, clipboard manager, bulk renamer.

**Phase 3 — Differentiators:**
Command palette + offline PWA, batch everything, tool-chaining, AI helpers (summarize/rewrite/translate, AI background removal & upscaling), document templates, email/meeting helpers, sync.

---

## 18. Key takeaways

The market is fragmented across single-purpose sites; the opportunity is consolidation with a trust angle. Three things consistently win users away from incumbents:

1. **Privacy** — process locally, no uploads (IT-Tools and TinyPNG built loyalty this way).
2. **No artificial limits** — no watermarks, file-size caps, or paywalls on basic conversions (the top complaint about Smallpdf/iLovePDF free tiers).
3. **Speed & breadth in one place** — one searchable app instead of ten bookmarked tabs.

---

## Sources

- [IT-Tools (CorentinTh) — GitHub](https://github.com/CorentinTh/it-tools) and [it-tools.tech](https://it-tools.tech)
- [IT-Tools overview — Coders' Compass](https://coderscompass.org/articles/it-tools-self-hosted-collection-of-developer-tools-and-it-utilities/)
- [CloudConvert](https://cloudconvert.com/), [Convertio](https://convertio.co/), [FreeConvert](https://www.freeconvert.com/), [AnyConv](https://anyconv.com/), [online-convert](https://www.online-convert.com/)
- [Smallpdf — all PDF tools](https://smallpdf.com/pdf-tools) and [iLovePDF](https://www.ilovepdf.com/)
- [Microsoft PowerToys — Microsoft Learn](https://learn.microsoft.com/en-us/windows/powertoys/) and [GitHub](https://github.com/microsoft/powertoys)
- [TinyPNG](https://tinypng.com/), [ImageResizer.com](https://imageresizer.com/), [OneClickUse image tools](https://oneclickuse.com/image-tools/)
- [The Calculator Site](https://www.thecalculatorsite.com/), [KwikSum calculators](https://kwiksum.com/), [Free Calculator Suite](https://finance.quickyla.com/calculators/mortgage/)
- [FreeFormatter (JSON/CSV/regex)](https://www.freeformatter.com/), [JSONFormatter.org](https://jsonformatter.org/), [WordCounter.net](https://wordcounter.net/)
- [Best Online File Conversion Tools — TechBullion](https://techbullion.com/best-online-file-conversion-tools-for-daily-work/)
- [20 Office Productivity Tools — TextExpander](https://textexpander.com/blog/office-productivity-tools)
- [Best Productivity Tools — Digital Project Manager](https://thedigitalprojectmanager.com/tools/best-productivity-tools/)
