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

/** Pluralized, human-friendly count label (e.g. "0 tools", "1 tool", "3 tools"). */
export function formatToolCount(count: number): string {
  const n = Math.max(0, Math.trunc(count));
  return `${n} ${n === 1 ? 'tool' : 'tools'}`;
}

/** Localized label for a market, falling back to English then the raw value. */
export function marketLabel(market: Market, lang: Lang = 'en'): string {
  const map = MARKET_LABELS[market];
  if (!map) return market;
  return map[lang] ?? map.en;
}
