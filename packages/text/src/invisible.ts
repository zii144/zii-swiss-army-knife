const ZERO_WIDTH = new Set([0x200b, 0x200c, 0x200d, 0xfeff, 0x2060, 0x180e]);

function isZeroWidth(ch: string): boolean {
  const cp = ch.codePointAt(0);
  return cp !== undefined && ZERO_WIDTH.has(cp);
}

/** Remove zero-width and invisible formatting characters. */
export function removeZeroWidth(text: string): string {
  return [...text].filter((ch) => !isZeroWidth(ch)).join('');
}

/** List zero-width code points found in text. */
export function findZeroWidth(text: string): string[] {
  const found = new Set<string>();
  for (const ch of text) {
    if (isZeroWidth(ch)) {
      found.add(`U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`);
    }
  }
  return [...found];
}
