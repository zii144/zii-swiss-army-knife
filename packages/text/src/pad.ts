export type PadAlign = 'left' | 'right' | 'center';

/** Truncate text to a maximum length with an optional ellipsis. */
export function truncateText(text: string, maxLen: number, ellipsis = '…'): string {
  if (maxLen < 0) throw new RangeError('maxLen must be >= 0');
  if (text.length <= maxLen) return text;
  if (maxLen === 0) return '';
  if (ellipsis.length >= maxLen) return text.slice(0, maxLen);
  return text.slice(0, maxLen - ellipsis.length) + ellipsis;
}

/** Pad text to a minimum width. */
export function padText(text: string, width: number, align: PadAlign = 'right', padChar = ' '): string {
  if (width <= text.length) return text;
  if (padChar.length !== 1) throw new RangeError('padChar must be one character');
  const pad = width - text.length;
  if (align === 'left') return text + padChar.repeat(pad);
  if (align === 'right') return padChar.repeat(pad) + text;
  const left = Math.floor(pad / 2);
  return padChar.repeat(left) + text + padChar.repeat(pad - left);
}
