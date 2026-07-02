import { lazy } from 'react';
import type { ComponentType } from 'react';
import type { ToolMeta, ToolRegistry } from '@zii/registry';
import { CATALOG } from '../lib/catalog';
import type { ToolViewProps } from './types';

/** A lazily-imported tool view module (default export is the React view). */
type ViewLoader = () => Promise<{ default: ComponentType<ToolViewProps> }>;

/** Per-tool code-split view loaders, keyed by catalogue id. */
const LOADERS: Record<string, ViewLoader> = {
  'pdf-merge': () => import('./pdf-merge'),
  'image-convert': () => import('./image-convert'),
  'qr-generate': () => import('./qr-generate'),
  'qr-batch': () => import('./qr-batch'),
  'image-compress': () => import('./image-compress'),
  'percent-tip': () => import('./percent-tip'),
  'unit-convert': () => import('./unit-convert'),
  'text-count': () => import('./text-count'),
  'text-case': () => import('./text-case'),
  'json-csv': () => import('./json-csv'),
  'csv-clean': () => import('./csv-clean'),
  hash: () => import('./hash'),
  base64: () => import('./base64'),
  'url-encode': () => import('./url-encode'),
  'json-yaml': () => import('./json-yaml'),
  'regex-tester': () => import('./regex-tester'),
  'text-diff': () => import('./text-diff'),
  fullwidth: () => import('./fullwidth'),
  'loan-calculator': () => import('./loan-calculator'),
  bmi: () => import('./bmi'),
  'date-diff': () => import('./date-diff'),
  'qr-scan': () => import('./qr-scan'),
  'pdf-split': () => import('./pdf-split'),
  'pdf-compress': () => import('./pdf-compress'),
  'zip-create': () => import('./zip-create'),
  'zip-extract': () => import('./zip-extract'),
  'heic-convert': () => import('./heic-convert'),
  discount: () => import('./discount'),
  savings: () => import('./savings'),
  'cooking-convert': () => import('./cooking-convert'),
  password: () => import('./password'),
  uuid: () => import('./uuid'),
  'jwt-decode': () => import('./jwt-decode'),
  'base-convert': () => import('./base-convert'),
  'color-convert': () => import('./color-convert'),
  cron: () => import('./cron'),
  'image-resize': () => import('./image-resize'),
  'image-crop': () => import('./image-crop'),
  'exif-strip': () => import('./exif-strip'),
  favicon: () => import('./favicon'),
  'pdf-rotate': () => import('./pdf-rotate'),
  'pdf-watermark': () => import('./pdf-watermark'),
  'pdf-organize': () => import('./pdf-organize'),
  'pdf-page-numbers': () => import('./pdf-page-numbers'),
  scientific: () => import('./scientific'),
  timezone: () => import('./timezone'),
  'checksum-validate': () => import('./checksum-validate'),
  'sales-tax': () => import('./sales-tax'),
  'business-days': () => import('./business-days'),
  zodiac: () => import('./zodiac'),
  'era-convert': () => import('./era-convert'),
  'cjk-convert': () => import('./cjk-convert'),
  'html-entities': () => import('./html-entities'),
  'lunar-convert': () => import('./lunar-convert'),
  rokuyo: () => import('./rokuyo'),
  'solar-terms': () => import('./solar-terms'),
  'xml-json': () => import('./xml-json'),
  'csv-excel': () => import('./csv-excel'),
  barcode: () => import('./barcode'),
  ocr: () => import('./ocr'),
  'bg-remove': () => import('./bg-remove'),
  'currency-convert': () => import('./currency-convert'),
  'json-format': () => import('./json-format'),
  'paycheck-calc': () => import('./paycheck-calc'),
  'video-convert': () => import('./video-convert'),
  'audio-extract': () => import('./audio-extract'),
  'reminder-planner': () => import('./reminder-planner'),
  'images-to-pdf': () => import('./images-to-pdf'),
  'pdf-to-images': () => import('./pdf-to-images'),
  'docx-to-pdf': () => import('./docx-to-pdf'),
  'pptx-to-pdf': () => import('./pptx-to-pdf'),
  'pdf-to-word': () => import('./pdf-to-word'),
  'ca-sin': () => import('./ca-sin'),
  'au-tfn': () => import('./au-tfn'),
  'tw-national-id': () => import('./tw-national-id'),
  'tw-ubn': () => import('./tw-ubn'),
  'tw-arc': () => import('./tw-arc'),
  'hk-id': () => import('./hk-id'),
  'hk-br': () => import('./hk-br'),
  'jp-mynumber': () => import('./jp-mynumber'),
  'jp-corp-number': () => import('./jp-corp-number'),
  'us-ssn': () => import('./us-ssn'),
  'us-zip': () => import('./us-zip'),
  'us-routing': () => import('./us-routing'),
  'jp-postal': () => import('./jp-postal'),
  'hk-phone': () => import('./hk-phone'),
  'tw-mobile': () => import('./tw-mobile'),
  'us-ein': () => import('./us-ein'),
  'us-phone': () => import('./us-phone'),
  'uk-postcode': () => import('./uk-postcode'),
  'uk-nino': () => import('./uk-nino'),
  'uk-sort-code': () => import('./uk-sort-code'),
  'tw-postal': () => import('./tw-postal'),
};

/** Registry metadata derived from the catalogue (English name is canonical). */
function metaFor(id: string): ToolMeta {
  const tool = CATALOG.find((t) => t.id === id)!;
  return {
    id: tool.id,
    name: tool.name.en,
    category: tool.category,
    markets: [...(tool.markets ?? ['global'])],
    offline: tool.offline,
    keywords: [...tool.keywords],
  };
}

const APP_TOOLS = CATALOG.filter((t) => LOADERS[t.id]).map((t) => ({
  meta: metaFor(t.id),
  load: LOADERS[t.id]!,
}));

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

const prefetched = new Set<string>();

/**
 * Warm a tool's code-split chunk (idempotent). Called on hover/focus so the
 * chunk is already cached by the time the user clicks — instant open, with no
 * eager cost on the initial page load.
 */
export function prefetchTool(id: string): void {
  if (prefetched.has(id)) return;
  const loader = LOADERS[id];
  if (!loader) return;
  prefetched.add(id);
  void loader().catch(() => prefetched.delete(id));
}
