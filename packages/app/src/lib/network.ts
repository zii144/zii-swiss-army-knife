import type { ToolCategory } from '@zii/registry';

/** Document conversion that POSTs bytes to an optional worker. */
const UPLOAD_IDS = new Set(['docx-to-pdf', 'pptx-to-pdf', 'pdf-to-word']);

export type NetworkKind = 'offline' | 'network-once' | 'upload';

/** Minimal catalog fields needed to decide the network badge. */
export interface NetworkToolRef {
  id: string;
  offline: boolean;
  category?: ToolCategory;
}

/** How a catalog tool uses the network, derived from `offline` + known upload ids. */
export function networkKindFor(tool: NetworkToolRef | undefined): NetworkKind {
  if (!tool || tool.offline !== false) return 'offline';
  if (UPLOAD_IDS.has(tool.id)) return 'upload';
  return 'network-once';
}
