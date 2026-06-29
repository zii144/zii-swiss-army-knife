import { lazy } from 'react';
import type { ComponentType } from 'react';
import type { ToolMeta, ToolRegistry } from '@zii/registry';
import type { ToolViewProps } from './types';

/** A lazily-imported tool view module (default export is the React view). */
type ViewLoader = () => Promise<{ default: ComponentType<ToolViewProps> }>;

/**
 * The tool catalogue surfaced by the app shell. Each entry pairs registry
 * metadata with a lazily-loaded React view (code-split per tool) wired to the
 * real `@zii/compute-wasm` ops.
 */
interface AppTool {
  meta: ToolMeta;
  load: ViewLoader;
}

const APP_TOOLS: AppTool[] = [
  {
    meta: {
      id: 'pdf-merge',
      name: 'Merge PDF',
      category: 'pdf',
      markets: ['global'],
      offline: true,
      keywords: ['pdf', 'merge', 'combine', 'join'],
    },
    load: () => import('./pdf-merge'),
  },
  {
    meta: {
      id: 'image-convert',
      name: 'Convert image',
      category: 'image',
      markets: ['global'],
      offline: true,
      keywords: ['image', 'convert', 'png', 'jpeg', 'jpg', 'webp'],
    },
    load: () => import('./image-convert'),
  },
  {
    meta: {
      id: 'qr-generate',
      name: 'QR code generator',
      category: 'generator',
      markets: ['global'],
      offline: true,
      keywords: ['qr', 'qrcode', 'barcode', 'generate'],
    },
    load: () => import('./qr-generate'),
  },
];

/** Stable id → lazy view map for the shell to render the selected tool. */
export const TOOL_VIEWS: Readonly<Record<string, ComponentType<ToolViewProps>>> =
  Object.fromEntries(APP_TOOLS.map((t) => [t.meta.id, lazy(t.load)]));

/** Register every app tool into a registry (sharing the per-tool lazy loader). */
export function registerAppTools(registry: ToolRegistry): void {
  for (const tool of APP_TOOLS) {
    registry.register(tool.meta, tool.load);
  }
}

/** The ids of the tools that ship with a real view (used by tests). */
export const APP_TOOL_IDS: readonly string[] = APP_TOOLS.map((t) => t.meta.id);
