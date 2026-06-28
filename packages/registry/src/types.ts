/** Markets the suite targets. `global` = shown everywhere. */
export type Market = 'tw' | 'hk' | 'jp' | 'en-us' | 'en-gb' | 'en-ca' | 'en-au' | 'global';

/** Top-level tool categories (see FEATURE-CATALOG.md). */
export type ToolCategory =
  | 'file'
  | 'pdf'
  | 'image'
  | 'text'
  | 'calc'
  | 'convert'
  | 'datetime'
  | 'id'
  | 'finance'
  | 'generator'
  | 'dev'
  | 'daily';

/** Static, serializable metadata describing a tool. */
export interface ToolMeta {
  /** Unique, kebab-case id (e.g. "heic-to-jpg"). */
  id: string;
  /** Display name or i18n key. */
  name: string;
  category: ToolCategory;
  /** Markets where the tool is shown; include `global` for all markets. */
  markets: Market[];
  /** True if the tool runs fully on-device with no network. */
  offline: boolean;
  /** Free-text search keywords. */
  keywords?: string[];
}

/** Lazily imports a tool's implementation module (code-splitting per tool). */
export type ToolLoader = () => Promise<{ default: unknown }>;

/** A registered tool: its metadata plus its lazy loader. */
export interface ToolEntry extends ToolMeta {
  load: ToolLoader;
}
