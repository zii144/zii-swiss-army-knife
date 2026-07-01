import type { ToolCategory } from '@zii/registry';
import type { Lang } from './i18n';

/** Localized string map — English required, other locales optional (fallback to en). */
export type L10n = { en: string } & Partial<Record<Lang, string>>;

export interface CatalogTool {
  id: string;
  category: ToolCategory;
  offline: boolean;
  keywords: readonly string[];
  name: L10n;
  blurb: L10n;
}

/**
 * The single source of truth for the universal tool catalogue. Drives the
 * registry metadata, the localized UI labels, and the SEO prerenderer, so the
 * three never drift apart.
 */
export const CATALOG: readonly CatalogTool[] = [
  {
    id: 'pdf-merge',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'merge', 'combine', 'join'],
    name: {
      en: 'Merge PDF',
      'zh-TW': '合併 PDF',
      'zh-HK': '合併 PDF',
      ja: 'PDF を結合',
      ko: 'PDF 병합',
      es: 'Unir PDF',
      fr: 'Fusionner des PDF',
      de: 'PDF zusammenfügen',
    },
    blurb: {
      en: 'Combine multiple PDF files into one, right in your browser. Nothing is uploaded.',
      'zh-TW': '在瀏覽器中將多個 PDF 合併為一個，完全不上傳。',
    },
  },
  {
    id: 'image-convert',
    category: 'image',
    offline: true,
    keywords: ['image', 'convert', 'png', 'jpeg', 'jpg', 'webp'],
    name: {
      en: 'Convert image',
      'zh-TW': '影像轉檔',
      'zh-HK': '圖片轉檔',
      ja: '画像を変換',
      ko: '이미지 변환',
      es: 'Convertir imagen',
      fr: 'Convertir une image',
      de: 'Bild umwandeln',
    },
    blurb: {
      en: 'Convert images between PNG, JPEG and WebP on your device.',
      'zh-TW': '在裝置上於 PNG、JPEG、WebP 之間轉換影像。',
    },
  },
  {
    id: 'qr-generate',
    category: 'generator',
    offline: true,
    keywords: ['qr', 'qrcode', 'barcode', 'generate'],
    name: {
      en: 'QR code generator',
      'zh-TW': 'QR Code 產生器',
      'zh-HK': 'QR Code 產生器',
      ja: 'QR コード生成',
      ko: 'QR 코드 생성기',
      es: 'Generador de códigos QR',
      fr: 'Générateur de QR code',
      de: 'QR-Code-Generator',
    },
    blurb: {
      en: 'Generate a QR code from any text or URL, offline.',
      'zh-TW': '離線將任意文字或網址轉成 QR Code。',
    },
  },
  {
    id: 'image-compress',
    category: 'image',
    offline: true,
    keywords: ['image', 'compress', 'shrink', 'optimize', 'jpeg', 'quality'],
    name: {
      en: 'Compress image',
      'zh-TW': '影像壓縮',
      'zh-HK': '圖片壓縮',
      ja: '画像を圧縮',
      ko: '이미지 압축',
      es: 'Comprimir imagen',
      fr: 'Compresser une image',
      de: 'Bild komprimieren',
    },
    blurb: {
      en: 'Shrink JPEG, PNG and WebP images by re-encoding at a chosen quality.',
      'zh-TW': '以指定品質重新編碼，縮小 JPEG／PNG／WebP 影像。',
    },
  },
  {
    id: 'percent-tip',
    category: 'calc',
    offline: true,
    keywords: ['percent', 'percentage', 'tip', 'split', 'change', 'calculator'],
    name: {
      en: 'Percentage & tip',
      'zh-TW': '百分比與小費',
      'zh-HK': '百分比與貼士',
      ja: '割合・チップ計算',
      ko: '퍼센트·팁 계산',
      es: 'Porcentaje y propina',
      fr: 'Pourcentage et pourboire',
      de: 'Prozent & Trinkgeld',
    },
    blurb: {
      en: 'Percentage, percentage-change and tip-split calculator.',
      'zh-TW': '百分比、增減率與小費分攤計算機。',
    },
  },
  {
    id: 'unit-convert',
    category: 'convert',
    offline: true,
    keywords: ['unit', 'convert', 'length', 'mass', 'weight', 'temperature', 'volume'],
    name: {
      en: 'Unit converter',
      'zh-TW': '單位換算',
      'zh-HK': '單位換算',
      ja: '単位変換',
      ko: '단위 변환',
      es: 'Conversor de unidades',
      fr: "Convertisseur d'unités",
      de: 'Einheitenrechner',
    },
    blurb: {
      en: 'Convert length, mass, temperature and volume units.',
      'zh-TW': '換算長度、重量、溫度與體積單位。',
    },
  },
  {
    id: 'text-count',
    category: 'text',
    offline: true,
    keywords: ['count', 'character', 'word', 'line', 'length', 'text'],
    name: {
      en: 'Character & word count',
      'zh-TW': '字數統計',
      'zh-HK': '字數統計',
      ja: '文字数カウント',
      ko: '글자·단어 수 세기',
      es: 'Contador de caracteres y palabras',
      fr: 'Compteur de caractères et de mots',
      de: 'Zeichen- & Wortzähler',
    },
    blurb: {
      en: 'Live character, word and line counts with a CJK-aware breakdown.',
      'zh-TW': '即時統計字元、字詞與行數，並依文字系統分類。',
    },
  },
  {
    id: 'text-case',
    category: 'text',
    offline: true,
    keywords: ['case', 'camel', 'snake', 'kebab', 'title', 'upper', 'lower'],
    name: {
      en: 'Case converter',
      'zh-TW': '大小寫轉換',
      'zh-HK': '大小寫轉換',
      ja: '大文字・小文字変換',
      ko: '대소문자 변환',
      es: 'Conversor de mayúsculas',
      fr: 'Convertisseur de casse',
      de: 'Groß-/Kleinschreibung',
    },
    blurb: {
      en: 'Convert text between camelCase, snake_case, Title, UPPER and more.',
      'zh-TW': '在 camelCase、snake_case、標題、全大寫等格式間轉換。',
    },
  },
  {
    id: 'json-csv',
    category: 'dev',
    offline: true,
    keywords: ['json', 'csv', 'convert', 'data', 'table'],
    name: {
      en: 'JSON ↔ CSV',
    },
    blurb: {
      en: 'Convert an array of JSON objects to CSV and back.',
      'zh-TW': '將 JSON 物件陣列與 CSV 互相轉換。',
    },
  },
  {
    id: 'hash',
    category: 'dev',
    offline: true,
    keywords: ['hash', 'sha', 'sha256', 'sha1', 'checksum', 'digest'],
    name: {
      en: 'Hash (SHA-256 / SHA-1)',
      'zh-TW': '雜湊 (SHA-256 / SHA-1)',
      'zh-HK': '雜湊 (SHA-256 / SHA-1)',
      ja: 'ハッシュ (SHA-256 / SHA-1)',
      ko: '해시 (SHA-256 / SHA-1)',
      es: 'Hash (SHA-256 / SHA-1)',
      fr: 'Hachage (SHA-256 / SHA-1)',
      de: 'Hash (SHA-256 / SHA-1)',
    },
    blurb: {
      en: 'Compute SHA-256 and SHA-1 digests of text on-device.',
      'zh-TW': '在裝置上計算文字的 SHA-256 與 SHA-1 雜湊值。',
    },
  },
  {
    id: 'base64',
    category: 'dev',
    offline: true,
    keywords: ['base64', 'encode', 'decode', 'b64'],
    name: { en: 'Base64 encode / decode', 'zh-TW': 'Base64 編碼／解碼' },
    blurb: {
      en: 'Encode text to Base64 and decode it back, on-device.',
      'zh-TW': '在裝置上將文字編碼為 Base64 或解碼還原。',
    },
  },
  {
    id: 'url-encode',
    category: 'dev',
    offline: true,
    keywords: ['url', 'encode', 'decode', 'percent', 'uri'],
    name: { en: 'URL encode / decode', 'zh-TW': 'URL 編碼／解碼' },
    blurb: {
      en: 'Percent-encode text for URLs and decode it back.',
      'zh-TW': '將文字進行網址百分比編碼或解碼。',
    },
  },
  {
    id: 'json-yaml',
    category: 'dev',
    offline: true,
    keywords: ['json', 'yaml', 'convert', 'config'],
    name: { en: 'JSON ↔ YAML' },
    blurb: {
      en: 'Convert between JSON and YAML.',
      'zh-TW': '在 JSON 與 YAML 之間轉換。',
    },
  },
  {
    id: 'regex-tester',
    category: 'dev',
    offline: true,
    keywords: ['regex', 'regexp', 'pattern', 'match', 'test'],
    name: { en: 'Regex tester', 'zh-TW': '正規表達式測試' },
    blurb: {
      en: 'Test a regular expression against text and see every match.',
      'zh-TW': '以文字測試正規表達式並檢視所有比對結果。',
    },
  },
  {
    id: 'text-diff',
    category: 'text',
    offline: true,
    keywords: ['diff', 'compare', 'text', 'changes'],
    name: { en: 'Text diff', 'zh-TW': '文字比對' },
    blurb: {
      en: 'Compare two blocks of text line by line.',
      'zh-TW': '逐行比較兩段文字。',
    },
  },
  {
    id: 'fullwidth',
    category: 'text',
    offline: true,
    keywords: ['fullwidth', 'halfwidth', '全形', '半形', 'normalize'],
    name: { en: 'Full / half-width', 'zh-TW': '全形／半形轉換' },
    blurb: {
      en: 'Convert between full-width and half-width characters.',
      'zh-TW': '在全形與半形字元之間轉換。',
    },
  },
  {
    id: 'loan-calculator',
    category: 'finance',
    offline: true,
    keywords: ['loan', 'mortgage', 'payment', 'amortization', 'interest'],
    name: { en: 'Loan calculator', 'zh-TW': '貸款計算機' },
    blurb: {
      en: 'Monthly payment and amortization schedule for a loan.',
      'zh-TW': '計算貸款每月還款與攤還表。',
    },
  },
  {
    id: 'bmi',
    category: 'calc',
    offline: true,
    keywords: ['bmi', 'body', 'mass', 'index', 'health', 'weight'],
    name: { en: 'BMI calculator', 'zh-TW': 'BMI 計算機' },
    blurb: {
      en: 'Body mass index from height and weight.',
      'zh-TW': '依身高體重計算身體質量指數。',
    },
  },
  {
    id: 'date-diff',
    category: 'datetime',
    offline: true,
    keywords: ['date', 'days', 'difference', 'age', 'between'],
    name: { en: 'Date & age', 'zh-TW': '日期與年齡' },
    blurb: {
      en: 'Days between dates, add days, and exact age.',
      'zh-TW': '計算日期間隔、加減天數與實際年齡。',
    },
  },
  {
    id: 'qr-scan',
    category: 'generator',
    offline: true,
    keywords: ['qr', 'scan', 'decode', 'read', 'barcode'],
    name: { en: 'QR code scanner', 'zh-TW': 'QR Code 掃描' },
    blurb: {
      en: 'Read the text inside a QR code image.',
      'zh-TW': '讀取 QR Code 影像中的文字。',
    },
  },
  {
    id: 'pdf-split',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'split', 'pages', 'separate', 'extract'],
    name: { en: 'Split PDF', 'zh-TW': '分割 PDF' },
    blurb: {
      en: 'Split a PDF into one file per page.',
      'zh-TW': '將 PDF 依頁拆成多個檔案。',
    },
  },
  {
    id: 'pdf-compress',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'compress', 'shrink', 'reduce', 'size', 'optimize'],
    name: { en: 'Compress PDF', 'zh-TW': '壓縮 PDF' },
    blurb: {
      en: 'Reduce a PDF file size on your device. Nothing is uploaded.',
      'zh-TW': '在裝置上縮小 PDF 檔案大小，完全不上傳。',
    },
  },
  {
    id: 'zip-create',
    category: 'file',
    offline: true,
    keywords: ['zip', 'archive', 'compress', 'bundle', 'files'],
    name: { en: 'Create ZIP', 'zh-TW': '建立 ZIP' },
    blurb: {
      en: 'Bundle several files into one ZIP archive, on your device.',
      'zh-TW': '在裝置上將多個檔案打包成一個 ZIP 壓縮檔。',
    },
  },
  {
    id: 'zip-extract',
    category: 'file',
    offline: true,
    keywords: ['zip', 'extract', 'unzip', 'archive', 'open'],
    name: { en: 'Extract ZIP', 'zh-TW': '解壓 ZIP' },
    blurb: {
      en: 'Open a ZIP archive and download the files inside.',
      'zh-TW': '開啟 ZIP 壓縮檔並下載其中的檔案。',
    },
  },
  {
    id: 'heic-convert',
    category: 'image',
    offline: true,
    keywords: ['heic', 'heif', 'jpg', 'jpeg', 'convert', 'iphone', 'photo'],
    name: { en: 'HEIC → JPG', 'zh-TW': 'HEIC → JPG' },
    blurb: {
      en: 'Convert iPhone HEIC/HEIF photos to JPG on your device.',
      'zh-TW': '在裝置上將 iPhone 的 HEIC／HEIF 相片轉為 JPG。',
    },
  },
  {
    id: 'discount',
    category: 'calc',
    offline: true,
    keywords: ['discount', 'sale', 'price', 'percent', 'off', 'savings'],
    name: { en: 'Discount calculator', 'zh-TW': '折扣計算機' },
    blurb: {
      en: 'Work out a sale price and how much you save.',
      'zh-TW': '計算折扣後價格與省下的金額。',
    },
  },
  {
    id: 'savings',
    category: 'finance',
    offline: true,
    keywords: ['interest', 'savings', 'compound', 'simple', 'investment'],
    name: { en: 'Savings & interest', 'zh-TW': '儲蓄與利息' },
    blurb: {
      en: 'Simple and compound interest on a deposit over time.',
      'zh-TW': '計算存款隨時間累積的單利與複利。',
    },
  },
  {
    id: 'cooking-convert',
    category: 'convert',
    offline: true,
    keywords: ['cooking', 'recipe', 'cup', 'gram', 'ml', 'baking', 'kitchen'],
    name: { en: 'Cooking converter', 'zh-TW': '烹飪單位換算' },
    blurb: {
      en: 'Convert cups, grams and millilitres for common ingredients.',
      'zh-TW': '換算常見食材的杯、公克與毫升。',
    },
  },
  {
    id: 'password',
    category: 'generator',
    offline: true,
    keywords: ['password', 'random', 'secure', 'generate', 'passphrase'],
    name: { en: 'Password generator', 'zh-TW': '密碼產生器' },
    blurb: {
      en: 'Generate strong random passwords in your browser.',
      'zh-TW': '在瀏覽器中產生高強度隨機密碼。',
    },
  },
  {
    id: 'uuid',
    category: 'generator',
    offline: true,
    keywords: ['uuid', 'guid', 'id', 'random', 'v4'],
    name: { en: 'UUID generator', 'zh-TW': 'UUID 產生器' },
    blurb: {
      en: 'Generate random version-4 UUIDs on your device.',
      'zh-TW': '在裝置上產生隨機的第 4 版 UUID。',
    },
  },
  {
    id: 'jwt-decode',
    category: 'dev',
    offline: true,
    keywords: ['jwt', 'token', 'decode', 'json', 'web', 'auth'],
    name: { en: 'JWT decoder', 'zh-TW': 'JWT 解碼' },
    blurb: {
      en: "Decode a JWT's header and payload (no signature check).",
      'zh-TW': '解碼 JWT 的標頭與內容（不驗證簽章）。',
    },
  },
  {
    id: 'base-convert',
    category: 'dev',
    offline: true,
    keywords: ['base', 'binary', 'hex', 'octal', 'decimal', 'radix', 'number'],
    name: { en: 'Number base converter', 'zh-TW': '進位轉換' },
    blurb: {
      en: 'Convert integers between binary, octal, decimal and hex.',
      'zh-TW': '在二、八、十、十六進位之間轉換整數。',
    },
  },
  {
    id: 'color-convert',
    category: 'dev',
    offline: true,
    keywords: ['color', 'colour', 'hex', 'rgb', 'hsl', 'convert'],
    name: { en: 'Color converter', 'zh-TW': '色彩轉換' },
    blurb: {
      en: 'Convert a color between HEX, RGB and HSL.',
      'zh-TW': '在 HEX、RGB、HSL 之間轉換色彩。',
    },
  },
  {
    id: 'cron',
    category: 'dev',
    offline: true,
    keywords: ['cron', 'crontab', 'schedule', 'explain', 'expression'],
    name: { en: 'Cron explainer', 'zh-TW': 'Cron 說明' },
    blurb: {
      en: 'Turn a 5-field cron expression into plain language.',
      'zh-TW': '將 5 欄位的 cron 表達式轉為白話說明。',
    },
  },
  {
    id: 'image-resize',
    category: 'image',
    offline: true,
    keywords: ['image', 'resize', 'scale', 'dimensions', 'pixels'],
    name: { en: 'Resize image', 'zh-TW': '影像尺寸調整' },
    blurb: {
      en: 'Resize an image to exact pixels or fit within a box.',
      'zh-TW': '將影像調整為指定像素或縮放至框內。',
    },
  },
  {
    id: 'image-crop',
    category: 'image',
    offline: true,
    keywords: ['image', 'crop', 'cut', 'trim', 'rectangle'],
    name: { en: 'Crop image', 'zh-TW': '影像裁切' },
    blurb: {
      en: 'Cut a rectangle out of an image by pixel coordinates.',
      'zh-TW': '依像素座標從影像裁下一塊矩形。',
    },
  },
  {
    id: 'exif-strip',
    category: 'image',
    offline: true,
    keywords: ['exif', 'metadata', 'gps', 'strip', 'privacy', 'remove'],
    name: { en: 'Strip image metadata', 'zh-TW': '移除影像中繼資料' },
    blurb: {
      en: 'Remove EXIF/GPS metadata by re-encoding the image.',
      'zh-TW': '重新編碼影像以移除 EXIF／GPS 中繼資料。',
    },
  },
  {
    id: 'favicon',
    category: 'generator',
    offline: true,
    keywords: ['favicon', 'icon', 'app icon', 'png', 'website'],
    name: { en: 'Favicon generator', 'zh-TW': 'Favicon 產生器' },
    blurb: {
      en: 'Turn an image into a set of favicon / app-icon PNGs.',
      'zh-TW': '將圖片轉成一組 favicon／App 圖示 PNG。',
    },
  },
  {
    id: 'pdf-rotate',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'rotate', 'turn', 'orientation', 'landscape'],
    name: { en: 'Rotate PDF', 'zh-TW': '旋轉 PDF' },
    blurb: {
      en: 'Rotate every page of a PDF on your device.',
      'zh-TW': '在裝置上旋轉 PDF 的每一頁。',
    },
  },
  {
    id: 'pdf-watermark',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'watermark', 'stamp', 'confidential', 'text'],
    name: { en: 'Watermark PDF', 'zh-TW': 'PDF 浮水印' },
    blurb: {
      en: 'Stamp a diagonal text watermark across every page.',
      'zh-TW': '為 PDF 每一頁加上斜向文字浮水印。',
    },
  },
  {
    id: 'pdf-organize',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'reorder', 'delete', 'pages', 'organize', 'rearrange'],
    name: { en: 'Organize PDF pages', 'zh-TW': '重整 PDF 頁面' },
    blurb: {
      en: 'Reorder or delete pages by listing the ones to keep.',
      'zh-TW': '依序列出要保留的頁面來重排或刪除頁面。',
    },
  },
  {
    id: 'pdf-page-numbers',
    category: 'pdf',
    offline: true,
    keywords: ['pdf', 'page', 'numbers', 'pagination', 'footer'],
    name: { en: 'Add page numbers', 'zh-TW': '加入頁碼' },
    blurb: {
      en: 'Stamp "n / total" page numbers on each page.',
      'zh-TW': '於每頁加上「n / 總頁數」頁碼。',
    },
  },
  {
    id: 'scientific',
    category: 'calc',
    offline: true,
    keywords: ['scientific', 'calculator', 'math', 'sin', 'cos', 'sqrt', 'expression'],
    name: { en: 'Scientific calculator', 'zh-TW': '科學計算機' },
    blurb: {
      en: 'Evaluate math expressions with functions and constants.',
      'zh-TW': '計算含函數與常數的數學式。',
    },
  },
  {
    id: 'timezone',
    category: 'datetime',
    offline: true,
    keywords: ['timezone', 'time zone', 'meeting', 'world clock', 'planner', 'convert'],
    name: { en: 'Time-zone planner', 'zh-TW': '時區規劃' },
    blurb: {
      en: 'See one moment across major cities and time zones.',
      'zh-TW': '查看同一時刻在世界主要城市的時間。',
    },
  },
  {
    id: 'checksum-validate',
    category: 'id',
    offline: true,
    keywords: ['luhn', 'credit card', 'iban', 'aba', 'routing', 'validate', 'checksum'],
    name: { en: 'Checksum validator', 'zh-TW': '檢查碼驗證' },
    blurb: {
      en: 'Validate a credit-card (Luhn), IBAN or ABA routing number.',
      'zh-TW': '驗證信用卡號（Luhn）、IBAN 或 ABA 代碼。',
    },
  },
  {
    id: 'sales-tax',
    category: 'finance',
    offline: true,
    keywords: ['sales tax', 'vat', 'gst', 'tax', 'net', 'gross'],
    name: { en: 'Sales tax / VAT / GST', 'zh-TW': '銷售稅／VAT' },
    blurb: {
      en: 'Add or extract sales tax (VAT/GST) on an amount.',
      'zh-TW': '在金額上計算或拆分銷售稅（VAT／GST）。',
    },
  },
  {
    id: 'business-days',
    category: 'datetime',
    offline: true,
    keywords: ['business days', 'working days', 'weekdays', 'between', 'dates'],
    name: { en: 'Business days', 'zh-TW': '工作日計算' },
    blurb: {
      en: 'Count working days (weekends excluded) between two dates.',
      'zh-TW': '計算兩日期間的工作日（不含週末）。',
    },
  },
  {
    id: 'zodiac',
    category: 'daily',
    offline: true,
    keywords: ['zodiac', 'chinese', 'animal', 'birth year', '生肖'],
    name: { en: 'Chinese zodiac', 'zh-TW': '生肖' },
    blurb: {
      en: 'Find the Chinese zodiac animal for a birth year.',
      'zh-TW': '依出生年份查詢生肖。',
    },
  },
  {
    id: 'era-convert',
    category: 'datetime',
    offline: true,
    keywords: ['era', 'roc', 'minguo', '民國', 'japanese', '和曆', 'reiwa'],
    name: { en: 'Era converter', 'zh-TW': '紀年轉換' },
    blurb: {
      en: 'Convert a Gregorian date to ROC (Minguo) and Japanese era.',
      'zh-TW': '將西元日期轉換為民國年與日本和曆。',
    },
  },
  {
    id: 'cjk-convert',
    category: 'text',
    offline: true,
    keywords: ['chinese', 'simplified', 'traditional', '繁簡', '简繁', 'opencc', 'cjk'],
    name: { en: 'Chinese converter', 'zh-TW': '繁簡轉換' },
    blurb: {
      en: 'Convert between Simplified and Traditional Chinese (Taiwan idioms).',
      'zh-TW': '在簡體與繁體中文之間轉換（含台灣用語）。',
    },
  },
  {
    id: 'html-entities',
    category: 'dev',
    offline: true,
    keywords: ['html', 'entities', 'escape', 'encode', 'decode', 'ampersand'],
    name: { en: 'HTML entities', 'zh-TW': 'HTML 實體' },
    blurb: {
      en: 'Escape text to HTML entities or decode them back.',
      'zh-TW': '將文字轉為 HTML 實體或解碼還原。',
    },
  },
  {
    id: 'lunar-convert',
    category: 'datetime',
    offline: true,
    keywords: ['lunar', 'chinese calendar', '農曆', '农历', 'ganzhi', 'zodiac'],
    name: { en: 'Lunar calendar', 'zh-TW': '農曆換算' },
    blurb: {
      en: 'Convert a Gregorian date to the Chinese lunar calendar.',
      'zh-TW': '將西元日期轉換為農曆。',
    },
  },
  {
    id: 'rokuyo',
    category: 'daily',
    offline: true,
    keywords: ['rokuyo', '六曜', 'taian', 'butsumetsu', 'japanese', 'calendar'],
    name: { en: 'Rokuyō (六曜)', 'zh-TW': '六曜' },
    blurb: {
      en: 'The Japanese six-day calendar label for a date.',
      'zh-TW': '查詢日本六曜對應日期。',
    },
  },
  {
    id: 'solar-terms',
    category: 'datetime',
    offline: true,
    keywords: ['solar terms', '節氣', '节气', '二十四節氣', 'jieqi', 'sekki'],
    name: { en: 'Solar terms (節氣)', 'zh-TW': '二十四節氣' },
    blurb: {
      en: 'The 24 solar terms for a year, with dates.',
      'zh-TW': '查詢指定年份的二十四節氣與日期。',
    },
  },
];

