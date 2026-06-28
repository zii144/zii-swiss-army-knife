import type { Market, ToolEntry, ToolLoader, ToolMeta } from './types';

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * In-memory registry of tools with market filtering, search, and lazy loading.
 * Market-agnostic: tools declare which markets they belong to via their metadata.
 */
export class ToolRegistry {
  readonly #tools = new Map<string, ToolEntry>();

  /** Register a tool. Throws on duplicate id or non-kebab-case id. */
  register(meta: ToolMeta, load: ToolLoader): void {
    if (!KEBAB_CASE.test(meta.id)) {
      throw new Error(`Tool id "${meta.id}" must be kebab-case`);
    }
    if (this.#tools.has(meta.id)) {
      throw new Error(`Tool "${meta.id}" is already registered`);
    }
    this.#tools.set(meta.id, { ...meta, load });
  }

  has(id: string): boolean {
    return this.#tools.has(id);
  }

  get(id: string): ToolEntry | undefined {
    return this.#tools.get(id);
  }

  /** All tools, or only those available in `market` (global tools always included). */
  list(market?: Market): ToolEntry[] {
    const all = [...this.#tools.values()];
    if (market === undefined) return all;
    return all.filter((t) => t.markets.includes('global') || t.markets.includes(market));
  }

  /** Search by id, name, or keyword, optionally scoped to a market. */
  search(query: string, market?: Market): ToolEntry[] {
    const q = query.trim().toLowerCase();
    if (q === '') return this.list(market);
    return this.list(market).filter(
      (t) =>
        t.id.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.keywords ?? []).some((k) => k.toLowerCase().includes(q)),
    );
  }

  /** Lazily load a tool's implementation (the module's default export). */
  async load(id: string): Promise<unknown> {
    const entry = this.#tools.get(id);
    if (entry === undefined) {
      throw new Error(`Unknown tool "${id}"`);
    }
    const mod = await entry.load();
    return mod.default;
  }
}

/** Convenience factory. */
export function createRegistry(): ToolRegistry {
  return new ToolRegistry();
}
