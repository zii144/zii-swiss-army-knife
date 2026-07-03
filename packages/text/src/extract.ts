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

const IP4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

function isValidIpv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  return parts.length === 4 && parts.every((p) => p >= 0 && p <= 255);
}

/** Extract unique IPv4 addresses from text. */
export function extractIpv4(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of text.matchAll(IP4_RE)) {
    const v = m[0];
    if (v && isValidIpv4(v) && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Extract numbers (integers and decimals) from text. */
export function extractNumbers(text: string): number[] {
  return [...text.matchAll(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)]
    .map((m) => Number(m[0]))
    .filter((n) => Number.isFinite(n));
}