/** A small accent colour per tool category, shared by the grid, cards, sidebar, and prerender. */
export const CATEGORY_COLOR: Record<string, string> = {
  pdf: '#ef5350',
  image: '#ab47bc',
  text: '#26a69a',
  calc: '#42a5f5',
  convert: '#5c6bc0',
  datetime: '#ec407a',
  id: '#7e57c2',
  finance: '#66bb6a',
  generator: '#ffa726',
  dev: '#8d6e63',
  daily: '#29b6f6',
  file: '#78909c',
};

/** Resolve a category's accent colour, falling back to the app accent. */
export function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? 'var(--accent)';
}

/** All tool ids, in catalogue order. */
export const CATALOG_IDS: readonly string[] = CATALOG.map((t) => t.id);

const BY_ID: ReadonlyMap<string, CatalogTool> = new Map(CATALOG.map((t) => [t.id, t]));

export function getTool(id: string): CatalogTool | undefined {
  return BY_ID.get(id);
}

function pick(map: L10n, lang: Lang): string {
  return map[lang] ?? map.en;
}

/** Localized display name for a tool id, falling back to English then the id. */
export function localizedName(id: string, lang: Lang): string {
  const tool = BY_ID.get(id);
  return tool ? pick(tool.name, lang) : id;
}

/** Localized one-line description for a tool id, falling back to English. */
export function localizedBlurb(id: string, lang: Lang): string {
  const tool = BY_ID.get(id);
  return tool ? pick(tool.blurb, lang) : '';
}
