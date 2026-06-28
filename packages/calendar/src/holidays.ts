/** Holiday resolution and business-day math (Gregorian, offline, deterministic). */

import type { LocalePack } from '@zii/locale';

export interface ResolvedHoliday {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  name: string;
}

/** ISO date regex (YYYY-MM-DD), used to validate inputs deterministically. */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse a strict YYYY-MM-DD string to its [year, month, day] parts. */
function parseIso(iso: string): [number, number, number] {
  const m = ISO_DATE.exec(iso);
  if (m === null) {
    throw new RangeError(`Expected an ISO date (YYYY-MM-DD), received: ${iso}`);
  }
  // Capture groups 1..3 are guaranteed present when the regex matches.
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  return [year, month, day];
}

/** Build a UTC Date from a strict ISO date string. */
function isoToUtcDate(iso: string): Date {
  const [year, month, day] = parseIso(iso);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format a Date's UTC fields as YYYY-MM-DD. */
function utcDateToIso(date: Date): string {
  const y = String(date.getUTCFullYear()).padStart(4, '0');
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

/**
 * Resolve the holidays declared in a locale pack for a given Gregorian year.
 * Filters `pack.holidays.list` to entries whose ISO date falls in `year`.
 * Returns an empty array if the pack declares no holidays.
 */
export function resolveHolidays(pack: LocalePack, year: number): ResolvedHoliday[] {
  const list = pack.holidays?.list ?? [];
  const prefix = `${String(year).padStart(4, '0')}-`;
  const result: ResolvedHoliday[] = [];
  for (const h of list) {
    if (h.date.startsWith(prefix)) {
      result.push({ date: h.date, name: h.name });
    }
  }
  return result;
}

export interface SubstituteOptions {
  /**
   * Also shift Saturdays forward to the next business day (Monday).
   * Defaults to false (only Sundays are substituted).
   */
  substituteSaturday?: boolean;
}

/**
 * "Substitute holiday" (振替休日) rule: if the given date lands on a Sunday,
 * return the next Monday. With `substituteSaturday`, a Saturday is shifted to
 * the following Monday as well. Otherwise the date is returned unchanged.
 */
export function substituteIfWeekend(isoDate: string, opts: SubstituteOptions = {}): string {
  const date = isoToUtcDate(isoDate);
  const dow = date.getUTCDay(); // 0 = Sunday, 6 = Saturday
  if (dow === 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    return utcDateToIso(date);
  }
  if (dow === 6 && opts.substituteSaturday === true) {
    date.setUTCDate(date.getUTCDate() + 2);
    return utcDateToIso(date);
  }
  return isoDate;
}

/**
 * True when `date` is a working day: not a weekend and not in `holidaysIso`.
 * Holiday matching uses the date's UTC fields formatted as YYYY-MM-DD.
 */
export function isBusinessDay(date: Date, holidaysIso: string[]): boolean {
  const dow = date.getUTCDay();
  if (dow === 0 || dow === 6) {
    return false;
  }
  const iso = utcDateToIso(date);
  return !holidaysIso.includes(iso);
}

/**
 * Count business days in the half-open interval [a, b): days strictly before
 * `b` are counted, `a` is included. If `b <= a` the result is 0. Order does not
 * otherwise matter — the smaller of the two is treated as the start.
 */
export function businessDaysBetween(a: Date, b: Date, holidaysIso: string[]): number {
  const startMs = Math.min(a.getTime(), b.getTime());
  const endMs = Math.max(a.getTime(), b.getTime());
  // Normalize to UTC midnight to iterate whole days deterministically.
  const cursor = new Date(startMs);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(endMs);
  end.setUTCHours(0, 0, 0, 0);

  const holidaySet = new Set(holidaysIso);
  let count = 0;
  while (cursor.getTime() < end.getTime()) {
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6 && !holidaySet.has(utcDateToIso(cursor))) {
      count += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}
