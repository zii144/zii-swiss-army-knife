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
  slugify: () => import('./slugify'),
  'lorem-ipsum': () => import('./lorem-ipsum'),
  'line-dedupe': () => import('./line-dedupe'),
  'sort-lines': () => import('./sort-lines'),
  'text-normalize': () => import('./text-normalize'),
  'reverse-text': () => import('./reverse-text'),
  hmac: () => import('./hmac'),
  'random-string': () => import('./random-string'),
  'roman-numeral': () => import('./roman-numeral'),
  'data-size': () => import('./data-size'),
  'find-replace': () => import('./find-replace'),
  'extract-urls': () => import('./extract-urls'),
  rot13: () => import('./rot13'),
  'shuffle-lines': () => import('./shuffle-lines'),
  'word-frequency': () => import('./word-frequency'),
  'area-convert': () => import('./area-convert'),
  'speed-convert': () => import('./speed-convert'),
  'json-escape': () => import('./json-escape'),
  nanoid: () => import('./nanoid'),
  totp: () => import('./totp'),
  'trim-lines': () => import('./trim-lines'),
  'remove-empty-lines': () => import('./remove-empty-lines'),
  'number-lines': () => import('./number-lines'),
  'text-wrap': () => import('./text-wrap'),
  'morse-code': () => import('./morse-code'),
  'binary-text': () => import('./binary-text'),
  levenshtein: () => import('./levenshtein'),
  'strip-html': () => import('./strip-html'),
  'pressure-convert': () => import('./pressure-convert'),
  'timestamp-convert': () => import('./timestamp-convert'),
  'repeat-text': () => import('./repeat-text'),
  'join-lines': () => import('./join-lines'),
  'split-text': () => import('./split-text'),
  'caesar-cipher': () => import('./caesar-cipher'),
  'remove-diacritics': () => import('./remove-diacritics'),
  'palindrome-check': () => import('./palindrome-check'),
  'grep-lines': () => import('./grep-lines'),
  'indent-lines': () => import('./indent-lines'),
  'energy-convert': () => import('./energy-convert'),
  'duration-format': () => import('./duration-format'),
  'hex-text': () => import('./hex-text'),
  'unicode-escape': () => import('./unicode-escape'),
  'reverse-words': () => import('./reverse-words'),
  'tabs-spaces': () => import('./tabs-spaces'),
  rot47: () => import('./rot47'),
  'hamming-distance': () => import('./hamming-distance'),
  'volume-convert': () => import('./volume-convert'),
  'angle-convert': () => import('./angle-convert'),
  'char-frequency': () => import('./char-frequency'),
  'line-prefix': () => import('./line-prefix'),
  'mass-convert': () => import('./mass-convert'),
  'temperature-convert': () => import('./temperature-convert'),
  'power-convert': () => import('./power-convert'),
  'frequency-convert': () => import('./frequency-convert'),
  'truncate-text': () => import('./truncate-text'),
  'pad-text': () => import('./pad-text'),
  'zero-width-clean': () => import('./zero-width-clean'),
  'markdown-strip': () => import('./markdown-strip'),
  'atbash-cipher': () => import('./atbash-cipher'),
  'base32-codec': () => import('./base32-codec'),
  'length-convert': () => import('./length-convert'),
  soundex: () => import('./soundex'),
  'jaccard-similarity': () => import('./jaccard-similarity'),
  'quoted-printable': () => import('./quoted-printable'),
  'extract-numbers': () => import('./extract-numbers'),
  'extract-ipv4': () => import('./extract-ipv4'),
  'transpose-grid': () => import('./transpose-grid'),
  'gcd-lcm': () => import('./gcd-lcm'),
  'string-similarity': () => import('./string-similarity'),
  'mask-emails': () => import('./mask-emails'),
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
