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
  'qr-batch':
    '<rect x="3.5" y="3.5" width="5" height="5" rx="1"/><rect x="10" y="3.5" width="5" height="5" rx="1"/><rect x="16.5" y="3.5" width="4" height="5" rx="1"/><rect x="3.5" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/><rect x="16.5" y="10" width="4" height="5" rx="1"/><rect x="3.5" y="16.5" width="5" height="4" rx="1"/><rect x="10" y="16.5" width="5" height="4" rx="1"/>',
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
  'csv-clean':
    '<path d="M8.5 4C6.6 4 6.5 6 6.5 8s0 4-2 4c2 0 2 2 2 4s.1 4 2 4"/><path d="M13 4h7v16h-7M13 9.3h7M13 14.6h7"/><path d="M15 17l2-2 2 2"/>',
  slugify:
    '<path d="M4 12h16M7 8l-3 4 3 4M17 8l3 4-3 4"/><path d="M10 12h4"/>',
  'lorem-ipsum':
    '<path d="M4 7h16M4 11h12M4 15h16M4 19h10"/><path d="M18 17l2 2-2 2"/>',
  'line-dedupe':
    '<path d="M4 8h16M4 12h16M4 16h12"/><path d="M18 14l2 2-2 2"/>',
  'sort-lines':
    '<path d="M4 6h12M4 10h16M4 14h10"/><path d="M18 8v8M15 11l3-3 3 3"/>',
  'text-normalize':
    '<path d="M4 8h16M4 12h16M4 16h16"/><path d="M6 6l12 12"/>',
  'reverse-text':
    '<path d="M7 8l-4 4 4 4M17 8l4 4-4 4"/><path d="M11 12h2"/>',
  hmac:
    '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><path d="M9 14h6"/>',
  'random-string':
    '<path d="M4 12h16M6 8v8M10 6v12M14 9v6M18 7v10"/>',
  'roman-numeral':
    '<path d="M6 4v16M10 4v16M14 8h6M14 12h5M14 16h6"/>',
  'data-size':
    '<ellipse cx="12" cy="8" rx="7" ry="3"/><path d="M5 8v8c0 1.7 3.1 3 7 3s7-1.3 7-3V8"/>',
  'find-replace':
    '<path d="M4 8h10M4 12h14M4 16h8"/><circle cx="18" cy="8" r="3"/><path d="M20.5 6.5l2 2"/>',
  'extract-urls':
    '<path d="M10 14a3.5 3.5 0 005 0l2.5-2.5a3.5 3.5 0 00-5-5L11 8"/><path d="M14 10a3.5 3.5 0 00-5 0L6.5 12.5a3.5 3.5 0 005 5L13 16"/>',
  rot13:
    '<path d="M4 12h16M7 8l-3 4 3 4M17 8l3 4-3 4"/>',
  'shuffle-lines':
    '<path d="M4 7h16M4 12h16M4 17h16"/><path d="M18 5l2 2-2 2M18 15l2 2-2 2"/>',
  'word-frequency':
    '<path d="M4 18V6M8 18V10M12 18V4M16 18v-6M20 18V8"/>',
  'area-convert':
    '<rect x="4" y="8" width="16" height="10" rx="1"/><path d="M8 8V5h8v3"/>',
  'speed-convert':
    '<path d="M4 14h16M6 10l4-4 4 4 4-4"/><circle cx="18" cy="16" r="2"/>',
  'json-escape':
    '<path d="M6 4l-3 8 3 8M18 4l3 8-3 8"/><path d="M9 12h6"/>',
  nanoid:
    '<path d="M4 12h16M6 8v8M10 6v12M14 9v6M18 7v10"/>',
  totp:
    '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h6M12 11v5M9 14h6"/>',
  'trim-lines':
    '<path d="M4 6h16M4 12h12M4 18h16"/><path d="M18 10l2 2-2 2"/>',
  'remove-empty-lines':
    '<path d="M4 8h16M4 16h16"/><path d="M8 12h8"/>',
  'number-lines':
    '<path d="M4 6h3M4 12h3M4 18h3"/><path d="M9 6h11M9 12h11M9 18h11"/>',
  'text-wrap':
    '<path d="M4 6h16M4 12h10M4 18h14"/><path d="M18 10v8"/>',
  'morse-code':
    '<path d="M4 12h2M8 12h1M11 12h3M16 12h1M19 12h2"/><path d="M6 8v8M17 8v8"/>',
  'binary-text':
    '<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M8 10v4M12 9v6M16 10v4"/>',
  levenshtein:
    '<path d="M6 18L18 6M8 6h2v2M16 16h2v2"/>',
  'strip-html':
    '<path d="M4 7l4 10M20 7l-4 10M9 7h6M12 17v-4"/>',
  'pressure-convert':
    '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  'timestamp-convert':
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  'repeat-text':
    '<path d="M8 6h8v12H8z"/><path d="M4 10h2M4 14h2M18 10h2M18 14h2"/>',
  'join-lines':
    '<path d="M4 8h16M4 16h16"/><path d="M12 8v8M9 11l3-3 3 3M9 21l3-3 3 3"/>',
  'split-text':
    '<path d="M4 8h16M4 16h16"/><path d="M12 8v8M15 11l-3-3-3 3M15 21l-3 3-3-3"/>',
  'caesar-cipher':
    '<circle cx="8" cy="12" r="4"/><path d="M12 12h8M16 8v8"/>',
  'remove-diacritics':
    '<path d="M6 18l6-12 6 12"/><path d="M8 14h8"/>',
  'palindrome-check':
    '<path d="M4 12h16"/><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  'grep-lines':
    '<circle cx="10" cy="10" r="6"/><path d="M15 15l4 4M8 10h4"/>',
  'indent-lines':
    '<path d="M4 6h16M4 12h12M4 18h16"/><path d="M18 8v8"/>',
  'energy-convert':
    '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  'duration-format':
    '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8M8 14h5"/>',
  'hex-text':
    '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h2v6H9zM13 9h2v6h-2z"/>',
  'unicode-escape':
    '<path d="M6 4l-3 8 3 8M18 4l3 8-3 8"/><path d="M10 12h4"/>',
  'reverse-words':
    '<path d="M7 8l-3 4 3 4M17 8l3 4-3 4"/><path d="M11 12h2"/>',
  'tabs-spaces':
    '<path d="M4 6h16M4 12h12M4 18h16"/><path d="M18 10v8"/>',
  rot47:
    '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  'hamming-distance':
    '<path d="M6 18L18 6"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
  'volume-convert':
    '<path d="M8 4h8l2 16H6L8 4z"/><path d="M9 10h6"/>',
  'angle-convert':
    '<path d="M12 4v8l5 3"/><circle cx="12" cy="12" r="9"/>',
  'char-frequency':
    '<path d="M5 18V8M9 18V4M13 18v-6M17 18V10M21 18V6"/>',
  'line-prefix':
    '<path d="M4 8h6M4 12h10M4 16h8"/><path d="M16 6v12"/>',
  'mass-convert':
    '<path d="M12 4v16M8 8h8M6 20h12"/>',
  'temperature-convert':
    '<path d="M9 4a3 3 0 016 0v8a4 4 0 11-6 0V4z"/><path d="M12 16v4"/>',
  'power-convert':
    '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  'frequency-convert':
    '<path d="M4 12c2-4 4 4 6 0s4 4 6 0 4 4 6 0"/>',
  'truncate-text':
    '<path d="M4 8h10M4 12h14M4 16h6"/><path d="M18 14l2 2-2 2"/>',
  'pad-text':
    '<rect x="4" y="8" width="16" height="8" rx="1"/><path d="M8 12h8"/>',
  'zero-width-clean':
    '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'markdown-strip':
    '<path d="M4 6h16M4 12h16M4 18h10"/><path d="M18 16l2 2-2 2"/>',
  'atbash-cipher':
    '<path d="M4 12h16M7 7l5 10M13 7l5 10"/>',
  'base32-codec':
    '<path d="M6 4v16M10 4v16M14 8v8M18 6v12"/>',
  'length-convert':
    '<path d="M4 12h16M6 8v8M18 8v8"/>',
  soundex:
    '<circle cx="12" cy="10" r="6"/><path d="M8 16h8"/>',
  'jaccard-similarity':
    '<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M10.5 12h3"/>',
  'quoted-printable':
    '<path d="M4 6h16M4 12h12M4 18h8"/><path d="M18 16l2 2"/>',
  'extract-numbers':
    '<path d="M4 18V6M8 18V10M12 18V4M16 18v-6M20 18V8"/>',
  'extract-ipv4':
    '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8M8 14h4"/>',
  'transpose-grid':
    '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',
  'gcd-lcm':
    '<path d="M8 6v12M16 6v12"/><path d="M6 10h12M6 14h12"/>',
  'string-similarity':
    '<path d="M6 18L18 6"/><path d="M8 8h2v2M16 16h2v2"/>',
  'mask-emails':
    '<rect x="4" y="8" width="16" height="10" rx="2"/><path d="M4 10l8 5 8-5"/>',
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
  'currency-convert':
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.5 9.5c.8-1.2 2.2-2 3.8-2 2.2 0 4 1.5 4 3.5S15.5 14 13.3 14H11M14.5 14.5c-.8 1.2-2.2 2-3.8 2-2.2 0-4-1.5-4-3.5S8.5 10 10.7 10H13"/>',
  'json-format':
    '<path d="M6 4l-3 8 3 8M18 4l3 8-3 8"/><path d="M10 8h4M10 12h4M10 16h4"/>',
  'paycheck-calc':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9.5h10M7 13h6"/><path d="M16 13l1.5 1.5L16 16"/>',
  'video-convert':
    '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 10l5 3-5 3z"/><path d="M4 8h16M4 16h16"/>',
  'audio-extract':
    '<path d="M9 18V6l10-2v14"/><path d="M6 16a3 3 0 004 2.8V7.2A3 3 0 016 10"/><path d="M19 14a3 3 0 01-3 2.8V9.2A3 3 0 0119 12"/>',
  'reminder-planner':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4M8.5 13.5l2 2 4-4"/>',
  'images-to-pdf':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="3" y="5" width="10" height="8" rx="1.5"/><circle cx="6" cy="8" r="1"/><path d="M11 12l2-2 2 2"/>',
  'pdf-to-images':
    '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="3" y="5" width="10" height="8" rx="1.5"/><path d="M11 12l2-2 2 2"/>',
  'docx-to-pdf':
    '<path d="M14 3v5h5M6 3h8l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M9 13h6M9 16h4"/>',
  'pptx-to-pdf':
    '<path d="M14 3v5h5M6 3h8l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><rect x="8" y="12" width="8" height="5" rx="1"/>',
  'pdf-to-word':
    '<path d="M14 3v5h5M6 3h8l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M9 13h6M9 16h4"/><path d="M17 14l2 2-4 4"/>',
  'ca-sin':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9.5h10M7 12.5h10M7 15.5h6"/>',
  'au-tfn':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9.5h10M7 12.5h10M7 15.5h6"/>',
  'tw-arc':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  'hk-br':
    '<path d="M4 20V8l8-4 8 4v12M4 20h16M9 20v-5h6v5M9 11h.01M15 11h.01"/>',
  'tw-national-id':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  'tw-ubn':
    '<path d="M4 20V8l8-4 8 4v12M4 20h16M9 20v-5h6v5M9 11h.01M15 11h.01"/>',
  'hk-id':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  'jp-mynumber':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9.5h10M7 12.5h10M7 15.5h6"/>',
  'jp-corp-number':
    '<path d="M4 20V8l8-4 8 4v12M4 20h16M9 20v-5h6v5M9 11h.01M15 11h.01"/>',
  'us-ssn':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  'us-zip':
    '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.3"/>',
  'us-routing':
    '<path d="M4 20h16M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M12 3 4 8h16z"/>',
  'jp-postal':
    '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.3"/>',
  'hk-phone':
    '<path d="M6.5 3h4l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2z"/>',
  'tw-mobile':
    '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
  'us-ein':
    '<path d="M4 20V8l8-4 8 4v12M4 20h16M9 20v-5h6v5M9 11h.01M15 11h.01"/>',
  'us-phone':
    '<path d="M6.5 3h4l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2z"/>',
  'uk-postcode':
    '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.3"/>',
  'uk-nino':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4M5.5 16c.5-1.6 1.7-2.5 3-2.5s2.5.9 3 2.5"/>',
  'uk-sort-code':
    '<path d="M4 20h16M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M12 3 4 8h16z"/>',
  'tw-postal':
    '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.3"/>',
  'ca-takehome':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-income-tax':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-cpp':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-ei':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-gst-hst':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-rrsp':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-tfsa':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ca-postal':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'ca-transit':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'au-takehome':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'au-help':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'au-medicare':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'au-super':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'au-gst':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'au-abn':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'au-bsb':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'au-postcode':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'au-leave':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-takehome':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-four-insurances':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-severance':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-annual-leave':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-overtime':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'ko-brn':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'ko-rrn':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'ko-postal':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'ko-phone':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'ko-vat':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-takehome':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-income-tax':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-vat':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-iban':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'de-plz':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'de-tax-id':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'de-holidays':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  'de-vacation':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-commute':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'de-severance':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'fr-brut-net':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'fr-employer-cost':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'fr-pas':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'fr-tva':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
  'fr-iban-rib':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'fr-siren-siret':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'fr-nir':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'fr-code-postal':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9.5h5M13 13h4"/>',
  'fr-holidays':
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  'fr-conges':
    '<path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7"/>',
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
