/** Repeat text a number of times, optionally separated by a string. */
export function repeatText(text: string, times: number, sep = ''): string {
  if (times < 0 || !Number.isInteger(times)) throw new RangeError('times must be a non-negative integer');
  return Array.from({ length: times }, () => text).join(sep);
}
