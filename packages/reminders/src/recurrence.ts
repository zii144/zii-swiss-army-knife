/** Recurrence resolution: next/upcoming fire dates, UTC + deterministic. */

import { isBusinessDay } from '@zii/calendar';
import type { Reminder, Recurrence } from './types';

/** ISO date regex (YYYY-MM-DD). */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse a strict YYYY-MM-DD string into a UTC-midnight Date. */
function isoToUtcDate(iso: string): Date {
  const m = ISO_DATE.exec(iso);
  if (m === null) {
    throw new RangeError(`Expected an ISO date (YYYY-MM-DD), received: ${iso}`);
  }
  // Groups 1..3 are guaranteed present when the regex matches.
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format a Date's UTC fields as YYYY-MM-DD. */
export function utcDateToIso(date: Date): string {
  const y = String(date.getUTCFullYear()).padStart(4, '0');
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

/** Truncate to UTC midnight (drops any time-of-day component). */
function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Add `days` whole days to a UTC-midnight Date, returning a new Date. */
function addUtcDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

/** Number of days in a given UTC month (1-based month). */
function daysInUtcMonth(year: number, month1: number): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, month1, 0)).getUTCDate();
}

/**
 * The first raw occurrence on/after `from` for a recurrence, before any
 * holiday roll-forward. Returns undefined only for a 'once' date in the past.
 */
function rawOccurrenceOnOrAfter(recurrence: Recurrence, from: Date): Date | undefined {
  const base = startOfUtcDay(from);
  switch (recurrence.kind) {
    case 'once': {
      const date = isoToUtcDate(recurrence.date);
      return date.getTime() >= base.getTime() ? date : undefined;
    }
    case 'daily': {
      return base;
    }
    case 'weekly': {
      const target = ((recurrence.weekday % 7) + 7) % 7;
      const delta = (target - base.getUTCDay() + 7) % 7;
      return addUtcDays(base, delta);
    }
    case 'monthly': {
      let year = base.getUTCFullYear();
      let month1 = base.getUTCMonth() + 1; // 1-based
      // Try this month, then advance month-by-month until the clamped day is
      // on/after `from`. Clamping a day past month length lands on the last day.
      for (;;) {
        const clamped = Math.min(recurrence.day, daysInUtcMonth(year, month1));
        const candidate = new Date(Date.UTC(year, month1 - 1, clamped));
        if (candidate.getTime() >= base.getTime()) {
          return candidate;
        }
        month1 += 1;
        if (month1 > 12) {
          month1 = 1;
          year += 1;
        }
      }
    }
  }
}

/**
 * The raw occurrence strictly *after* a previous raw occurrence — used to
 * step recurring reminders forward when enumerating upcoming dates.
 */
function rawOccurrenceAfter(recurrence: Recurrence, prev: Date): Date | undefined {
  switch (recurrence.kind) {
    case 'once': {
      return undefined; // a one-shot has no successor
    }
    case 'daily': {
      return addUtcDays(prev, 1);
    }
    case 'weekly': {
      return addUtcDays(prev, 7);
    }
    case 'monthly': {
      let year = prev.getUTCFullYear();
      let month1 = prev.getUTCMonth() + 2; // next month, 1-based
      if (month1 > 12) {
        month1 = 1;
        year += 1;
      }
      const clamped = Math.min(recurrence.day, daysInUtcMonth(year, month1));
      return new Date(Date.UTC(year, month1 - 1, clamped));
    }
  }
}

/**
 * Roll a date forward to the next business day when `skipHolidays` is set and
 * the date is a weekend or listed holiday. No-op otherwise.
 */
function rollForwardIfNeeded(reminder: Reminder, date: Date, holidaysIso: string[]): Date {
  if (reminder.skipHolidays !== true) {
    return date;
  }
  let cursor = date;
  // Bounded by construction (at most a handful of consecutive non-business
  // days), but cap iterations defensively to stay deterministic.
  for (let i = 0; i < 366; i += 1) {
    if (isBusinessDay(cursor, holidaysIso)) {
      return cursor;
    }
    cursor = addUtcDays(cursor, 1);
  }
  return cursor;
}

/**
 * Compute the next fire date on/after `from`.
 *
 * With `skipHolidays`, an occurrence landing on a weekend/holiday rolls forward
 * to the next business day. For `monthly`, the day is clamped to the month
 * length (e.g. day 31 in February → the 28th/29th). A `once` reminder returns
 * its date only when it is on/after `from`.
 */
export function nextOccurrence(
  reminder: Reminder,
  from: Date,
  holidaysIso: string[] = [],
): Date | undefined {
  let candidate = rawOccurrenceOnOrAfter(reminder.recurrence, from);
  const base = startOfUtcDay(from);
  // Roll-forward can push a date past `from` (always still valid), but never
  // before it; loop so a rolled date that lands before a later raw occurrence
  // is still the earliest valid business-day fire.
  for (let i = 0; candidate !== undefined && i < 4400; i += 1) {
    const rolled = rollForwardIfNeeded(reminder, candidate, holidaysIso);
    if (rolled.getTime() >= base.getTime()) {
      return rolled;
    }
    candidate = rawOccurrenceAfter(reminder.recurrence, candidate);
  }
  return undefined;
}

/**
 * The next `count` fire dates on/after `from`, in ascending order. Returns
 * fewer than `count` (possibly zero) when the recurrence is exhausted, e.g. a
 * past or single `once` reminder.
 */
export function upcomingOccurrences(
  reminder: Reminder,
  from: Date,
  count: number,
  holidaysIso: string[] = [],
): Date[] {
  const out: Date[] = [];
  if (count <= 0) {
    return out;
  }
  let raw = rawOccurrenceOnOrAfter(reminder.recurrence, from);
  let lastIso: string | undefined;
  // Cap total raw steps to stay deterministic even for sparse business-day sets.
  for (let i = 0; raw !== undefined && out.length < count && i < 100000; i += 1) {
    const fire = rollForwardIfNeeded(reminder, raw, holidaysIso);
    const iso = utcDateToIso(fire);
    // Roll-forward can collapse two raw occurrences onto the same business day;
    // de-duplicate so each emitted date is distinct and ascending.
    if (iso !== lastIso) {
      out.push(fire);
      lastIso = iso;
    }
    raw = rawOccurrenceAfter(reminder.recurrence, raw);
  }
  return out;
}
