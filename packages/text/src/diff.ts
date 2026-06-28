// Line-based diff via Longest Common Subsequence (LCS). Deterministic and
// dependency-free.

export type DiffType = 'equal' | 'add' | 'remove';

export interface DiffLine {
  type: DiffType;
  line: string;
}

function splitLines(s: string): string[] {
  // An empty string is treated as a single empty line so diffs against ''
  // behave intuitively; this mirrors common line-diff tooling.
  if (s.length === 0) return [''];
  return s.split(/\r\n|\r|\n/);
}

/**
 * Compute a line-level diff between two strings using LCS. Returns a sequence
 * of operations: 'equal' (in both), 'remove' (only in a), 'add' (only in b),
 * ordered to reconstruct b from a.
 */
export function lineDiff(a: string, b: string): DiffLine[] {
  const aLines = splitLines(a);
  const bLines = splitLines(b);
  const n = aLines.length;
  const m = bLines.length;

  // dp[i][j] = LCS length of aLines[i..] and bLines[j..].
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i -= 1) {
    const dpI = dp[i];
    const dpI1 = dp[i + 1];
    if (dpI === undefined || dpI1 === undefined) continue;
    for (let j = m - 1; j >= 0; j -= 1) {
      if (aLines[i] === bLines[j]) {
        dpI[j] = (dpI1[j + 1] ?? 0) + 1;
      } else {
        dpI[j] = Math.max(dpI1[j] ?? 0, dpI[j + 1] ?? 0);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    const aLine = aLines[i];
    const bLine = bLines[j];
    if (aLine === bLine) {
      result.push({ type: 'equal', line: aLine ?? '' });
      i += 1;
      j += 1;
      continue;
    }
    const down = dp[i + 1]?.[j] ?? 0;
    const right = dp[i]?.[j + 1] ?? 0;
    if (down >= right) {
      result.push({ type: 'remove', line: aLine ?? '' });
      i += 1;
    } else {
      result.push({ type: 'add', line: bLine ?? '' });
      j += 1;
    }
  }
  while (i < n) {
    result.push({ type: 'remove', line: aLines[i] ?? '' });
    i += 1;
  }
  while (j < m) {
    result.push({ type: 'add', line: bLines[j] ?? '' });
    j += 1;
  }
  return result;
}
