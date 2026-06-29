import { Suspense, lazy, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { DICTIONARY, LANGS, LANG_LABELS, useT } from './i18n';
import type { Lang } from './i18n';
import type { ToolViewProps } from './tools/shared';

interface ToolDef {
  id: string;
  name: Record<Lang, string>;
  category: string;
  keywords: string[];
  view: ComponentType<ToolViewProps>;
}

const TOOLS: ToolDef[] = [
  {
    id: 'pdf-merge',
    name: { en: 'Merge PDF', 'zh-TW': '合併 PDF' },
    category: 'pdf',
    keywords: ['pdf', 'merge', 'combine'],
    view: lazy(() => import('./tools/PdfMerge')),
  },
  {
    id: 'image-convert',
    name: { en: 'Convert image', 'zh-TW': '影像轉檔' },
    category: 'image',
    keywords: ['image', 'png', 'jpeg', 'jpg', 'webp', 'convert'],
    view: lazy(() => import('./tools/ImageConvert')),
  },
  {
    id: 'qr-generate',
    name: { en: 'QR code generator', 'zh-TW': 'QR Code 產生器' },
    category: 'generator',
    keywords: ['qr', 'qrcode', 'barcode'],
    view: lazy(() => import('./tools/QrGenerate')),
  },
];

export function App() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const t = useT(lang);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (tool) =>
        tool.name[lang].toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.includes(q)),
    );
  }, [query, lang]);

  const back = () => setSelected(null);
  const active = selected ? TOOLS.find((x) => x.id === selected) : undefined;
  const ActiveView = active?.view;

  return (
    <div className={dark ? 'app app--dark' : 'app'}>
      <header className="app__header">
        <button type="button" className="app__title--btn" onClick={back}>
          {t('title')}
        </button>
        <div className="app__controls">
          <label className="app__control">
            <span>{t('language')}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {LANG_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <button type="button" aria-pressed={dark} onClick={() => setDark((d) => !d)}>
            {t('darkMode')}: {dark ? 'on' : 'off'}
          </button>
        </div>
      </header>

      {active && ActiveView ? (
        <main>
          <Suspense fallback={<p className="app__empty">{t('loading')}</p>}>
            <ActiveView
              onBack={back}
              lang={lang}
              backLabel={t('back')}
              offlineLabel={t('offline')}
            />
          </Suspense>
        </main>
      ) : (
        <>
          <section className="app__filters">
            <input
              className="app__search"
              type="search"
              value={query}
              placeholder={t('searchPlaceholder')}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="app__count">{DICTIONARY[lang].subtitle}</span>
          </section>
          <main>
            {filtered.length === 0 ? (
              <p className="app__empty">{t('noResults')}</p>
            ) : (
              <ul className="app__list">
                {filtered.map((tool) => (
                  <li key={tool.id}>
                    <button
                      type="button"
                      className="app__item--btn"
                      onClick={() => setSelected(tool.id)}
                    >
                      <span className="app__item-name">{tool.name[lang]}</span>
                      <span className="app__item-category">{tool.category}</span>
                      <span className="app__badge">{t('offline')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </main>
        </>
      )}
    </div>
  );
}
