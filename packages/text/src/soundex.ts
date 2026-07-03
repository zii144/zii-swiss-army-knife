const MAP: Record<string, string> = {
  B: '1', F: '1', P: '1', V: '1',
  C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
  D: '3', T: '3',
  L: '4',
  M: '5', N: '5',
  R: '6',
};

/** American Soundex code (4 characters). */
export function soundex(name: string): string {
  const word = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
  if (!word) return '';
  let code = word[0]!;
  let prev = MAP[word[0]!] ?? '';
  for (let i = 1; i < word.length && code.length < 4; i += 1) {
    const ch = word[i]!;
    const digit = MAP[ch] ?? '';
    if (digit && digit !== prev) code += digit;
    prev = ch === 'H' || ch === 'W' ? prev : digit;
  }
  return (code + '000').slice(0, 4);
}
