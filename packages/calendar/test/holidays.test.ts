import { describe, it, expect } from 'vitest';
import type { LocalePack } from '@zii/locale';
import {
  resolveHolidays,
  substituteIfWeekend,
  isBusinessDay,
  businessDaysBetween,
} from '../src/index';

/** Minimal valid LocalePack carrying a holiday list, for deterministic tests. */
function packWithHolidays(list: { date: string; name: string }[]): LocalePack {
  return {
    market: 'jp',
    year: 2026,
    effectiveDate: '2026-01-01',
    dateFormat: 'yyyy/MM/dd',
    calendars: ['gregorian'],
    currency: 'JPY',
    units: 'metric',
    holidays: { list, makeUpWorkdays: false },
    dataSources: {},
    tools: { enabled: [] },
    toggles: {},
  };
}

describe('resolveHolidays', () => {
  const pack = packWithHolidays([
    { date: '2026-01-01', name: 'New Year' },
    { date: '2026-12-25', name: 'Christmas' },
    { date: '2025-12-31', name: "New Year's Eve" },
    { date: '2027-01-01', name: 'Future New Year' },
  ]);

  it('filters the pack list to the requested year', () => {
    const r = resolveHolidays(pack, 2026);
    expect(r).toEqual([
      { date: '2026-01-01', name: 'New Year' },
      { date: '2026-12-25', name: 'Christmas' },
    ]);
  });

  it('returns an empty array for a year with no holidays', () => {
    expect(resolveHolidays(pack, 2024)).toEqual([]);
  });

  it('returns an empty array when the pack declares no holidays', () => {
    const bare = packWithHolidays([]);
    delete bare.holidays;
    expect(resolveHolidays(bare, 2026)).toEqual([]);
  });
});

describe('substituteIfWeekend', () => {
  it('shifts a Sunday to the next Monday', () => {
    // 2026-06-28 is a Sunday.
    expect(substituteIfWeekend('2026-06-28')).toBe('2026-06-29');
  });

  it('leaves a weekday unchanged', () => {
    // 2026-06-29 is a Monday.
    expect(substituteIfWeekend('2026-06-29')).toBe('2026-06-29');
  });

  it('leaves a Saturday unchanged by default', () => {
    // 2026-06-27 is a Saturday.
    expect(substituteIfWeekend('2026-06-27')).toBe('2026-06-27');
  });

  it('shifts a Saturday to Monday when configured', () => {
    expect(substituteIfWeekend('2026-06-27', { substituteSaturday: true })).toBe('2026-06-29');
  });

  it('shifts a Sunday to Monday even when substituteSaturday is set', () => {
    expect(substituteIfWeekend('2026-06-28', { substituteSaturday: true })).toBe('2026-06-29');
  });

  it('throws on a malformed date', () => {
    expect(() => substituteIfWeekend('2026/06/28')).toThrow(RangeError);
  });
});

describe('isBusinessDay', () => {
  it('is true for an ordinary weekday', () => {
    // 2026-06-29 Monday.
    expect(isBusinessDay(new Date('2026-06-29'), [])).toBe(true);
  });

  it('is false on Saturday and Sunday', () => {
    expect(isBusinessDay(new Date('2026-06-27'), [])).toBe(false); // Sat
    expect(isBusinessDay(new Date('2026-06-28'), [])).toBe(false); // Sun
  });

  it('is false on a listed holiday weekday', () => {
    expect(isBusinessDay(new Date('2026-06-29'), ['2026-06-29'])).toBe(false);
  });
});

describe('businessDaysBetween', () => {
  it('counts weekdays in a half-open interval [a, b)', () => {
    // Mon 2026-06-29 .. Mon 2026-07-06 -> Mon..Fri (5 business days).
    const a = new Date('2026-06-29');
    const b = new Date('2026-07-06');
    expect(businessDaysBetween(a, b, [])).toBe(5);
  });

  it('excludes listed holidays', () => {
    const a = new Date('2026-06-29');
    const b = new Date('2026-07-06');
    expect(businessDaysBetween(a, b, ['2026-07-01'])).toBe(4);
  });

  it('returns 0 when start equals end', () => {
    const d = new Date('2026-06-29');
    expect(businessDaysBetween(d, d, [])).toBe(0);
  });

  it('is order-independent (treats the earlier date as the start)', () => {
    const a = new Date('2026-06-29');
    const b = new Date('2026-07-06');
    expect(businessDaysBetween(b, a, [])).toBe(5);
  });

  it('counts a single weekday in a one-day span', () => {
    expect(businessDaysBetween(new Date('2026-06-29'), new Date('2026-06-30'), [])).toBe(1);
  });
});
