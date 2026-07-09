import type { RefObject } from 'react';
import type { Market } from '@zii/registry';
import { formatToolCount, marketLabel, SELECTABLE_MARKETS } from '../lib/tools';
import type { Lang } from '../lib/i18n';
import { useT } from '../lib/i18n';
import { categoryColor, localizedName } from '../lib/catalog';
import { categoryDescription, categoryLabel, presentCategories } from '../lib/categories';
import { subGroupsFor, subLabel } from '../lib/subcategories';
import { prefetchTool } from '../tools';
import { ToolIcon, CategoryIcon } from './ToolIcon';
import { Select, TextField } from './ui';
import type { SelectOption } from './ui';

export interface CatalogTool {
  id: string;
  category: string;
  offline: boolean;
}

export interface ToolCatalogProps {
  tools: readonly CatalogTool[];
  lang: Lang;
  market: Market;
  query: string;
  category: string;
  onMarket: (market: Market) => void;
  onQuery: (query: string) => void;
  onCategory: (category: string) => void;
  onOpenTool: (id: string) => void;
  catalogRef?: RefObject<HTMLDivElement | null>;
  standalone?: boolean;
}

/** Searchable, category-grouped tool grid shared by the tools route and prerender. */
export function ToolCatalog({
  tools,
  lang,
  market,
  query,
  category,
  onMarket,
  onQuery,
  onCategory,
  onOpenTool,
  catalogRef,
  standalone = false,
}: ToolCatalogProps): React.JSX.Element {
  const t = useT(lang);
  const sectionCategories = presentCategories(tools.map((tool) => tool.category));
  const visibleCategories =
    category === 'all' ? sectionCategories : sectionCategories.filter((c) => c === category);
  const title = category === 'all' ? t('catalogTitle') : categoryLabel(category, lang);
  const subtitle = category === 'all' ? t('catalogSubtitle') : categoryDescription(category, lang);

  // On the "all" view with no active search, browsing 170 stacked tools is a
  // slog — show a category hub instead. A search or a picked category drops
  // straight to the grouped tool grid.
  const showHub = category === 'all' && query.trim().length === 0;

  const marketOptions: SelectOption[] = SELECTABLE_MARKETS.map((m) => ({
    value: m,
    label: marketLabel(m, lang),
  }));

  const renderCategoryCard = (cat: string): React.JSX.Element => {
    const items = tools.filter((tl) => tl.category === cat);
    const samples = items.slice(0, 3).map((tl) => localizedName(tl.id, lang));
    return (
      <li key={cat}>
        <button
          type="button"
          className="catcard"
          style={{ '--cat': categoryColor(cat) } as React.CSSProperties}
          onClick={() => onCategory(cat)}
        >
          <span className="catcard__top">
            <span className="catcard__ico">
              <CategoryIcon category={cat} size={22} />
            </span>
            <span className="catcard__count">{items.length}</span>
          </span>
          <span className="catcard__name">{categoryLabel(cat, lang)}</span>
          <span className="catcard__samples">
            {samples.map((s, i) => (
              <span key={i} className="catcard__chip">
                {s}
              </span>
            ))}
          </span>
          <span className="catcard__go" aria-hidden="true">
            →
          </span>
        </button>
      </li>
    );
  };

  const renderGridCard = (tool: CatalogTool, i: number): React.JSX.Element => (
    <li key={tool.id}>
      <button
        type="button"
        className="app__item"
        style={{ '--stagger': Math.min(i, 12) } as React.CSSProperties}
        onClick={() => onOpenTool(tool.id)}
        onMouseEnter={() => prefetchTool(tool.id)}
        onFocus={() => prefetchTool(tool.id)}
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

  return (
    <section
      className={standalone ? 'catalog catalog--standalone' : 'catalog'}
      ref={catalogRef}
      id="tools"
    >
      <div className="catalog__head">
        <div>
          <span className="catalog__kicker">{t('catalogKicker')}</span>
          <h2 className="catalog__title">{title}</h2>
          <p className="catalog__subtitle">{subtitle}</p>
        </div>
        <div className="catalog__controls">
          <Select
            variant="field"
            value={market}
            options={marketOptions}
            onChange={(v) => onMarket(v as Market)}
            ariaLabel={t('marketLabel')}
          />
          <TextField
            className="app__search"
            type="search"
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(e) => onQuery(e.target.value)}
            aria-label={t('searchPlaceholder')}
          />
          <span className="app__count">{formatToolCount(tools.length, lang)}</span>
        </div>
      </div>

      {sectionCategories.length > 0 ? (
        <div className="catfilter" role="tablist" aria-label={t('navTools')}>
          <button
            type="button"
            role="tab"
            aria-selected={category === 'all'}
            className={`catchip${category === 'all' ? ' is-active' : ''}`}
            onClick={() => onCategory('all')}
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
                onClick={() => onCategory(cat)}
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
      ) : showHub ? (
        <ul className="cathub">{sectionCategories.map((cat) => renderCategoryCard(cat))}</ul>
      ) : (
        visibleCategories.map((cat) => {
          const items = tools.filter((tl) => tl.category === cat);
          const byId = new Map(items.map((tl) => [tl.id, tl]));
          // Sub-group only a focused category page, not cross-category search.
          const subs =
            category !== 'all'
              ? subGroupsFor(
                  cat,
                  items.map((tl) => tl.id),
                )
              : [];
          return (
            <section key={cat} className="catgroup">
              <div className="catgroup__head">
                <span className="catgroup__ico" style={{ color: categoryColor(cat) }}>
                  <CategoryIcon category={cat} size={18} />
                </span>
                <h3 className="catgroup__title">{categoryLabel(cat, lang)}</h3>
                <span className="catgroup__count">{items.length}</span>
              </div>
              {subs.length > 0 ? (
                subs.map((sg) => (
                  <div key={sg.key} className="subgroup">
                    <h4 className="subgroup__title">
                      {subLabel(sg.label, lang)}
                      <span className="subgroup__count">{sg.tools.length}</span>
                    </h4>
                    <ul className="app__list">
                      {sg.tools.map((id, i) => {
                        const tl = byId.get(id);
                        return tl ? renderGridCard(tl, i) : null;
                      })}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="app__list">{items.map((tl, i) => renderGridCard(tl, i))}</ul>
              )}
            </section>
          );
        })
      )}
    </section>
  );
}
