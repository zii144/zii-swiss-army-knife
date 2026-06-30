import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Market } from '@zii/registry';
import { createRegistry } from '@zii/registry';
import { filterTools, formatToolCount, marketLabel, SELECTABLE_MARKETS } from './lib/tools';
import { LANG_LABELS, LANGS, useT } from './lib/i18n';
import type { Lang } from './lib/i18n';
import { categoryColor, getTool, localizedName } from './lib/catalog';
import { categoryLabel, presentCategories } from './lib/categories';
import { buildPath, parsePath } from './lib/router';
import { buildHead, SITE_ORIGIN } from './lib/seo';
import { applyHead } from './lib/head';
import { registerAppTools, TOOL_VIEWS } from './tools';
import { ToolPage } from './components/ToolPage';
import { Footer } from './components/Footer';
import { Clouds } from './components/Clouds';
import { ToolNav } from './components/ToolNav';
import { ToolIcon, CategoryIcon } from './components/ToolIcon';
import { Logo } from './components/Logo';
import { Select, TextField } from './components/ui';
import type { SelectOption } from './components/ui';

/** Build the registry once and register the available tools. */
function buildRegistry(): ReturnType<typeof createRegistry> {
  const registry = createRegistry();
  registerAppTools(registry);
  return registry;
}

function originOf(): string {
  return typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : SITE_ORIGIN;
}

