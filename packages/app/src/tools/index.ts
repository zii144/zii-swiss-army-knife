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
  {
    meta: {
      id: 'image-compress',
      name: 'Compress image',
      category: 'image',
      markets: ['global'],
      offline: true,
      keywords: ['image', 'compress', 'shrink', 'optimize', 'jpeg', 'quality'],
    },
    load: () => import('./image-compress'),
  },
  {
    meta: {
      id: 'percent-tip',
      name: 'Percentage & tip',
      category: 'calc',
      markets: ['global'],
      offline: true,
      keywords: ['percent', 'percentage', 'tip', 'split', 'change', 'calculator'],
    },
    load: () => import('./percent-tip'),
  },
  {
    meta: {
      id: 'unit-convert',
      name: 'Unit converter',
      category: 'convert',
      markets: ['global'],
      offline: true,
      keywords: ['unit', 'convert', 'length', 'mass', 'weight', 'temperature', 'volume'],
    },
    load: () => import('./unit-convert'),
  },
  {
    meta: {
      id: 'text-count',
      name: 'Character & word count',
      category: 'text',
      markets: ['global'],
      offline: true,
      keywords: ['count', 'character', 'word', 'line', 'length', 'text'],
    },
    load: () => import('./text-count'),
  },
  {
    meta: {
      id: 'text-case',
      name: 'Case converter',
      category: 'text',
      markets: ['global'],
      offline: true,
      keywords: ['case', 'camel', 'snake', 'kebab', 'title', 'upper', 'lower'],
    },
    load: () => import('./text-case'),
  },
  {
    meta: {
      id: 'json-csv',
      name: 'JSON ↔ CSV',
      category: 'dev',
      markets: ['global'],
      offline: true,
      keywords: ['json', 'csv', 'convert', 'data', 'table'],
    },
    load: () => import('./json-csv'),
  },
  {
    meta: {
      id: 'hash',
      name: 'Hash (SHA-256 / SHA-1)',
      category: 'dev',
      markets: ['global'],
      offline: true,
      keywords: ['hash', 'sha', 'sha256', 'sha1', 'checksum', 'digest'],
    },
    load: () => import('./hash'),
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
