# Zii Office Kit Plan

*A product plan for turning Zii from a useful utility collection into a serious office workbench.*

Last updated: July 1, 2026

---

## 1. Product Direction

Zii should become a **privacy-first office utility kit**, not a Microsoft Office clone.

Microsoft 365 owns full document creation and collaboration. Adobe Acrobat, Smallpdf, iLovePDF, CloudConvert, and similar tools own specific parts of PDF and file conversion workflows. Zii can win the practical middle layer:

> Everything an office worker does around files, PDFs, images, spreadsheets, data cleanup, signatures, calculations, forms, and daily admin. Fast, private, local-first.

The product should feel like a dependable office workbench: open it, drop a file or paste data, finish the task, leave with a clean result.

---

## 2. Positioning

### Short Positioning

**Private office tools for files, PDFs, data, and daily work. No uploads. No accounts. Works in your browser.**

### What Zii Is

- A local-first toolkit for everyday office tasks.
- A privacy-safe alternative to random upload-based file tools.
- A cross-market office companion with localized tools for Taiwan, Hong Kong, Japan, and English-speaking regions.
- A lightweight workbench for people who need to process files and information quickly.

### What Zii Is Not

- Not a Word, Excel, or PowerPoint replacement.
- Not a full team collaboration suite at first.
- Not a cloud drive.
- Not an AI-first document product where users must upload sensitive files by default.

---

## 3. Target Users

### Primary Users

- Office workers handling PDFs, forms, screenshots, CSV exports, spreadsheets, and admin tasks.
- Students and teachers preparing documents, assignments, scans, and file submissions.
- Freelancers and small businesses creating invoices, receipts, signatures, and client-ready files.
- Developers and operations teams cleaning JSON, CSV, URLs, hashes, IDs, and text.
- Local-market users who need daily utilities such as tax, payroll, ID validation, holidays, and local document formats.

### Daily Jobs To Win

- "Make this file small enough to email."
- "Convert this image or HEIC photo into a usable format."
- "Merge these PDFs and reorder the pages."
- "Turn these images into one PDF."
- "Clean this CSV or JSON export."
- "Calculate payment, date, tax, salary, or currency quickly."
- "Generate a QR code, password, UUID, invoice, or signature."
- "Handle a local form, ID number, salary calculation, or holiday rule."

---

## 4. Product Pillars

### 4.1 PDF Kit

PDF is the strongest office anchor. Zii needs a full PDF surface before it can feel like an office kit.

### Current Coverage

- Merge PDF
- Split PDF

### Near-Term Missing Tools

- Compress PDF
- Rotate PDF
- Delete pages
- Reorder pages
- Extract pages
- Images to PDF
- PDF to images
- Add watermark
- Add page numbers
- Protect PDF with password
- Unlock PDF with known password

### Later Tools

- OCR scanned PDF
- Redact PDF
- Fill PDF forms
- Sign PDF
- Compare PDFs
- Extract tables to CSV/XLSX
- PDF to Word/Excel/PowerPoint

### Key Workflow

**Prepare PDF for sending:** compress, reorder, delete pages, add page numbers, sign, download.

---

### 4.2 File Converter Kit

File conversion is a major acquisition category. Zii should start with high-frequency office formats, then expand.

### Priority Conversions

- HEIC/HEIF to JPG, PNG, WebP, or PDF
- JPG/PNG/WebP to PDF
- CSV to XLSX and XLSX to CSV
- DOCX to PDF
- PPTX to PDF
- Markdown to HTML/PDF/DOCX
- ZIP create/extract
- Image batch conversion

### Later Conversions

- Audio/video conversion
- EPUB/PDF conversion
- Font conversion
- Archive formats beyond ZIP
- Cloud/offline hybrid document conversion for formats that need heavier workers

### Key Workflow

**Fix file compatibility:** upload nothing, convert locally where possible, download clean output.

---

### 4.3 Spreadsheet And Data Kit

Many office workers do not think of themselves as developers, but they constantly handle exported data.

### Current Coverage

- JSON to CSV
- CSV to JSON
- JSON to YAML
- YAML to JSON

### Near-Term Missing Tools

- JSON formatter and validator
- CSV viewer
- CSV cleaner
- Deduplicate rows
- Sort and filter rows
- Split/merge columns
- Find duplicate values
- Convert CSV to XLSX
- Convert XLSX to CSV
- Table to Markdown
- Table to HTML

### Later Tools

- Chart generator from pasted data
- Pivot-style summary
- SQL insert generator
- Data anonymizer
- Spreadsheet formula helper

### Key Workflow

**Clean exported data:** paste or drop a file, normalize columns, remove duplicates, export CSV/XLSX.

---

### 4.4 Image Kit

Images are high-frequency office inputs: screenshots, scanned IDs, receipts, profile photos, web assets, and submission forms.

