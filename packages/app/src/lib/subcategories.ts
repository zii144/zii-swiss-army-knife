import type { ToolCategory } from '@zii/registry';
import type { Lang } from './i18n';
import type { L10n } from './catalog';

/** An ordered sub-section within a category detail page. */
export interface SubGroup {
  key: string;
  label: L10n;
  /** Tool ids in this group, in display order. */
  tools: readonly string[];
}

/** A sub-group resolved against the tools actually available (market-filtered). */
export interface ResolvedSubGroup {
  key: string;
  label: L10n;
  tools: string[];
}

/**
 * Curated sub-sections for the large categories, so a 30-plus-tool page reads
 * as a handful of scannable groups (JSON, encoding, hashing…) instead of one
 * wall. Labels are English for now; tool names inside are fully localized.
 * Categories not listed here render as a single flat list.
 */
export const SUBCATEGORIES: Partial<Record<ToolCategory, readonly SubGroup[]>> = {
  dev: [
    {
      key: 'json',
      label: { en: 'JSON & data formats' },
      tools: [
        'json-format',
        'json-csv',
        'json-yaml',
        'json-escape',
        'xml-json',
        'csv-clean',
        'transpose-grid',
      ],
    },
    {
      key: 'encode',
      label: { en: 'Encoding & escaping' },
      tools: [
        'base64',
        'base32-codec',
        'base-convert',
        'url-encode',
        'quoted-printable',
        'unicode-escape',
        'html-entities',
        'hex-text',
        'binary-text',
      ],
    },
    { key: 'crypto', label: { en: 'Hashing & tokens' }, tools: ['hash', 'hmac', 'jwt-decode'] },
    {
      key: 'inspect',
      label: { en: 'Inspect & test' },
      tools: ['regex-tester', 'cron', 'color-convert', 'timestamp-convert', 'duration-format'],
    },
    {
      key: 'textdata',
      label: { en: 'Text & data utilities' },
      tools: [
        'grep-lines',
        'indent-lines',
        'tabs-spaces',
        'strip-html',
        'markdown-strip',
        'extract-ipv4',
      ],
    },
    {
      key: 'similarity',
      label: { en: 'Similarity & distance' },
      tools: ['levenshtein', 'hamming-distance', 'jaccard-similarity', 'string-similarity'],
    },
  ],
  text: [
    {
      key: 'transform',
      label: { en: 'Transform & format' },
      tools: [
        'text-case',
        'slugify',
        'reverse-text',
        'reverse-words',
        'repeat-text',
        'text-wrap',
        'truncate-text',
        'pad-text',
        'number-lines',
        'line-prefix',
      ],
    },
    {
      key: 'lines',
      label: { en: 'Lines' },
      tools: [
        'line-dedupe',
        'sort-lines',
        'shuffle-lines',
        'trim-lines',
        'remove-empty-lines',
        'join-lines',
        'split-text',
      ],
    },
    {
      key: 'clean',
      label: { en: 'Clean & normalize' },
      tools: [
        'text-normalize',
        'remove-diacritics',
        'zero-width-clean',
        'find-replace',
        'mask-emails',
        'fullwidth',
      ],
    },
    {
      key: 'analyze',
      label: { en: 'Analyze & compare' },
      tools: [
        'text-count',
        'word-frequency',
        'char-frequency',
        'palindrome-check',
        'text-diff',
        'soundex',
        'extract-numbers',
        'extract-urls',
      ],
    },
    {
      key: 'cipher',
      label: { en: 'Ciphers & codes' },
      tools: ['rot13', 'rot47', 'caesar-cipher', 'atbash-cipher', 'morse-code'],
    },
    { key: 'cjk', label: { en: 'CJK & international' }, tools: ['cjk-convert', 'jp-romaji'] },
  ],
  convert: [
    {
      key: 'units',
      label: { en: 'Units & measurements' },
      tools: [
        'unit-convert',
        'length-convert',
        'area-convert',
        'volume-convert',
        'mass-convert',
        'temperature-convert',
        'speed-convert',
        'pressure-convert',
        'energy-convert',
        'power-convert',
        'frequency-convert',
        'angle-convert',
        'cooking-convert',
      ],
    },
    { key: 'data', label: { en: 'Data & currency' }, tools: ['data-size', 'currency-convert'] },
    {
      key: 'docs',
      label: { en: 'Files & documents' },
      tools: [
        'csv-excel',
        'video-convert',
        'audio-extract',
        'docx-to-pdf',
        'pptx-to-pdf',
        'pdf-to-word',
      ],
    },
  ],
  generator: [
    {
      key: 'codes',
      label: { en: 'Codes & scanning' },
      tools: ['qr-generate', 'qr-batch', 'qr-scan', 'barcode', 'favicon'],
    },
    {
      key: 'secrets',
      label: { en: 'Secrets & IDs' },
      tools: ['password', 'uuid', 'nanoid', 'totp', 'random-string'],
    },
    { key: 'misc', label: { en: 'Text & math' }, tools: ['lorem-ipsum', 'gcd-lcm'] },
  ],
  finance: [
    {
      key: 'everyday',
      label: { en: 'Everyday money' },
      tools: ['loan-calculator', 'savings', 'subscription-tracker', 'sales-tax', 'tw-invoice'],
    },
    {
      key: 'payroll',
      label: { en: 'Payroll & tax' },
      tools: ['paycheck-calc', 'hk-salaries-tax', 'hk-severance', 'jp-takehome', 'jp-furusato'],
    },
  ],
};

/** Localized sub-group label (English required; falls back to English). */
export function subLabel(label: L10n, lang: Lang): string {
  return label[lang] ?? label.en;
}

/**
 * Resolve a category's sub-groups against the tool ids actually present
 * (already market/category filtered). Empty groups are dropped; any present
 * tool not claimed by a group lands in a trailing "More" group. Returns an
 * empty array when the category has no sub-grouping (caller renders flat).
 */
export function subGroupsFor(category: string, available: readonly string[]): ResolvedSubGroup[] {
  const groups = SUBCATEGORIES[category as ToolCategory];
  if (!groups) return [];
  const availSet = new Set(available);
  const claimed = new Set<string>();
  const out: ResolvedSubGroup[] = [];
  for (const g of groups) {
    const tools = g.tools.filter((id) => availSet.has(id));
    tools.forEach((id) => claimed.add(id));
    if (tools.length > 0) out.push({ key: g.key, label: g.label, tools });
  }
  const leftovers = available.filter((id) => !claimed.has(id));
  if (leftovers.length > 0) out.push({ key: 'more', label: { en: 'More' }, tools: leftovers });
  return out;
}
