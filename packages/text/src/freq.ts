export interface WordCount {
  word: string;
  count: number;
}

/** Count word frequencies (letters/digits/underscore), case-insensitive. */
export function wordFrequency(text: string, limit = 50): WordCount[] {
  const counts = new Map<string, number>();
  for (const m of text.toLowerCase().matchAll(/\b[\p{L}\p{N}_]+\b/gu)) {
    const w = m[0];
    if (!w) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, Math.max(1, Math.min(500, Math.trunc(limit))));
}

/** Count character frequencies (ignores whitespace by default). */
export function charFrequency(text: string, limit = 50, includeWhitespace = false): WordCount[] {
  const counts = new Map<string, number>();
  for (const ch of text) {
    if (!includeWhitespace && /\s/.test(ch)) continue;
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, Math.max(1, Math.min(500, Math.trunc(limit))));
}
