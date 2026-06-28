// Date helpers. All comparisons are done on UTC calendar days so results are
// timezone-independent and deterministic.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Strip a date to its UTC midnight epoch-day count. */
function toUtcDay(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY,
  );
}

/**
 * Whole calendar days between two dates (b - a), in UTC. Positive when `b` is later.
 * daysBetween(2026-01-01, 2026-01-31) === 30
 */
export function daysBetween(a: Date, b: Date): number {
  return toUtcDay(b) - toUtcDay(a);
}

/**
 * A new Date `n` whole days after `date` (negative `n` goes backwards), preserving
 * the time-of-day. addDays(2026-01-01, 31) -> 2026-02-01
 */
export function addDays(date: Date, n: number): Date {
  return new Date(date.getTime() + n * MS_PER_DAY);
}

/**
 * Completed whole years between `birth` and `on` (default: today is the caller's job —
 * pass it explicitly for determinism). ageInYears(2000-06-15, 2026-06-14) === 25
 */
export function ageInYears(birth: Date, on: Date): number {
  let age = on.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = on.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = on.getUTCDate() - birth.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age;
}
