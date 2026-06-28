// Case conversions. Words are detected from camelCase / PascalCase boundaries,
// runs of digits, and any non-alphanumeric separators (spaces, _, -, etc.).

/**
 * Split an arbitrary string into lower-cased word tokens. Handles camelCase /
 * PascalCase humps, acronyms (e.g. "HTMLParser" -> ["html", "parser"]),
 * digit runs, and any separator characters.
 */
function splitWords(s: string): string[] {
  const matches = s.match(/[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);
  if (!matches) return [];
  return matches.map((w) => w.toLowerCase());
}

function capitalize(word: string): string {
  if (word.length === 0) return word;
  const first = word[0];
  if (first === undefined) return word;
  return first.toUpperCase() + word.slice(1);
}

/** Convert to camelCase (first word lower, subsequent words capitalized). */
export function toCamelCase(s: string): string {
  const words = splitWords(s);
  if (words.length === 0) return '';
  return words.map((w, i) => (i === 0 ? w : capitalize(w))).join('');
}

/** Convert to snake_case. */
export function toSnakeCase(s: string): string {
  return splitWords(s).join('_');
}

/** Convert to kebab-case. */
export function toKebabCase(s: string): string {
  return splitWords(s).join('-');
}

/** Convert to Title Case (each word capitalized, space-separated). */
export function toTitleCase(s: string): string {
  return splitWords(s).map(capitalize).join(' ');
}

/** Convert to Sentence case (first word capitalized, rest lower, space-separated). */
export function toSentenceCase(s: string): string {
  const words = splitWords(s);
  if (words.length === 0) return '';
  return words.map((w, i) => (i === 0 ? capitalize(w) : w)).join(' ');
}

/** Upper-case the entire string. */
export function toUpperCase(s: string): string {
  return s.toUpperCase();
}

/** Lower-case the entire string. */
export function toLowerCase(s: string): string {
  return s.toLowerCase();
}
