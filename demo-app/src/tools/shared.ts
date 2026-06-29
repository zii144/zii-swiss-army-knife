import type { Lang } from '../i18n';

export interface ToolViewProps {
  onBack: () => void;
  lang: Lang;
  backLabel: string;
  offlineLabel: string;
}

export function tr<T>(dict: Record<Lang, T>, lang: Lang): T {
  return dict[lang] ?? dict.en;
}

export async function readFileBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}
