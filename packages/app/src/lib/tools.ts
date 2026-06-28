import type { Market, ToolEntry, ToolRegistry } from '@zii/registry';

/** Markets exposed in the app shell's market <select>. */
export const SELECTABLE_MARKETS: readonly Market[] = ['global', 'tw', 'hk', 'jp', 'en-us'] as const;

/** Human-readable labels for the selectable markets. */
export const MARKET_LABELS: Readonly<Record<Market, string>> = {
  global: 'Global',
  tw: 'Taiwan',
  hk: 'Hong Kong',
  jp: 'Japan',
  'en-us': 'US (English)',
  'en-gb': 'UK (English)',
  'en-ca': 'Canada (English)',
  'en-au': 'Australia (English)',
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

/** Label for a market, falling back to the raw value for unknown markets. */
export function marketLabel(market: Market): string {
  return MARKET_LABELS[market] ?? market;
}
