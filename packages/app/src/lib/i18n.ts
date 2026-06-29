// Tiny in-house i18n scaffold — intentionally no i18next dependency.

export type Lang = 'en' | 'zh-TW';

export interface Dict {
  title: string;
  searchPlaceholder: string;
  marketLabel: string;
  darkMode: string;
  language: string;
  noResults: string;
  offline: string;
  back: string;
  comingSoon: string;
  loading: string;
}

export const DICTIONARY: Readonly<Record<Lang, Dict>> = {
  en: {
    title: 'Zii — Swiss Army Knife',
    searchPlaceholder: 'Search tools…',
    marketLabel: 'Market',
    darkMode: 'Dark mode',
    language: 'Language',
    noResults: 'No tools match your filters.',
    offline: 'offline',
    back: 'Back to tools',
    comingSoon: "This tool's interface isn't built yet.",
    loading: 'Loading…',
  },
  'zh-TW': {
    title: 'Zii — 瑞士刀工具箱',
    searchPlaceholder: '搜尋工具…',
    marketLabel: '市場',
    darkMode: '深色模式',
    language: '語言',
    noResults: '沒有符合條件的工具。',
    offline: '離線',
    back: '返回工具列表',
    comingSoon: '此工具的介面尚未完成。',
    loading: '載入中…',
  },
};

export const LANGS: readonly Lang[] = ['en', 'zh-TW'] as const;

export const LANG_LABELS: Readonly<Record<Lang, string>> = {
  en: 'English',
  'zh-TW': '繁體中文',
};

/** Returns a typed translator bound to `lang`, falling back to English. */
export function useT(lang: Lang): (key: keyof Dict) => string {
  const dict = DICTIONARY[lang] ?? DICTIONARY.en;
  return (key) => dict[key];
}
