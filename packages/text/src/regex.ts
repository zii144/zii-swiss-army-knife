/**
 * Regex tester: run a pattern over text and report every match with its
 * captured groups and position — the data a "regex tester" tool UI needs. Pure,
 * offline, deterministic.
 */

/** A single regex match. */
export interface RegexMatch {
  /** The full matched substring. */
  match: string;
  /** Start index in the input. */
  index: number;
  /** Positional capture groups (group 1, 2, …); `undefined` if not captured. */
  groups: (string | undefined)[];
  /** Named capture groups, if the pattern uses any. */
  named: Record<string, string | undefined>;
}

/** Result of {@link testRegex}. */
export interface RegexResult {
  valid: boolean;
  /** Compile error message when `valid` is false. */
  error?: string;
  matches: RegexMatch[];
}

/**
 * Compile `pattern` with `flags` and collect all matches in `input`. Always
 * scans globally (the `g` flag is added if absent) and is hard-capped to avoid
 * pathological zero-width loops. Invalid patterns return `{ valid: false }`
 * rather than throwing.
 */
export function testRegex(pattern: string, input: string, flags = ''): RegexResult {
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : String(err), matches: [] };
  }

  const matches: RegexMatch[] = [];
  const MAX = 10000;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    matches.push({
      match: m[0],
      index: m.index,
      groups: m.slice(1),
      named: { ...(m.groups ?? {}) },
    });
    if (m.index === re.lastIndex) re.lastIndex += 1; // advance past zero-width match
    if (matches.length >= MAX) break;
  }
  return { valid: true, matches };
}
