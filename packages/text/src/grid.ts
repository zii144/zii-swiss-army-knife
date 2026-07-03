/** Transpose a character grid (lines as rows). */
export function transposeGrid(text: string): string {
  const lines = text.split('\n');
  if (lines.length === 0) return '';
  const maxLen = Math.max(...lines.map((l) => l.length));
  const rows = lines.map((l) => l.padEnd(maxLen, ' '));
  const out: string[] = [];
  for (let c = 0; c < maxLen; c += 1) {
    out.push(rows.map((r) => r[c] ?? ' ').join(''));
  }
  return out.join('\n').replace(/ +$/gm, '');
}
