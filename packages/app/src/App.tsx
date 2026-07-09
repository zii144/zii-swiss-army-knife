import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Market } from '@zii/registry';
import { createRegistry } from '@zii/registry';
import { filterTools } from './lib/tools';
import { LANG_LABELS, LANGS, useT } from './lib/i18n';
import type { Lang } from './lib/i18n';
import { categoryColor, getTool, localizedName } from './lib/catalog';
import { categoryLabel } from './lib/categories';
import { buildPath, parsePath, type AppView } from './lib/router';
import { buildHead, SITE_ORIGIN } from './lib/seo';
import { applyHead } from './lib/head';
import { prefetchTool, registerAppTools, TOOL_VIEWS } from './tools';
import { ToolPage } from './components/ToolPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Clouds } from './components/Clouds';
import { ToolNav } from './components/ToolNav';
import { ToolIcon } from './components/ToolIcon';
import { ToolCatalog } from './components/ToolCatalog';
import { Logo } from './components/Logo';
import { Select } from './components/ui';
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
  const [category, setCategory] = useState<string>(
    initial.view === 'category' ? (initial.categoryId ?? 'all') : 'all',
  );
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>(initial.locale);
  const [view, setView] = useState<AppView>(initial.view);
  const [selected, setSelected] = useState<string | null>(
    initial.view === 'tool' ? initial.toolId : null,
  );
  const catalogRef = useRef<HTMLDivElement>(null);

  const t = useT(lang);
  const tools = useMemo(() => filterTools(registry, { market, query }), [registry, market, query]);
  // Full, unfiltered tool list for the in-tool sidebar.
  const navTools = useMemo(() => filterTools(registry, { market, query: '' }), [registry, market]);

  /** Update both the URL (history) and the in-memory route. */
  const go = (
    nextLocale: Lang,
    nextView: AppView,
    nextRouteId: string | null = null,
    push = true,
  ): void => {
    setLang(nextLocale);
    setView(nextView);
    setSelected(nextView === 'tool' ? nextRouteId : null);
    setCategory(nextView === 'category' ? (nextRouteId ?? 'all') : 'all');
    if (push && typeof window !== 'undefined') {
      const path = buildPath(nextLocale, nextView, nextRouteId);
      if (path !== window.location.pathname) window.history.pushState({}, '', path);
      // Land at the top of the new page. Category navigations manage their own
      // smooth scroll (openCategory), and tools get it via the `selected`
      // effect — so only reset here for the home / tools landings.
      if (nextView === 'home' || nextView === 'tools') {
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      }
    }
  };

  const goHome = (): void => go(lang, 'home');
  const goTools = (): void => go(lang, 'tools');
  const back = (): void => go(lang, 'tools');
  const openTool = (id: string): void => go(lang, 'tool', id);
  const changeLang = (next: Lang): void =>
    go(next, view, selected ?? (view === 'category' ? category : null));
  const openCategory = (cat: string): void => {
    go(lang, cat === 'all' ? 'tools' : 'category', cat === 'all' ? null : cat);
    requestAnimationFrame(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const SelectedView = selected ? TOOL_VIEWS[selected] : undefined;

  // Keep the document head + <html lang> in sync with the active route.
  useEffect(() => {
    applyHead(
      buildHead(originOf(), lang, view, selected ?? (view === 'category' ? category : null)),
    );
  }, [category, lang, view, selected]);

  // Entering (or switching) a tool scrolls back to the top.
  useEffect(() => {
    if (selected && typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, [selected]);

  // Reflect browser back/forward into app state.
  useEffect(() => {
    const onPop = (): void => {
      const r = parsePath(window.location.pathname);
      go(r.locale, r.view, r.toolId ?? r.categoryId, false);
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
      onMouseEnter={() => prefetchTool(tool.id)}
      onFocus={() => prefetchTool(tool.id)}
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

  const langOptions: SelectOption[] = LANGS.map((l) => ({ value: l, label: LANG_LABELS[l] }));

  return (
    <div className={dark ? 'app app--dark' : 'app'}>
      <nav className="app__nav">
        <button type="button" className="app__brand" onClick={goHome}>
          <span className="app__brand-mark">
            <Logo />
          </span>
          {t('brand')}
        </button>
        <div className="app__nav-links">
          <button
            type="button"
            className={`app__nav-link${view === 'home' ? ' is-active' : ''}`}
            onClick={goHome}
          >
            {t('navHome')}
          </button>
          <button
            type="button"
            className={`app__nav-link${view === 'tools' || view === 'category' || view === 'tool' ? ' is-active' : ''}`}
            onClick={goTools}
          >
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
          <button type="button" className="app__cta" onClick={goTools}>
            {t('getStarted')}
            <span className="app__cta-dot">↗</span>
          </button>
        </div>
      </nav>

      {selected ? (
        <div className="workspace workspace--route">
          <ToolNav
            tools={navTools}
            currentId={selected}
            lang={lang}
            label={t('navTools')}
            onOpen={openTool}
          />
          <main key={`${lang}:${selected}`} className="workspace__main">
            <nav className="crumbs" aria-label="Breadcrumb">
              <button type="button" className="crumbs__link" onClick={goHome}>
                {t('navHome')}
              </button>
              <span className="crumbs__sep" aria-hidden="true">
                /
              </span>
              <button type="button" className="crumbs__link" onClick={goTools}>
                {t('navTools')}
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
            <ErrorBoundary
              resetKey={selected}
              title={t('errorTitle')}
              body={t('errorBody')}
              retryLabel={t('errorRetry')}
            >
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
            </ErrorBoundary>
          </main>
        </div>
      ) : view === 'tools' || view === 'category' ? (
        <>
          <ToolCatalog
            tools={tools}
            lang={lang}
            market={market}
            query={query}
            category={category}
            onMarket={setMarket}
            onQuery={setQuery}
            onCategory={openCategory}
            onOpenTool={openTool}
            catalogRef={catalogRef}
            standalone
          />
        </>
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
              <button type="button" className="hero__ghost" onClick={goTools}>
                {t('viewTools')}
              </button>
              <button type="button" className="hero__primary" onClick={goTools}>
                {t('getStarted')}
                <span className="hero__primary-dot">↗</span>
              </button>
            </div>
            <p className="hero__rated">{t('rated')}</p>
          </section>

          {featured.length > 0 ? (
            <>
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
              <div className="hero__more">
                <button type="button" className="hero__viewall" onClick={goTools}>
                  {t('viewAll')}
                  <span className="hero__primary-dot" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </div>
            </>
          ) : null}
        </>
      )}

      <Footer lang={lang} onOpenTool={openTool} onLang={changeLang} />
    </div>
  );
}
