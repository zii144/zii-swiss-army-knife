function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Format seconds as M:SS or H:MM:SS. */
export function formatDuration(totalSeconds: number): string {
  const neg = totalSeconds < 0;
  let s = Math.abs(Math.trunc(totalSeconds));
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  const body = h > 0 ? `${h}:${pad2(m)}:${pad2(s)}` : `${m}:${pad2(s)}`;
  return neg ? `-${body}` : body;
}

/** Parse M:SS, H:MM:SS, or plain seconds into total seconds. */
export function parseDuration(input: string): number {
  const trimmed = input.trim();
  const neg = trimmed.startsWith('-');
  const body = neg ? trimmed.slice(1).trim() : trimmed;
  if (body === '') throw new RangeError('Invalid duration');
  if (!body.includes(':')) {
    const n = Number(body);
    if (!Number.isFinite(n)) throw new RangeError('Invalid duration');
    return neg ? -n : n;
  }
  const parts = body.split(':').map((p) => Number(p));
  if (parts.some((p) => !Number.isFinite(p))) throw new RangeError('Invalid duration');
  let sec = 0;
  if (parts.length === 3) sec = parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  else if (parts.length === 2) sec = parts[0]! * 60 + parts[1]!;
  else throw new RangeError('Invalid duration');
  return neg ? -sec : sec;
}
