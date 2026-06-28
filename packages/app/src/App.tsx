import { useMemo, useState } from 'react';
import type { Market } from '@zii/registry';
import { createRegistry } from '@zii/registry';
import { registerHelloTool } from '@zii/hello-tool';
import { filterTools, formatToolCount, marketLabel, SELECTABLE_MARKETS } from './lib/tools';
import { LANG_LABELS, LANGS, useT } from './lib/i18n';
import type { Lang } from './lib/i18n';

/** Build the registry once and register the available tools. */
function buildRegistry(): ReturnType<typeof createRegistry> {
  const registry = createRegistry();
  registerHelloTool(registry);
  return registry;
}

export function App(): React.JSX.Element {
  const registry = useMemo(buildRegistry, []);
  const [market, setMarket] = useState<Market>('global');
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');

  const t = useT(lang);
  const tools = useMemo(() => filterTools(registry, { market, query }), [registry, market, query]);

  return (
    <div className={dark ? 'app app--dark' : 'app'}>
      <header className="app__header">
        <h1 className="app__title">{t('title')}</h1>
        <div className="app__controls">
          <label className="app__control">
            <span>{t('language')}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label={t('language')}
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {LANG_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="app__toggle"
            aria-pressed={dark}
            onClick={() => setDark((d) => !d)}
          >
            {t('darkMode')}: {dark ? 'on' : 'off'}
          </button>
        </div>
      </header>

      <section className="app__filters">
        <label className="app__control">
          <span>{t('marketLabel')}</span>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as Market)}
            aria-label={t('marketLabel')}
          >
            {SELECTABLE_MARKETS.map((m) => (
              <option key={m} value={m}>
                {marketLabel(m)}
              </option>
            ))}
          </select>
        </label>
        <input
          className="app__search"
          type="search"
          value={query}
          placeholder={t('searchPlaceholder')}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t('searchPlaceholder')}
        />
        <span className="app__count">{formatToolCount(tools.length)}</span>
      </section>

      <main>
        {tools.length === 0 ? (
          <p className="app__empty">{t('noResults')}</p>
        ) : (
          <ul className="app__list">
            {tools.map((tool) => (
              <li key={tool.id} className="app__item">
                <span className="app__item-name">{tool.name}</span>
                <span className="app__item-category">{tool.category}</span>
                {tool.offline ? <span className="app__badge">{t('offline')}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
