import type { ToolCategory } from '@zii/registry';
import type { Lang } from './i18n';
import type { L10n } from './catalog';

/** Display order for category sections and filter chips. */
export const CATEGORY_ORDER: readonly ToolCategory[] = [
  'pdf',
  'image',
  'text',
  'dev',
  'calc',
  'finance',
  'convert',
  'datetime',
  'generator',
  'id',
  'file',
  'daily',
];

/** Localized display names per category (English required, others fall back to en). */
const CATEGORY_LABELS: Record<string, L10n> = {
  pdf: { en: 'PDF' },
  image: {
    en: 'Image',
    'zh-TW': '影像',
    'zh-HK': '圖片',
    ja: '画像',
    ko: '이미지',
    es: 'Imagen',
    fr: 'Image',
    de: 'Bild',
  },
  text: {
    en: 'Text',
    'zh-TW': '文字',
    'zh-HK': '文字',
    ja: 'テキスト',
    ko: '텍스트',
    es: 'Texto',
    fr: 'Texte',
    de: 'Text',
  },
  dev: {
    en: 'Developer',
    'zh-TW': '開發者',
    'zh-HK': '開發者',
    ja: '開発者',
    ko: '개발자',
    es: 'Desarrollo',
    fr: 'Développeur',
    de: 'Entwickler',
  },
  calc: {
    en: 'Calculators',
    'zh-TW': '計算機',
    'zh-HK': '計算機',
    ja: '計算ツール',
    ko: '계산기',
    es: 'Calculadoras',
    fr: 'Calculatrices',
    de: 'Rechner',
  },
  finance: {
    en: 'Finance',
    'zh-TW': '財務',
    'zh-HK': '財務',
    ja: '金融',
    ko: '금융',
    es: 'Finanzas',
    fr: 'Finance',
    de: 'Finanzen',
  },
  convert: {
    en: 'Converters',
    'zh-TW': '轉換工具',
    'zh-HK': '轉換工具',
    ja: '変換ツール',
    ko: '변환기',
    es: 'Conversores',
    fr: 'Convertisseurs',
    de: 'Konverter',
  },
  datetime: {
    en: 'Date & time',
    'zh-TW': '日期時間',
    'zh-HK': '日期時間',
    ja: '日付・時刻',
    ko: '날짜·시간',
    es: 'Fecha y hora',
    fr: 'Date et heure',
    de: 'Datum & Uhrzeit',
  },
  generator: {
    en: 'Generators',
    'zh-TW': '產生器',
    'zh-HK': '產生器',
    ja: '生成ツール',
    ko: '생성기',
    es: 'Generadores',
    fr: 'Générateurs',
    de: 'Generatoren',
  },
  id: {
    en: 'Identity',
    'zh-TW': '證件',
    'zh-HK': '證件',
    ja: 'ID',
    ko: '신원',
    es: 'Identidad',
    fr: 'Identité',
    de: 'Identität',
  },
  file: {
    en: 'Files',
    'zh-TW': '檔案',
    'zh-HK': '檔案',
    ja: 'ファイル',
    ko: '파일',
    es: 'Archivos',
    fr: 'Fichiers',
    de: 'Dateien',
  },
  daily: {
    en: 'Everyday',
    'zh-TW': '日常',
    'zh-HK': '日常',
    ja: '日常',
    ko: '일상',
    es: 'Diario',
    fr: 'Quotidien',
    de: 'Alltag',
  },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  pdf: 'Merge, split, compress, rotate, watermark, organize, and convert PDF files in the browser.',
  image:
    'Convert, compress, resize, crop, clean metadata, OCR, and edit images locally in the browser.',
  text: 'Count, clean, transform, compare, encode, decode, and normalize text without uploading it.',
  dev: 'Format, convert, encode, decode, inspect, and generate developer data directly in the browser.',
  calc: 'Run practical everyday calculators for percentages, discounts, health, math, finance, and more.',
  finance:
    'Calculate prices, savings, tax, loans, currency conversions, and payroll-related figures.',
  convert:
    'Convert units, files, media, office documents, dates, data formats, and measurements privately.',
  datetime:
    'Work with dates, times, durations, time zones, calendars, holidays, eras, and lunar dates.',
  generator:
    'Generate QR codes, passwords, IDs, placeholder text, barcodes, and other useful assets.',
  id: 'Validate regional identity numbers, postal codes, phone numbers, bank formats, and business IDs.',
  file: 'Create, inspect, extract, and convert files and archives in a browser-first utility workspace.',
  daily:
    'Handle everyday chores such as reminders, formatting, planning, quick checks, and small tasks.',
};

const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  pdf: ['pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf converter'],
  image: ['image tools', 'image converter', 'compress image', 'resize image', 'ocr'],
  text: ['text tools', 'word counter', 'case converter', 'text cleaner', 'text formatter'],
  dev: ['developer tools', 'json tools', 'csv converter', 'base64', 'hash generator'],
  calc: ['calculator', 'percentage calculator', 'scientific calculator', 'bmi calculator'],
  finance: ['finance calculator', 'loan calculator', 'sales tax', 'currency converter'],
  convert: ['unit converter', 'file converter', 'measurement converter', 'media converter'],
  datetime: ['date calculator', 'time zone converter', 'calendar tools', 'timestamp converter'],
  generator: ['generator tools', 'qr code generator', 'password generator', 'uuid generator'],
  id: ['id validator', 'postal code checker', 'phone validator', 'business id validator'],
  file: ['file tools', 'zip tools', 'archive tools', 'file converter'],
  daily: ['everyday tools', 'daily utilities', 'browser utilities', 'offline tools'],
};

/** Localized label for a category, falling back to English then the raw key. */
export function categoryLabel(category: string, lang: Lang): string {
  const map = CATEGORY_LABELS[category];
  if (!map) return category;
  return map[lang] ?? map.en;
}

/** Search-oriented description for category landing pages and LLM indexes. */
export function categoryDescription(category: string): string {
  return CATEGORY_DESCRIPTIONS[category] ?? `${category} tools for everyday browser workflows.`;
}

/** Search-oriented keyword set for category landing pages. */
export function categoryKeywords(category: string): readonly string[] {
  return CATEGORY_KEYWORDS[category] ?? [category, `${category} tools`, 'browser tools'];
}

/**
 * Given a set of tools, return the categories that actually have tools,
 * in display order.
 */
export function presentCategories(categories: Iterable<string>): ToolCategory[] {
  const have = new Set(categories);
  return CATEGORY_ORDER.filter((c) => have.has(c));
}
