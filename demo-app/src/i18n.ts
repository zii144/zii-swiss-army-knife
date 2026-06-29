export type Lang = 'en' | 'zh-TW';

export interface Dict {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  darkMode: string;
  language: string;
  noResults: string;
  offline: string;
  back: string;
  loading: string;
}

export const DICTIONARY: Readonly<Record<Lang, Dict>> = {
  en: {
    title: 'Zii — Swiss Army Knife',
    subtitle: '3 tools · all run on your device',
    searchPlaceholder: 'Search tools…',
    darkMode: 'Dark mode',
    language: 'Language',
    noResults: 'No tools match your search.',
    offline: 'offline',
    back: '← Back to tools',
    loading: 'Loading…',
  },
  'zh-TW': {
    title: 'Zii — 瑞士刀工具箱',
    subtitle: '3 個工具 · 全部在裝置上執行',
    searchPlaceholder: '搜尋工具…',
    darkMode: '深色模式',
    language: '語言',
    noResults: '沒有符合的工具。',
    offline: '離線',
    back: '← 返回工具列表',
    loading: '載入中…',
  },
};

export const LANGS: readonly Lang[] = ['en', 'zh-TW'] as const;

export const LANG_LABELS: Readonly<Record<Lang, string>> = {
  en: 'English',
  'zh-TW': '繁體中文',
};

export function useT(lang: Lang): (key: keyof Dict) => string {
  const dict = DICTIONARY[lang] ?? DICTIONARY.en;
  return (key) => dict[key];
}
