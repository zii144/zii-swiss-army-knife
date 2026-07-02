/** Convert tabs to spaces. */
export function tabsToSpaces(text: string, tabWidth = 4): string {
  const w = Math.max(1, Math.trunc(tabWidth));
  return text.replace(/\t/g, ' '.repeat(w));
}

/** Convert leading space runs to tabs (simple heuristic). */
export function spacesToTabs(text: string, tabWidth = 4): string {
  const w = Math.max(1, Math.trunc(tabWidth));
  return text
    .split('\n')
    .map((line) => {
      let out = '';
      let i = 0;
      while (i < line.length) {
        if (line[i] === ' ') {
          let spaces = 0;
          while (i < line.length && line[i] === ' ') {
            spaces += 1;
            i += 1;
          }
          while (spaces >= w) {
            out += '\t';
            spaces -= w;
          }
          out += ' '.repeat(spaces);
        } else {
          out += line[i];
          i += 1;
        }
      }
      return out;
    })
    .join('\n');
}

/** Reverse the order of words (whitespace-separated). */
export function reverseWords(text: string): string {
  const parts = text.trim().split(/\s+/);
  return parts.length === 0 || (parts.length === 1 && parts[0] === '') ? '' : parts.reverse().join(' ');
}
