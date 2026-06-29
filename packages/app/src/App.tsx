import { Suspense, useMemo, useState } from 'react';
import type { Market } from '@zii/registry';
import { createRegistry } from '@zii/registry';
import { registerHelloTool } from '@zii/hello-tool';
import { filterTools, formatToolCount, marketLabel, SELECTABLE_MARKETS } from './lib/tools';
import { LANG_LABELS, LANGS, useT } from './lib/i18n';
import type { Lang } from './lib/i18n';
import { registerAppTools, TOOL_VIEWS } from './tools';
import { ToolPage } from './components/ToolPage';

/** Build the registry once and register the available tools. */
function buildRegistry(): ReturnType<typeof createRegistry> {
  const registry = createRegistry();
  registerHelloTool(registry);
  registerAppTools(registry);
  return registry;
}

export function App(): React.JSX.Element {
  const registry = useMemo(buildRegistry, []);
  const [market, setMarket] = useState<Market>('global');
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');
  const [selected, setSelected] = useState<string | null>(null);

  const t = useT(lang);
  const tools = useMemo(() => filterTools(registry, { market, query }), [registry, market, query]);

  const back = (): void => setSelected(null);
  const SelectedView = selected ? TOOL_VIEWS[selected] : undefined;

  return (
    <div className={dark ? 'app app--dark' : 'app'}>
      <header className="app__header">
        <button type="button" className="app__title app__title--btn" onClick={back}>
          {t('title')}
        </button>
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

      {selected ? (
        <main>
          <Suspense fallback={<p className="app__empty">{t('loading')}</p>}>
            {SelectedView ? (
              <SelectedView
                onBack={back}
                lang={lang}
                backLabel={t('back')}
                offlineLabel={t('offline')}
              />
            ) : (
              <ToolPage
                title={selected}
                description={t('comingSoon')}
                onBack={back}
                backLabel={t('back')}
                offlineLabel={t('offline')}
              >
                <p className="tool__hint">{t('comingSoon')}</p>
              </ToolPage>
            )}
          </Suspense>
        </main>
      ) : (
        <>
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
                  <li key={tool.id}>
                    <button
                      type="button"
                      className="app__item app__item--btn"
                      onClick={() => setSelected(tool.id)}
                    >
                      <span className="app__item-name">{tool.name}</span>
                      <span className="app__item-category">{tool.category}</span>
                      {tool.offline ? <span className="app__badge">{t('offline')}</span> : null}
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
