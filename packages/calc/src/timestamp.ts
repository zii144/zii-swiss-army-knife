export type UnixUnit = 's' | 'ms';

/** Convert a Unix timestamp to an ISO 8601 UTC string. */
export function unixToIso(unix: number, unit: UnixUnit = 'ms'): string {
  const ms = unit === 's' ? unix * 1000 : unix;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) throw new RangeError('Invalid timestamp');
  return d.toISOString();
}

/** Parse an ISO or RFC date string to a Unix timestamp. */
export function isoToUnix(iso: string, unit: UnixUnit = 'ms'): number {
  const ms = Date.parse(iso.trim());
  if (Number.isNaN(ms)) throw new RangeError('Invalid date');
  return unit === 's' ? Math.floor(ms / 1000) : ms;
}

/** Current Unix timestamp. */
export function nowUnix(unit: UnixUnit = 'ms'): number {
  return unit === 's' ? Math.floor(Date.now() / 1000) : Date.now();
}

/** Parse a numeric Unix timestamp (auto-detect seconds vs milliseconds). */
export function parseUnixTimestamp(raw: string, prefer: UnixUnit = 'ms'): number {
  const n = Number(raw.trim());
  if (!Number.isFinite(n)) throw new RangeError('Invalid number');
  if (prefer === 's') return Math.floor(n);
  if (Math.abs(n) < 1e12) return n * 1000;
  return n;
}
