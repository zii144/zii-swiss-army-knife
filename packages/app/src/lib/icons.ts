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
  'pdf-compress':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 11h6M12 8v6M10 12.5l2 1.5 2-1.5"/>',
  'zip-create':
    '<rect x="3.5" y="6" width="17" height="14" rx="2"/><path d="M12 6v14M10.5 9.2h3M10.5 12h3M10.5 14.8h3"/>',
  'zip-extract':
    '<rect x="3.5" y="6" width="17" height="14" rx="2"/><path d="M12 16.5V9M9 12l3-3 3 3"/>',
  'heic-convert':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M21 16l-5-5-4 4"/>',
  discount:
    '<path d="M3.5 12.5l8.5-8.5 8 1 1 8-8.5 8.5z"/><circle cx="15.5" cy="8.5" r="1.1"/><path d="M9.5 15l5.5-5.5"/>',
  savings:
    '<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  'cooking-convert':
    '<path d="M5 8h12l-1 10.2a2 2 0 01-2 1.8H8a2 2 0 01-2-1.8L5 8z"/><path d="M17 10h1.4a1.6 1.6 0 010 3.2H16.7M8 5v3M11.5 4v4M15 5v3"/>',
  password:
    '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><circle cx="12" cy="15" r="1.2"/>',
  uuid:
    '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10v4M10 10v4M13.5 10v4M17 10v4"/>',
  'jwt-decode':
    '<path d="M9.5 8L5.5 12l4 4M14.5 8l4 4-4 4"/><circle cx="12" cy="12" r="1"/>',
  'base-convert':
    '<path d="M4 8h4v8H4zM4 8a2 2 0 012-2h0a2 2 0 012 2M16 6h4l-4 10h4"/>',
  'color-convert':
    '<path d="M12 3a9 9 0 100 18 3 3 0 002-5.2c-.5-.5-.3-1.8.8-1.8H18a3 3 0 003-3A9 9 0 0012 3z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',
  cron:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2M4 5l2 2M20 5l-2 2"/>',
  'image-resize':
    '<rect x="3" y="3" width="12" height="12" rx="1.5"/><path d="M15 15h6v6h-6zM18 15v6M15 18h6"/><path d="M9 9l4 4"/>',
  'image-crop':
    '<path d="M6 2v14a2 2 0 002 2h14"/><path d="M2 6h14a2 2 0 012 2v14"/>',
  'exif-strip':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M21 16l-5-5-7 7"/><path d="M4 4l16 16"/>',
  favicon:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="12" cy="12" r="4"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/>',
  'pdf-rotate':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8a3 3 0 013-3 3 3 0 013 3M15 8h-2.5M15 8V5.5"/>',
  'pdf-watermark':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 16l8-8M9.5 9.5h.01M14.5 14.5h.01" stroke-dasharray="0.1 3"/>',
  'pdf-organize':
    '<rect x="4" y="4" width="10" height="13" rx="1.5"/><rect x="10" y="7" width="10" height="13" rx="1.5"/><path d="M13 13.5h4M13 16h4"/>',
  'pdf-page-numbers':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 17.5h1.5v-3H9m5 0h1.5v3H14v-1.5h1.5"/>',
  scientific:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 7h10M7 11h2M11 11h2M15 11h2M7 15h2M11 15h2M15 15v3"/>',
  timezone:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2M3.5 12h17M12 3.5c2.5 2 2.5 15 0 17M12 3.5c-2.5 2-2.5 15 0 17"/>',
  'checksum-validate':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15l2.5 2.5L14 13" transform="translate(-1 -2)"/><path d="M3 9.5h18"/>',
  'sales-tax':
    '<path d="M12 3v18M8 6.5a3 3 0 00-3 3c0 4 10 2 10 6a3 3 0 01-3 3H8"/><path d="M16 7.5a3 3 0 00-2.5-1.5"/>',
  'business-days':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4M8.5 13.5l2 2 4-4"/>',
  zodiac:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18"/>',
  'era-convert':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4"/><path d="M8 15h3M14 13v4l2-2"/>',
  'cjk-convert':
    '<path d="M4 6h7M7.5 6v3c0 3-1.5 5-3.5 6M6 10c0 2 1.5 3.5 4 4.5"/><path d="M14 20l3-9 3 9M14.8 17.5h4.4"/>',
  'html-entities':
    '<path d="M9.5 8L5.5 12l4 4M14.5 8l4 4-4 4"/><path d="M12.5 6l-1 12"/>',
  'lunar-convert':
    '<path d="M15 3a8 8 0 100 18 6.5 6.5 0 010-18z"/><path d="M8 8.5v.01M7 12v.01M9 15v.01"/>',
  rokuyo:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4M8.5 13h7M8.5 16.5h4"/>',
  'solar-terms':
    '<circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2"/>',
  'xml-json':
    '<path d="M6 4l-3 8 3 8M18 4l3 8-3 8"/><path d="M10 8l-1 8M15 8l-1 8"/>',
  'csv-excel':
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16M15 4v16"/>',
  barcode:
    '<path d="M4 6v12M7 6v12M9.5 6v12M12 6v12M14.5 6v12M17 6v12M20 6v12" stroke-linecap="butt"/>',
  ocr:
    '<path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M20 8V5.5A1.5 1.5 0 0018.5 4H16M4 16v2.5A1.5 1.5 0 005.5 20H8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16"/><path d="M8 10h8M8 13h8M8 16h5"/>',
  'bg-remove':
    '<rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 2.5"/><path d="M9 14l2.5-3 2 2.5L15.5 10l2.5 4"/><circle cx="8.5" cy="8.5" r="1.3"/>',
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
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  daily: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
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
