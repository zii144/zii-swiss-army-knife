import type { Market, ToolEntry, ToolRegistry } from '@zii/registry';
import type { Lang } from './i18n';
import type { L10n } from './catalog';

/** Markets exposed in the app shell's market <select>. */
export const SELECTABLE_MARKETS: readonly Market[] = [
  'global',
  'tw',
  'hk',
  'jp',
  'en-us',
  'en-gb',
  'en-ca',
  'en-au',
  'ko',
  'de',
  'fr',
  'es',
  'it',
  'nl',
  'en-sg',
  'en-in',
  'pt',
  'br',
  'mx',
  'pl',
  'en-nz',
] as const;

/** Localized labels for the selectable markets (English required, others fall back). */
export const MARKET_LABELS: Readonly<Record<Market, L10n>> = {
  global: {
    en: 'Global',
    'zh-TW': '全球',
    'zh-HK': '全球',
    ja: 'グローバル',
    ko: '글로벌',
    es: 'Global',
    fr: 'Mondial',
    de: 'Global',
  },
  tw: {
    en: 'Taiwan',
    'zh-TW': '台灣',
    'zh-HK': '台灣',
    ja: '台湾',
    ko: '대만',
    es: 'Taiwán',
    fr: 'Taïwan',
    de: 'Taiwan',
  },
  hk: {
    en: 'Hong Kong',
    'zh-TW': '香港',
    'zh-HK': '香港',
    ja: '香港',
    ko: '홍콩',
    es: 'Hong Kong',
    fr: 'Hong Kong',
    de: 'Hongkong',
  },
  jp: {
    en: 'Japan',
    'zh-TW': '日本',
    'zh-HK': '日本',
    ja: '日本',
    ko: '일본',
    es: 'Japón',
    fr: 'Japon',
    de: 'Japan',
  },
  'en-us': {
    en: 'US (English)',
    'zh-TW': '美國（英文）',
    'zh-HK': '美國（英文）',
    ja: '米国（英語）',
    ko: '미국(영어)',
    es: 'EE. UU. (inglés)',
    fr: 'États-Unis (anglais)',
    de: 'USA (Englisch)',
  },
  'en-gb': {
    en: 'UK (English)',
    'zh-TW': '英國（英文）',
    'zh-HK': '英國（英文）',
    ja: '英国（英語）',
    ko: '영국(영어)',
    es: 'Reino Unido (inglés)',
    fr: 'Royaume-Uni (anglais)',
    de: 'UK (Englisch)',
  },
  'en-ca': {
    en: 'Canada (English)',
    'zh-TW': '加拿大（英文）',
    'zh-HK': '加拿大（英文）',
    ja: 'カナダ（英語）',
    ko: '캐나다(영어)',
    es: 'Canadá (inglés)',
    fr: 'Canada (anglais)',
    de: 'Kanada (Englisch)',
  },
  'en-au': {
    en: 'Australia (English)',
    'zh-TW': '澳洲（英文）',
    'zh-HK': '澳洲（英文）',
    ja: 'オーストラリア（英語）',
    ko: '호주(영어)',
    es: 'Australia (inglés)',
    fr: 'Australie (anglais)',
    de: 'Australien (Englisch)',
  },
  ko: {
    en: 'Korea',
    'zh-TW': '韓國',
    'zh-HK': '韓國',
    ja: '韓国',
    ko: '한국',
    es: 'Corea',
    fr: 'Corée',
    de: 'Korea',
  },
  de: {
    en: 'Germany',
    'zh-TW': '德國',
    'zh-HK': '德國',
    ja: 'ドイツ',
    ko: '독일',
    es: 'Alemania',
    fr: 'Allemagne',
    de: 'Deutschland',
  },
  fr: {
    en: 'France',
    'zh-TW': '法國',
    'zh-HK': '法國',
    ja: 'フランス',
    ko: '프랑스',
    es: 'Francia',
    fr: 'France',
    de: 'Frankreich',
  },
  es: {
    en: 'Spain',
    'zh-TW': '西班牙',
    'zh-HK': '西班牙',
    ja: 'スペイン',
    ko: '스페인',
    es: 'España',
    fr: 'Espagne',
    de: 'Spanien',
  },
  it: {
    en: 'Italy',
    'zh-TW': '義大利',
    'zh-HK': '意大利',
    ja: 'イタリア',
    ko: '이탈리아',
    es: 'Italia',
    fr: 'Italie',
    de: 'Italien',
  },
  nl: {
    en: 'Netherlands',
    'zh-TW': '荷蘭',
    'zh-HK': '荷蘭',
    ja: 'オランダ',
    ko: '네덜란드',
    es: 'Países Bajos',
    fr: 'Pays-Bas',
    de: 'Niederlande',
  },
  'en-sg': {
    en: 'Singapore (English)',
    'zh-TW': '新加坡（英文）',
    'zh-HK': '新加坡（英文）',
    ja: 'シンガポール（英語）',
    ko: '싱가포르(영어)',
    es: 'Singapur (inglés)',
    fr: 'Singapour (anglais)',
    de: 'Singapur (Englisch)',
  },
  'en-in': {
    en: 'India (English)',
    'zh-TW': '印度（英文）',
    'zh-HK': '印度（英文）',
    ja: 'インド（英語）',
    ko: '인도(영어)',
    es: 'India (inglés)',
    fr: 'Inde (anglais)',
    de: 'Indien (Englisch)',
  },
  pt: {
    en: 'Portugal',
    'zh-TW': '葡萄牙',
    'zh-HK': '葡萄牙',
    ja: 'ポルトガル',
    ko: '포르투갈',
    es: 'Portugal',
    fr: 'Portugal',
    de: 'Portugal',
  },
  br: {
    en: 'Brazil',
    'zh-TW': '巴西',
    'zh-HK': '巴西',
    ja: 'ブラジル',
    ko: '브라질',
    es: 'Brasil',
    fr: 'Brésil',
    de: 'Brasilien',
  },
  mx: {
    en: 'Mexico',
    'zh-TW': '墨西哥',
    'zh-HK': '墨西哥',
    ja: 'メキシコ',
    ko: '멕시코',
    es: 'México',
    fr: 'Mexique',
    de: 'Mexiko',
  },
  pl: {
    en: 'Poland',
    'zh-TW': '波蘭',
    'zh-HK': '波蘭',
    ja: 'ポーランド',
    ko: '폴란드',
    es: 'Polonia',
    fr: 'Pologne',
    de: 'Polen',
  },
  'en-nz': {
    en: 'New Zealand (English)',
    'zh-TW': '紐西蘭（英文）',
    'zh-HK': '紐西蘭（英文）',
    ja: 'ニュージーランド（英語）',
    ko: '뉴질랜드(영어)',
    es: 'Nueva Zelanda (inglés)',
    fr: 'Nouvelle-Zélande (anglais)',
    de: 'Neuseeland (Englisch)',
  },
};

