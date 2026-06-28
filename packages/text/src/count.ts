// Character / word / line counting with a per-script breakdown using Unicode
// code-point ranges. Iteration is over code points (via the string iterator)
// so astral characters count as a single character.

export interface ScriptCounts {
  han: number;
  hiragana: number;
  katakana: number;
  latin: number;
  digit: number;
  punct: number;
  other: number;
}

export interface TextCounts {
  chars: number;
  charsNoSpaces: number;
  lines: number;
  words: number;
  byScript: ScriptCounts;
}

function isWhitespace(code: number): boolean {
  // Common ASCII whitespace plus the ideographic space.
  return (
    code === 0x20 || // space
    code === 0x09 || // tab
    code === 0x0a || // LF
    code === 0x0d || // CR
    code === 0x0c || // FF
    code === 0x0b || // VT
    code === 0x3000 // ideographic space
  );
}

function isHan(code: number): boolean {
  // CJK Unified Ideographs (一-鿿 == U+4E00..U+9FFF) plus the common
  // extension block U+3400..U+4DBF.
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

function isHiragana(code: number): boolean {
  // U+3041..U+309F (぀-ゟ covers the block start/end markers used in spec).
  return code >= 0x3040 && code <= 0x309f;
}

function isKatakana(code: number): boolean {
  // U+30A0..U+30FF (゠-ヿ).
  return code >= 0x30a0 && code <= 0x30ff;
}

function isLatin(code: number): boolean {
  return (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a);
}

function isDigit(code: number): boolean {
  return code >= 0x30 && code <= 0x39;
}

function isAsciiPunct(code: number): boolean {
  return (
    (code >= 0x21 && code <= 0x2f) ||
    (code >= 0x3a && code <= 0x40) ||
    (code >= 0x5b && code <= 0x60) ||
    (code >= 0x7b && code <= 0x7e)
  );
}

/**
 * Count characters, non-space characters, lines, words, and a per-script
 * breakdown of a string. Counting is by Unicode code point.
 */
export function countText(s: string): TextCounts {
  const byScript: ScriptCounts = {
    han: 0,
    hiragana: 0,
    katakana: 0,
    latin: 0,
    digit: 0,
    punct: 0,
    other: 0,
  };

  let chars = 0;
  let charsNoSpaces = 0;

  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    chars += 1;
    if (!isWhitespace(code)) {
      charsNoSpaces += 1;
    }

    if (isHan(code)) byScript.han += 1;
    else if (isHiragana(code)) byScript.hiragana += 1;
    else if (isKatakana(code)) byScript.katakana += 1;
    else if (isLatin(code)) byScript.latin += 1;
    else if (isDigit(code)) byScript.digit += 1;
    else if (isAsciiPunct(code)) byScript.punct += 1;
    else if (isWhitespace(code)) {
      // Whitespace is not attributed to any script bucket.
    } else byScript.other += 1;
  }

  // Lines: empty string -> 0 lines; otherwise count of newline-separated parts.
  const lines = s.length === 0 ? 0 : s.split(/\r\n|\r|\n/).length;

  // Words: runs of non-whitespace separated by whitespace.
  const trimmed = s.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;

  return { chars, charsNoSpaces, lines, words, byScript };
}
