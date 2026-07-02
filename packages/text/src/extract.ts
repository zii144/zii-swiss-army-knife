const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;

/** Extract unique email addresses from text (first-seen order). */
export function extractEmails(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of text.matchAll(EMAIL_RE)) {
    const v = m[0];
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Extract unique http(s) URLs from text (first-seen order). */
export function extractUrls(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of text.matchAll(URL_RE)) {
    const v = m[0].replace(/[.,;:!?)]+$/, '');
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}