### Current Coverage

- Image compress
- Image convert between PNG, JPEG, and WebP

### Near-Term Missing Tools

- Image resize
- Image crop
- HEIC conversion UI
- EXIF viewer and stripper
- Background remover
- Image to text OCR
- Screenshot annotator
- Favicon/app icon generator

### Key Workflow

**Prepare image for upload:** convert, resize, compress, strip metadata, download.

---

### 4.5 Calculator And Admin Kit

Calculators create repeat usage. Office users need both universal calculators and local-market calculators.

### Current Coverage

- Percentage and tip
- Unit converter
- Date and age
- BMI
- Loan calculator

### Near-Term Missing Tools

- Currency converter
- Sales tax/VAT/GST calculator
- Discount calculator
- Business days calculator
- Timesheet/duration calculator
- Salary gross/net calculator
- Invoice total calculator
- Compound interest calculator
- Mortgage calculator

### Local Extensions

- Taiwan payroll, labor insurance, health insurance, pension, and tax.
- Hong Kong salaries tax, MPF, stamp duty, and public holidays.
- Japan take-home pay, era calendar, rokuyo, furusato tax, and postal tools.
- US/UK/CA/AU paycheck, sales tax/VAT/GST, mortgage, and retirement calculators.

### Key Workflow

**Answer office math instantly:** calculate, copy result, export or save assumptions.

---

### 4.6 Generator And Identity Kit

Generators are small but sticky tools. They are easy to ship and help the app feel complete.

### Current Coverage

- QR code generator
- QR code scanner
- Hash
- Base64
- URL encode/decode

### Near-Term Missing Tools

- Password generator
- Passphrase generator
- UUID/ULID generator
- Barcode generator
- JWT decoder
- File checksum
- HMAC generator
- Wi-Fi QR code
- vCard QR code
- Event QR code
- Email signature builder
- Simple signature image generator

### Identity And Validation Tools

- Taiwan National ID and UBN validation
- Hong Kong HKID validation
- Japan My Number, corporate number, and invoice registration validation
- Luhn, ABA routing, IBAN validation

### Key Workflow

**Generate or validate small office identifiers:** copy, export, or embed in document workflows.

---

### 4.7 Local Daily Office Kit

This is the retention moat. Generic competitors can copy a PDF compressor, but they are less likely to build deep Taiwan, Hong Kong, Japan, and region-specific office tools.

### Taiwan

- Invoice lottery checker
- ROC/Gregorian/lunar date conversion
- Public holidays and make-up workday logic
- Payroll and take-home pay
- National ID and UBN validation
- Postal code and address tools
- Traditional/Simplified Chinese and full-width/half-width tools

### Hong Kong

- HKID and BR validation
- MPF and salaries tax calculators
- General/statutory holiday tools
- Weather warnings and AQHI
- Transit ETA integrations where feasible
- Traditional/Simplified Chinese and Jyutping tools

### Japan

- Japanese era conversion
- Rokuyo and lunar calendar
- Take-home pay
- My Number and corporate number validation
- Postal code to address
- Full-width/half-width, furigana, and text tools
- Garbage collection and local reminders where data is available

### English Regions

- E-signature workflow
- Paycheck calculator
- Sales tax/VAT/GST
- Time-zone meeting planner
- Imperial/metric and cooking conversion
- Mortgage and retirement calculators
- Luhn, ABA, IBAN, SIN, TFN, and related validators

---

## 5. Experience Principles

### 5.1 One Job Per Tool

Each tool should do one office job clearly. Avoid giant multi-mode screens unless the workflow naturally belongs together.

### 5.2 Workflow Bundles

Individual tools are useful, but office users think in workflows. Build bundles around common jobs:

- Prepare PDF for email
- Convert phone photos to submission PDF
- Clean CSV export
- Create invoice and QR code
- Scan receipt to expense data
- Sign and send document

### 5.3 Batch By Default

Office work is often repetitive. Most file tools should support:

- Multiple files
- Reordering
- Batch processing
- Per-file status
- Download all as ZIP

### 5.4 Local-First Proof

Privacy should be visible and verifiable:

- Per-tool "processed on this device" label
- No-upload explanation
- Network verification guide
- Clear exception labels for any tool that needs a backend
- No silent upload of sensitive data

### 5.5 Fast Return Loops

Help users come back:

- Favorites
- Recent tools
- Recent settings
- Pinned workflows
- Local-only history
- Optional encrypted sync later

---

## 6. Product Roadmap

### Phase 1: Office Tool MVP

Goal: become useful for common office file tasks every day.

### Ship

- PDF compress
- Image resize
- HEIC/HEIF conversion UI
- JPG/PNG/WebP to PDF
- PDF rotate/delete/reorder
- Password generator
- UUID generator
- JSON formatter/validator
- File hash/checksum
- ZIP create/extract UI
- Command palette
- Favorites/recent tools

