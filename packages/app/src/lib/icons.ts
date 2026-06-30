// Inline line-art icons for every tool. Pure strings (no JSX) so both the
// React ToolIcon component and the string-based prerenderer can share them.
// Each value is the inner SVG markup; the wrapper supplies the viewBox and
// stroke styling. Stroke uses currentColor, so callers control the colour.

import { getTool } from './catalog';

/** Per-tool icon inner markup (24×24 user space, stroke = currentColor). */
const TOOL_ICONS: Record<string, string> = {
  'pdf-merge':
    '<rect x="3" y="3.5" width="11" height="14" rx="1.5"/><rect x="10" y="6.5" width="11" height="14" rx="1.5"/>',
  'pdf-split':
    '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M12 3v18" stroke-dasharray="2 2"/>',
  'image-convert':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M21 16l-5-5-7 7"/>',
  'image-compress':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 8v7M9.5 12.5L12 15l2.5-2.5"/>',
  'qr-generate':
    '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h3.5v3.5M20.5 20.5v.01M17.5 20.5h.01M20.5 17.5h.01"/>',
  'qr-scan':
    '<path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M20 8V5.5A1.5 1.5 0 0018.5 4H16M4 16v2.5A1.5 1.5 0 005.5 20H8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16"/><path d="M7 12h10"/>',
  'percent-tip':
    '<path d="M19 5L5 19"/><circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/>',
  'unit-convert':
    '<rect x="2.5" y="8.5" width="19" height="7" rx="1.5"/><path d="M6.5 8.5v3M10 8.5v4M13.5 8.5v3M17 8.5v4"/>',
  'text-count': '<path d="M4 6h16M4 10h11M4 14h16M4 18h8"/>',
  'text-case':
    '<path d="M3 18l4-11 4 11M4.2 14.3h5.6"/><path d="M21 11.5a2.6 2.6 0 00-2.6-2 2.6 2.6 0 000 5.2c1.3 0 2.6-.8 2.6-2.6V9.6"/>',
  'json-csv':
    '<path d="M8.5 4C6.6 4 6.5 6 6.5 8s0 4-2 4c2 0 2 2 2 4s.1 4 2 4"/><path d="M13 4h7v16h-7M13 9.3h7M13 14.6h7M16.5 4v16"/>',
  'json-yaml':
    '<path d="M9 4C7 4 7 6 7 8s0 4-2 4c2 0 2 2 2 4s0 4 2 4M15 4c2 0 2 2 2 4s0 4 2 4c-2 0-2 2-2 4s0 4-2 4"/>',
  hash: '<path d="M9 4L7 20M17 4l-2 16M5 9.5h14M4 14.5h14"/>',
  base64: '<path d="M9.5 8L5.5 12l4 4M14.5 8l4 4-4 4"/>',
  'url-encode':
    '<path d="M10 14a3.5 3.5 0 005 0l2.5-2.5a3.5 3.5 0 00-5-5L11 8"/><path d="M14 10a3.5 3.5 0 00-5 0L6.5 12.5a3.5 3.5 0 005 5L13 16"/>',
  'regex-tester':
    '<path d="M6.5 9a3 3 0 000 6M17.5 9a3 3 0 010 6"/><path d="M12 8.5v7M9 10.5l6 3M15 10.5l-6 3"/>',
  'text-diff':
    '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/><path d="M5 8h3M16 8h3M17.5 6.5v3"/>',
  fullwidth: '<path d="M3 12h18M3 12l3.5-3.5M3 12l3.5 3.5M21 12l-3.5-3.5M21 12l-3.5 3.5"/>',
  'loan-calculator':
    '<path d="M3 9.5l9-5 9 5M5 9.5v8M19 9.5v8M9 9.5v8M15 9.5v8M3 20.5h18"/>',
  bmi: '<path d="M4.5 17a7.5 7.5 0 0115 0"/><path d="M12 17l3.5-4.5"/><circle cx="12" cy="17" r="1"/>',
  'date-diff':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4"/>',
};

/** Per-category fallback when a tool has no specific icon. */
const CATEGORY_ICONS: Record<string, string> = {
  pdf: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  image:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M21 16l-5-5-7 7"/>',
  text: '<path d="M4 6h16M4 10h11M4 14h16M4 18h8"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v2"/>',
  convert: '<path d="M4 8h12l-3-3M20 16H8l3 3"/>',
  datetime: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4"/>',
  finance: '<path d="M3 9.5l9-5 9 5M5 9.5v8M19 9.5v8M3 20.5h18"/>',
  generator: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 8h3v3H8zM13 13h3v3h-3z"/>',
  dev: '<path d="M9.5 8L5.5 12l4 4M14.5 8l4 4-4 4"/>',
  file: '<path d="M14 3v5h5M6 3h8l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/>',
};

const FALLBACK = '<circle cx="12" cy="12" r="8"/>';

/** Inner SVG markup for a tool id (falling back to its category, then generic). */
export function iconInner(id: string): string {
  if (TOOL_ICONS[id]) return TOOL_ICONS[id]!;
  const tool = getTool(id);
  if (tool && CATEGORY_ICONS[tool.category]) return CATEGORY_ICONS[tool.category]!;
  return FALLBACK;
}

/** Inner SVG markup for a category icon. */
export function categoryIconInner(category: string): string {
  return CATEGORY_ICONS[category] ?? FALLBACK;
}

/** A complete <svg> string for a category icon (prerenderer). */
export function categoryIconSvg(category: string, className = '', size = 18): string {
  return `<svg class="zi${className ? ` ${className}` : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${categoryIconInner(category)}</svg>`;
}

/** A complete <svg> string for the prerenderer. */
export function iconSvg(id: string, className = '', size = 18): string {
  return `<svg class="zi${className ? ` ${className}` : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconInner(id)}</svg>`;
}
