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