### Exit Criteria

- At least 35 usable tools.
- Top office tools are reachable in under 2 clicks.
- PDF/image tools handle common mobile file sizes.
- Full app typecheck, lint, tests, and build pass.

---

### Phase 2: Strong PDF And File Workbench

Goal: make Zii credible against PDF and conversion incumbents for everyday office work.

### Ship

- PDF to images
- Images to PDF with layout options
- Page numbers
- Watermark
- Protect/unlock PDF
- Batch image convert/compress/resize
- CSV/XLSX conversion
- Markdown/HTML/PDF conversion
- Download all as ZIP
- Better file-size and memory warnings

### Exit Criteria

- PDF kit covers core organize, optimize, and convert workflows.
- Image kit supports batch office workflows.
- Users can complete "prepare file for email" end to end.

---

### Phase 3: Office Admin Kit

Goal: add document admin and small-business workflows.

### Ship

- Invoice generator
- Receipt generator
- Email signature builder
- Signature image generator
- Form filler basics
- Business day calculator
- Timesheet/duration calculator
- Currency converter with dated rates
- Sales tax/VAT/GST calculator
- Salary gross/net calculator foundations

### Exit Criteria

- Zii is useful for small businesses and freelancers.
- Outputs can be copied, downloaded, or reused across tools.
- Financial and tax-related tools show effective dates and source metadata.

---

### Phase 4: Local Market Packs

Goal: create defensible retention through local office and daily admin utilities.

### Taiwan MVP

- ROC/Gregorian/lunar calendar
- Public holiday and make-up workday tools
- National ID and UBN validator
- Payroll/take-home pay
- Invoice lottery checker

### Hong Kong MVP

- HKID validator
- MPF and salaries tax calculator
- General/statutory holiday tool
- Weather warning dashboard

### Japan MVP

- Japanese era converter
- Rokuyo calendar
- My Number/corporate number validator
- Postal code/address tool
- Take-home pay calculator

### English Region MVP

- Paycheck calculator
- Time-zone meeting planner
- Sales tax/VAT/GST
- E-signature MVP
- Mortgage calculator

### Exit Criteria

- Each active market has at least 5 sticky local tools.
- Every local data-backed tool has source, version, and effective date.
- Local tools appear in search, SEO pages, and market-specific navigation.

---

### Phase 5: Desktop, Mobile, And AI Assistant

Goal: make Zii feel like a real office kit across devices.

### Ship

- Mobile share-sheet file intake
- Camera scan to PDF
- Native OCR on mobile
- Push reminders for local office tasks
- Desktop app for heavy files
- AI tool router
- AI receipt/document prefill with explicit privacy boundary

### Exit Criteria

- Mobile users can scan, convert, compress, and share files smoothly.
- Desktop users can process larger batches.
- AI never silently uploads sensitive files.

---

## 7. Immediate Build Priority

The next sprint should focus on the fastest route from current app status to office-kit credibility.

| Priority | Feature | Why |
|----------|---------|-----|
| 1 | PDF compress | Highest missing office hero tool. |
| 2 | Image resize | Common upload/form requirement. |
| 3 | HEIC conversion UI | Solves iPhone-to-office compatibility pain. |
| 4 | Image to PDF | Common school, admin, and expense workflow. |
| 5 | PDF rotate/delete/reorder | Makes PDF kit feel practical, not shallow. |
| 6 | Password and UUID generator | Quick dev/admin utility wins. |
| 7 | JSON formatter/validator | High-frequency office/dev data task. |
| 8 | File checksum | Extends current hash tool to real files. |
| 9 | ZIP create/extract UI | Uses existing engine capability. |
| 10 | Command palette and favorites | Makes the app feel like a workbench. |

---

## 8. Success Metrics

### Product Metrics

- Tools per session
- Repeat usage by week
- Favorites usage
- Batch operations per session
- PDF/image workflow completion rate
- Local-market tool retention

### Technical Metrics

- Client-side operation success rate
- p95 processing time for normal files
- Bundle size by tool chunk
- Mobile memory failure rate
- Build, typecheck, lint, and test status

### Trust Metrics

- Percentage of tools that run fully local
- Number of tools with explicit backend requirement
- Number of data-backed tools with source/effective date
- User-visible privacy proof coverage

---

## 9. Strategic Rule

Do not build a giant directory of shallow tools.

Build a small number of deeply useful office workflows first, then expand the catalog around them.

The winning sequence is:

1. PDF and image office heroes.
2. File conversion and data cleanup.
3. Calculators and admin generators.
4. Local-market retention tools.
5. Desktop, mobile, and AI assistant.

That is how Zii becomes an office kit.