export function App(): React.JSX.Element {
  const registry = useMemo(buildRegistry, []);
  const initial = useMemo(
    () => parsePath(typeof window !== 'undefined' ? window.location.pathname : '/'),
    [],
  );
  const [market, setMarket] = useState<Market>('global');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>(initial.locale);
  const [selected, setSelected] = useState<string | null>(initial.toolId);
  const catalogRef = useRef<HTMLDivElement>(null);

  const t = useT(lang);
  const tools = useMemo(() => filterTools(registry, { market, query }), [registry, market, query]);
  // Full, unfiltered tool list for the in-tool sidebar.
  const navTools = useMemo(() => filterTools(registry, { market, query: '' }), [registry, market]);

  /** Update both the URL (history) and the in-memory route. */
  const go = (nextLocale: Lang, nextTool: string | null, push = true): void => {
    setLang(nextLocale);
    setSelected(nextTool);
    if (push && typeof window !== 'undefined') {
      const path = buildPath(nextLocale, nextTool);
      if (path !== window.location.pathname) window.history.pushState({}, '', path);
    }
  };

  const back = (): void => go(lang, null);
  const openTool = (id: string): void => go(lang, id);
  const changeLang = (next: Lang): void => go(next, selected);
  const openCategory = (cat: string): void => {
    setCategory(cat);
    go(lang, null);
    requestAnimationFrame(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const SelectedView = selected ? TOOL_VIEWS[selected] : undefined;

  const scrollToCatalog = (): void => {
    if (selected) back();
    requestAnimationFrame(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  // Keep the document head + <html lang> in sync with the active route.
  useEffect(() => {
    applyHead(buildHead(originOf(), lang, selected));
  }, [lang, selected]);

  // Entering (or switching) a tool scrolls back to the top.
  useEffect(() => {
    if (selected && typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, [selected]);

  // Reflect browser back/forward into app state.
  useEffect(() => {
    const onPop = (): void => {
      const r = parsePath(window.location.pathname);
      go(r.locale, r.toolId, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const featured = tools.slice(0, 8);
  const deckRows = [featured.slice(0, 5), featured.slice(5, 8)];
  const renderDeckCard = (tool: (typeof featured)[number], i: number): React.JSX.Element => (
    <button
      key={tool.id}
      type="button"
      className="hero__card"
      style={{ '--stagger': i } as React.CSSProperties}
      onClick={() => openTool(tool.id)}
    >
      <span className="hero__card-cat">
        <span className="tool-ico" style={{ color: categoryColor(tool.category) }}>
          <ToolIcon id={tool.id} size={16} />
        </span>
        {tool.category}
      </span>
      <span className="hero__card-name">{localizedName(tool.id, lang)}</span>
    </button>
  );

  // Categories present in the current (market-filtered) tool set, in display order.
  const sectionCategories = useMemo(() => presentCategories(tools.map((t) => t.category)), [tools]);
  const visibleCategories =
    category === 'all' ? sectionCategories : sectionCategories.filter((c) => c === category);

  const renderGridCard = (tool: (typeof tools)[number], i: number): React.JSX.Element => (
    <li key={tool.id}>
      <button
        type="button"
        className="app__item"
        style={{ '--stagger': Math.min(i, 12) } as React.CSSProperties}
        onClick={() => openTool(tool.id)}
      >
        <span className="app__item-top">
          <span className="tool-ico" style={{ color: categoryColor(tool.category) }}>
            <ToolIcon id={tool.id} size={20} />
          </span>
          {tool.offline ? <span className="app__badge">{t('offline')}</span> : null}
        </span>
        <span className="app__item-name">{localizedName(tool.id, lang)}</span>
      </button>
    </li>
  );

  const langOptions: SelectOption[] = LANGS.map((l) => ({ value: l, label: LANG_LABELS[l] }));
  const marketOptions: SelectOption[] = SELECTABLE_MARKETS.map((m) => ({
    value: m,
    label: marketLabel(m, lang),
  }));

  return (
    <div className={dark ? 'app app--dark' : 'app'}>
      <nav className="app__nav">
        <button type="button" className="app__brand" onClick={back}>
          <span className="app__brand-mark">
            <Logo />
          </span>
          {t('brand')}
        </button>
        <div className="app__nav-links">
          <button type="button" className="app__nav-link" onClick={back}>
            {t('navHome')}
          </button>
          <button type="button" className="app__nav-link" onClick={scrollToCatalog}>
            {t('navTools')}
          </button>
        </div>
        <div className="app__nav-right">
          <Select
            variant="pill"
            value={lang}
            options={langOptions}
            onChange={(v) => changeLang(v as Lang)}
            ariaLabel={t('language')}
          />
          <button
            type="button"
            className="app__toggle"
            aria-pressed={dark}
            onClick={() => setDark((d) => !d)}
          >
            {dark ? '☀' : '☾'} {t('darkMode')}
          </button>
          <button type="button" className="app__cta" onClick={scrollToCatalog}>
            {t('getStarted')}
            <span className="app__cta-dot">↗</span>
          </button>
        </div>
      </nav>

      {selected ? (
        <div key={`${lang}:${selected}`} className="workspace workspace--route">
          <ToolNav
            tools={navTools}
            currentId={selected}
            lang={lang}
            label={t('navTools')}
            onOpen={openTool}
          />
          <main className="workspace__main">
            <nav className="crumbs" aria-label="Breadcrumb">
              <button type="button" className="crumbs__link" onClick={back}>
                {t('navHome')}
              </button>
              {getTool(selected)?.category ? (
                <>
                  <span className="crumbs__sep" aria-hidden="true">
                    /
                  </span>
                  <button
                    type="button"
                    className="crumbs__link"
                    onClick={() => openCategory(getTool(selected)!.category)}
                  >
                    {categoryLabel(getTool(selected)!.category, lang)}
                  </button>
                </>
              ) : null}
              <span className="crumbs__sep" aria-hidden="true">
                /
              </span>
              <span className="crumbs__current">{localizedName(selected, lang)}</span>
            </nav>
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
                  title={localizedName(selected, lang)}
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
        </div>
      ) : (
        <>
          <Clouds />
          <section className="hero">
            <span className="hero__kicker">{t('heroKicker')}</span>
            <h1 className="hero__title">
              {t('heroTitleA')}
              <br />
              <span>{t('heroTitleB')}</span>
            </h1>
            <p className="hero__subtitle">{t('heroSubtitle')}</p>
            <div className="hero__actions">
              <button type="button" className="hero__ghost" onClick={scrollToCatalog}>
                {t('viewTools')}
              </button>
              <button type="button" className="hero__primary" onClick={scrollToCatalog}>
                {t('getStarted')}
                <span className="hero__primary-dot">↗</span>
              </button>
            </div>
            <p className="hero__rated">{t('rated')}</p>
          </section>

          {featured.length > 0 ? (
            <div className="hero__deck">
              {deckRows.map((row, r) =>
                row.length > 0 ? (
                  <div
                    key={r}
                    className={`hero__deck-row${r === 1 ? ' hero__deck-row--bottom' : ''}`}
                  >
                    {row.map((tool, i) => renderDeckCard(tool, r * 5 + i))}
                  </div>
                ) : null,
              )}
            </div>
          ) : null}

          <section className="catalog" ref={catalogRef}>
            <div className="catalog__head">
              <div>
                <span className="catalog__kicker">{t('catalogKicker')}</span>
                <h2 className="catalog__title">{t('catalogTitle')}</h2>
                <p className="catalog__subtitle">{t('catalogSubtitle')}</p>
              </div>
              <div className="catalog__controls">
                <Select
                  variant="field"
                  value={market}
                  options={marketOptions}
                  onChange={(v) => setMarket(v as Market)}
                  ariaLabel={t('marketLabel')}
                />
                <TextField
                  className="app__search"
                  type="search"
                  value={query}
                  placeholder={t('searchPlaceholder')}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label={t('searchPlaceholder')}
                />
                <span className="app__count">{formatToolCount(tools.length)}</span>
              </div>
            </div>

            {sectionCategories.length > 0 ? (
              <div className="catfilter" role="tablist" aria-label={t('navTools')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={category === 'all'}
                  className={`catchip${category === 'all' ? ' is-active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  {t('allCategories')}
                  <span className="catchip__count">{tools.length}</span>
                </button>
                {sectionCategories.map((cat) => {
                  const n = tools.filter((tl) => tl.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={category === cat}
                      className={`catchip${category === cat ? ' is-active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      <span className="catchip__ico" style={{ color: categoryColor(cat) }}>
                        <CategoryIcon category={cat} size={15} />
                      </span>
                      {categoryLabel(cat, lang)}
                      <span className="catchip__count">{n}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {tools.length === 0 ? (
              <p className="app__empty">{t('noResults')}</p>
            ) : (
              visibleCategories.map((cat) => {
                const items = tools.filter((tl) => tl.category === cat);
                return (
                  <section key={cat} className="catgroup">
                    <div className="catgroup__head">
                      <span className="catgroup__ico" style={{ color: categoryColor(cat) }}>
                        <CategoryIcon category={cat} size={18} />
                      </span>
                      <h3 className="catgroup__title">{categoryLabel(cat, lang)}</h3>
                      <span className="catgroup__count">{items.length}</span>
                    </div>
                    <ul className="app__list">{items.map((tl, i) => renderGridCard(tl, i))}</ul>
                  </section>
                );
              })
            )}
          </section>
        </>
      )}

      <Footer lang={lang} onOpenTool={openTool} onLang={changeLang} />
    </div>
  );
}
