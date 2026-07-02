/** Split on CR/LF and preserve non-empty semantics for line ops. */
function splitLines(s: string): string[] {
  return s.split(/\r?\n/);
}

/** Remove duplicate lines (first occurrence wins). */
export function dedupeLines(s: string, opts: { trim?: boolean } = {}): string {
  const trim = opts.trim ?? true;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of splitLines(s)) {
    const line = trim ? raw.trim() : raw;
    const key = trim ? line : raw;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out.join('\n');
}

export type SortLinesOrder = 'asc' | 'desc' | 'reverse';

/** Sort lines alphabetically, or reverse line order. */
export function sortLines(s: string, order: SortLinesOrder = 'asc'): string {
  const lines = splitLines(s);
  if (order === 'reverse') return [...lines].reverse().join('\n');
  const sorted = [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  if (order === 'desc') sorted.reverse();
  return sorted.join('\n');
}

/** Trim each line, collapse runs of blank lines, normalize trailing whitespace. */
export function normalizeText(s: string): string {
  const lines = splitLines(s).map((l) => l.trim());
  const out: string[] = [];
  let prevBlank = false;
  for (const line of lines) {
    const blank = line === '';
    if (blank && prevBlank) continue;
    out.push(line);
    prevBlank = blank;
  }
  while (out.length > 0 && out[0] === '') out.shift();
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

/** Reverse characters in the string, or reverse line order when `byLine` is true. */
export function reverseText(s: string, byLine = false): string {
  if (byLine) return [...splitLines(s)].reverse().join('\n');
  return [...s].reverse().join('');
}

/** Find and replace text, optionally with a RegExp (`pattern` is the source string). */
export function findReplace(
  text: string,
  pattern: string,
  replacement: string,
  useRegex: boolean,
  flags = 'g',
): string {
  if (!pattern) return text;
  if (!useRegex) return text.split(pattern).join(replacement);
  const re = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
  return text.replace(re, replacement);
}

/** Shuffle lines into random order (browser/node crypto RNG). */
export function shuffleLines(s: string): string {
  const lines = splitLines(s);
  for (let i = lines.length - 1; i > 0; i -= 1) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0]! % (i + 1);
    const tmp = lines[i];
    lines[i] = lines[j]!;
    lines[j] = tmp!;
  }
  return lines.join('\n');
}

/** Trim leading and trailing whitespace on each line. */
export function trimLines(s: string): string {
  return splitLines(s).map((l) => l.trim()).join('\n');
}

/** Remove lines that are empty or whitespace-only. */
export function removeEmptyLines(s: string): string {
  return splitLines(s).filter((l) => l.trim() !== '').join('\n');
}

/** Prefix each line with a line number. */
export function numberLines(s: string, start = 1, sep = ': '): string {
  return splitLines(s)
    .map((line, i) => `${start + i}${sep}${line}`)
    .join('\n');
}
