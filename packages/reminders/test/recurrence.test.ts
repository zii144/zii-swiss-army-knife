import { describe, it, expect } from 'vitest';
import { nextOccurrence, upcomingOccurrences, utcDateToIso } from '../src/index';
import type { Reminder } from '../src/index';

/** Build a UTC-midnight Date from an ISO date for deterministic `from` values. */
function at(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function reminder(partial: Partial<Reminder> & Pick<Reminder, 'recurrence'>): Reminder {
  return { id: partial.id ?? 'r1', title: partial.title ?? 'Test', ...partial };
}

describe('nextOccurrence — once', () => {
  it('returns the date when it is on/after `from`', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-07-04' } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-28'))!)).toBe('2026-07-04');
  });

  it('returns the date when it equals `from`', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-28' } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-28'))!)).toBe('2026-06-28');
  });

  it('returns undefined when the date is in the past', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-01' } });
    expect(nextOccurrence(r, at('2026-06-28'))).toBeUndefined();
  });
});

describe('nextOccurrence — daily', () => {
  it('fires on `from` itself', () => {
    const r = reminder({ recurrence: { kind: 'daily' } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-28'))!)).toBe('2026-06-28');
  });
});

describe('nextOccurrence — weekly', () => {
  it('returns `from` when it already matches the weekday', () => {
    // 2026-06-29 is a Monday (weekday 1).
    const r = reminder({ recurrence: { kind: 'weekly', weekday: 1 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-29'))!)).toBe('2026-06-29');
  });

  it('rolls to the next matching weekday', () => {
    // From Monday 2026-06-29, next Friday (weekday 5) is 2026-07-03.
    const r = reminder({ recurrence: { kind: 'weekly', weekday: 5 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-29'))!)).toBe('2026-07-03');
  });

  it('wraps across the week boundary', () => {
    // From Friday 2026-07-03, next Monday (weekday 1) is 2026-07-06.
    const r = reminder({ recurrence: { kind: 'weekly', weekday: 1 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-07-03'))!)).toBe('2026-07-06');
  });
});

describe('nextOccurrence — monthly', () => {
  it('returns this month when the day is on/after `from`', () => {
    const r = reminder({ recurrence: { kind: 'monthly', day: 15 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-01'))!)).toBe('2026-06-15');
  });

  it('advances to next month when the day has passed', () => {
    const r = reminder({ recurrence: { kind: 'monthly', day: 5 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-10'))!)).toBe('2026-07-05');
  });

  it('clamps day 31 to the February month length', () => {
    // 2026 is not a leap year → Feb has 28 days.
    const r = reminder({ recurrence: { kind: 'monthly', day: 31 } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-02-01'))!)).toBe('2026-02-28');
  });

  it('clamps day 31 to 29 for a leap-year February', () => {
    // 2028 is a leap year → Feb has 29 days.
    const r = reminder({ recurrence: { kind: 'monthly', day: 31 } });
    expect(utcDateToIso(nextOccurrence(r, at('2028-02-01'))!)).toBe('2028-02-29');
  });
});

describe('nextOccurrence — skipHolidays roll-forward', () => {
  it('rolls a Saturday occurrence forward to Monday', () => {
    // 2026-06-27 is a Saturday → next business day is Monday 2026-06-29.
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-27' }, skipHolidays: true });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-20'))!)).toBe('2026-06-29');
  });

  it('rolls a listed holiday forward past the holiday', () => {
    // Monday 2026-06-29 is a holiday → roll to Tuesday 2026-06-30.
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-29' }, skipHolidays: true });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-20'), ['2026-06-29'])!)).toBe('2026-06-30');
  });

  it('rolls past a holiday that itself falls before a weekend', () => {
    // Fri 2026-07-03 holiday → Sat/Sun skipped → Mon 2026-07-06.
    const r = reminder({ recurrence: { kind: 'once', date: '2026-07-03' }, skipHolidays: true });
    expect(utcDateToIso(nextOccurrence(r, at('2026-07-01'), ['2026-07-03'])!)).toBe('2026-07-06');
  });

  it('does not roll when skipHolidays is unset', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-27' } });
    expect(utcDateToIso(nextOccurrence(r, at('2026-06-20'))!)).toBe('2026-06-27');
  });
});

describe('upcomingOccurrences', () => {
  it('returns the next N daily dates', () => {
    const r = reminder({ recurrence: { kind: 'daily' } });
    const dates = upcomingOccurrences(r, at('2026-06-28'), 3).map(utcDateToIso);
    expect(dates).toEqual(['2026-06-28', '2026-06-29', '2026-06-30']);
  });

  it('returns the next N weekly dates', () => {
    const r = reminder({ recurrence: { kind: 'weekly', weekday: 1 } });
    const dates = upcomingOccurrences(r, at('2026-06-29'), 3).map(utcDateToIso);
    expect(dates).toEqual(['2026-06-29', '2026-07-06', '2026-07-13']);
  });

  it('returns the next N monthly dates with clamping', () => {
    const r = reminder({ recurrence: { kind: 'monthly', day: 31 } });
    const dates = upcomingOccurrences(r, at('2026-01-01'), 3).map(utcDateToIso);
    expect(dates).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
  });

  it('returns at most one date for a `once` reminder', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-07-04' } });
    const dates = upcomingOccurrences(r, at('2026-06-28'), 5).map(utcDateToIso);
    expect(dates).toEqual(['2026-07-04']);
  });

  it('returns an empty array for a past `once` reminder', () => {
    const r = reminder({ recurrence: { kind: 'once', date: '2026-06-01' } });
    expect(upcomingOccurrences(r, at('2026-06-28'), 5)).toEqual([]);
  });

  it('returns an empty array when count <= 0', () => {
    const r = reminder({ recurrence: { kind: 'daily' } });
    expect(upcomingOccurrences(r, at('2026-06-28'), 0)).toEqual([]);
  });

  it('de-duplicates business days when roll-forward collapses occurrences', () => {
    // Daily with a Fri+weekend block: 07-03 (holiday), 07-04 Sat, 07-05 Sun all
    // roll to Mon 07-06; emitted dates must stay distinct and ascending.
    const r = reminder({ recurrence: { kind: 'daily' }, skipHolidays: true });
    const dates = upcomingOccurrences(r, at('2026-07-02'), 3, ['2026-07-03']).map(utcDateToIso);
    expect(dates).toEqual(['2026-07-02', '2026-07-06', '2026-07-07']);
  });
});