/**
 * Flag glyph for each market. Regional-indicator emoji, so they need no bundled
 * assets and stay offline-safe; `global` uses a globe since it has no country.
 * (Windows renders region flags as two letters — an accepted platform fallback.)
 */
export const MARKET_FLAGS: Readonly<Record<Market, string>> = {
  global: '\u{1F310}', // globe
  tw: '\u{1F1F9}\u{1F1FC}',
  hk: '\u{1F1ED}\u{1F1F0}',
  jp: '\u{1F1EF}\u{1F1F5}',
  'en-us': '\u{1F1FA}\u{1F1F8}',
  'en-gb': '\u{1F1EC}\u{1F1E7}',
  'en-ca': '\u{1F1E8}\u{1F1E6}',
  'en-au': '\u{1F1E6}\u{1F1FA}',
  ko: '\u{1F1F0}\u{1F1F7}',
  de: '\u{1F1E9}\u{1F1EA}',
  fr: '\u{1F1EB}\u{1F1F7}',
  es: '\u{1F1EA}\u{1F1F8}',
  it: '\u{1F1EE}\u{1F1F9}',
  nl: '\u{1F1F3}\u{1F1F1}',
  'en-sg': '\u{1F1F8}\u{1F1EC}',
  'en-in': '\u{1F1EE}\u{1F1F3}',
  pt: '\u{1F1F5}\u{1F1F9}',
  br: '\u{1F1E7}\u{1F1F7}',
  mx: '\u{1F1F2}\u{1F1FD}',
  pl: '\u{1F1F5}\u{1F1F1}',
  'en-nz': '\u{1F1F3}\u{1F1FF}',
};

/** Flag glyph for a market, or an empty string if none is defined. */
export function marketFlag(market: Market): string {
  return MARKET_FLAGS[market] ?? '';
}

export interface ToolFilter {
  market: Market;
  query: string;
}

/**
 * Pure wrapper over the registry's search/list. Filtering a registry by a
 * market and an optional query, sorted by display name for stable rendering.
 */
export function filterTools(registry: ToolRegistry, filter: ToolFilter): ToolEntry[] {
  const { market, query } = filter;
  const results = registry.search(query, market);
  return [...results].sort((a, b) => a.name.localeCompare(b.name));
}

/** Localized, human-friendly count label (e.g. "3 tools", "3 個のツール"). */
export function formatToolCount(count: number, lang: Lang = 'en'): string {
  const n = Math.max(0, Math.trunc(count));
  switch (lang) {
    case 'ja':
      return `${n} 個のツール`;
    case 'zh-TW':
    case 'zh-HK':
      return `${n} 個工具`;
    case 'ko':
      return `${n}개 도구`;
    case 'es':
      return `${n} herramientas`;
    case 'fr':
      return `${n} outils`;
    case 'de':
      return `${n} Werkzeuge`;
    default:
      return `${n} ${n === 1 ? 'tool' : 'tools'}`;
  }
}

/** Localized label for a market, falling back to English then the raw value. */
export function marketLabel(market: Market, lang: Lang = 'en'): string {
  const map = MARKET_LABELS[market];
  if (!map) return market;
  return map[lang] ?? map.en;
}
