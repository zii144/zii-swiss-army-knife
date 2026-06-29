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

/** Pick the active-language entry from a per-tool `{ en, 'zh-TW' }` dictionary. */
export function tr<T>(dict: Record<Lang, T>, lang: Lang): T {
  return dict[lang] ?? dict.en;
}

/** Read a browser `File` into a `Uint8Array`. */
export async function readFileBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}
