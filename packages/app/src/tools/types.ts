import type { Lang } from '../lib/i18n';

/** Props every tool view receives from the app shell. */
export interface ToolViewProps {
  onBack: () => void;
  lang: Lang;
  /** Localized "back to tools" label from the shell. */
  backLabel: string;
  /** Localized "offline" badge label from the shell. */
  offlineLabel: string;
}

/**
 * A per-tool translation dictionary. English is required (the fallback);
 * every other language is optional, so a tool can ship a subset of locales
 * and gracefully fall back to English for the rest.
 */
export type LangDict<T> = { en: T } & Partial<Record<Lang, T>>;

/** Pick the active-language entry from a per-tool dictionary, falling back to English. */
export function tr<T>(dict: LangDict<T>, lang: Lang): T {
  return dict[lang] ?? dict.en;
}

/** Read a browser `File` into a `Uint8Array`. */
export async function readFileBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}
