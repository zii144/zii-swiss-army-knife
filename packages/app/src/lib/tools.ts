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
  'en-ca': { en: 'Canada (English)' },
  'en-au': { en: 'Australia (English)' },
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
