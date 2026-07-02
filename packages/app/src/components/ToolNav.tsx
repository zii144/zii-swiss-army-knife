import { categoryColor, localizedName } from '../lib/catalog';
import { categoryLabel } from '../lib/categories';
import type { Lang } from '../lib/i18n';
import { prefetchTool } from '../tools';
import { ToolIcon } from './ToolIcon';

export interface ToolNavEntry {
  id: string;
  category: string;
}

export interface ToolNavProps {
  tools: ToolNavEntry[];
  currentId: string;
  lang: Lang;
  label: string;
  onOpen: (id: string) => void;
}

interface Group {
  category: string;
  items: ToolNavEntry[];
}

/** Bucket tools by category, preserving first-seen order. */
function groupByCategory(tools: ToolNavEntry[]): Group[] {
  const order: string[] = [];
  const map = new Map<string, ToolNavEntry[]>();
  for (const tool of tools) {
    if (!map.has(tool.category)) {
      map.set(tool.category, []);
      order.push(tool.category);
    }
    map.get(tool.category)!.push(tool);
  }
  return order.map((category) => ({ category, items: map.get(category)! }));
}

/** A sticky left rail listing every tool, grouped by category, for quick switching. */
export function ToolNav({ tools, currentId, lang, label, onOpen }: ToolNavProps): React.JSX.Element {
  const groups = groupByCategory(tools);

  return (
    <aside className="toolnav" aria-label={label}>
      <div className="toolnav__head">{label}</div>
      {groups.map((group) => (
        <div key={group.category} className="toolnav__group">
          <div className="toolnav__cat">
            <span className="app__cat-dot" style={{ background: categoryColor(group.category) }} />
            {categoryLabel(group.category, lang)}
          </div>
          <ul className="toolnav__list">
            {group.items.map((tool) => (
              <li key={tool.id}>
                <button
                  type="button"
                  className={`toolnav__item${tool.id === currentId ? ' is-active' : ''}`}
                  aria-current={tool.id === currentId ? 'true' : undefined}
                  onClick={() => onOpen(tool.id)}
                  onMouseEnter={() => prefetchTool(tool.id)}
                  onFocus={() => prefetchTool(tool.id)}
                >
                  <ToolIcon id={tool.id} size={16} className="toolnav__ico" />
                  {localizedName(tool.id, lang)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
