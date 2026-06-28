// Full-width <-> half-width conversion and Unicode NFKC normalization.
//
// Full-width ASCII variants live in U+FF01..U+FF5E and map to the half-width
// (regular ASCII) range U+0021..U+007E by subtracting 0xFEE0. The ideographic
// space U+3000 maps to the regular space U+0020.

const FULLWIDTH_OFFSET = 0xfee0;
const IDEOGRAPHIC_SPACE = 0x3000;
const REGULAR_SPACE = 0x20;

/**
 * Convert full-width ASCII letters, digits, punctuation and the ideographic
 * space into their half-width (ASCII) equivalents. Other characters are left
 * untouched.
 */
export function toHalfWidth(s: string): string {
  let out = '';
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (code === IDEOGRAPHIC_SPACE) {
      out += String.fromCodePoint(REGULAR_SPACE);
    } else if (code >= 0xff01 && code <= 0xff5e) {
      out += String.fromCodePoint(code - FULLWIDTH_OFFSET);
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Convert half-width ASCII letters, digits, punctuation and the regular space
 * into their full-width equivalents. Other characters are left untouched.
 */
export function toFullWidth(s: string): string {
  let out = '';
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (code === REGULAR_SPACE) {
      out += String.fromCodePoint(IDEOGRAPHIC_SPACE);
    } else if (code >= 0x21 && code <= 0x7e) {
      out += String.fromCodePoint(code + FULLWIDTH_OFFSET);
    } else {
      out += ch;
    }
  }
  return out;
}

/** Apply Unicode NFKC normalization. */
export function nfkcNormalize(s: string): string {
  return s.normalize('NFKC');
}
