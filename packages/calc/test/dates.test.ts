import { describe, it, expect } from 'vitest';
import { daysBetween, addDays, ageInYears } from '../src/index';

const d = (iso: string): Date => new Date(`${iso}T00:00:00.000Z`);

describe('daysBetween', () => {
  it('counts whole days forward', () => {
    expect(daysBetween(d('2026-01-01'), d('2026-01-31'))).toBe(30);
  });
  it('is negative when b precedes a', () => {
    expect(daysBetween(d('2026-01-31'), d('2026-01-01'))).toBe(-30);
  });
  it('is timezone-independent across DST-ish boundaries', () => {
    expect(daysBetween(d('2026-03-01'), d('2026-03-31'))).toBe(30);
  });
  it('handles a leap year February', () => {
    expect(daysBetween(d('2024-02-01'), d('2024-03-01'))).toBe(29);
  });
});

describe('addDays', () => {
  it('adds days', () => {
    expect(addDays(d('2026-01-01'), 31).toISOString()).toBe('2026-02-01T00:00:00.000Z');
  });
  it('subtracts with negative n', () => {
    expect(addDays(d('2026-02-01'), -1).toISOString()).toBe('2026-01-31T00:00:00.000Z');
  });
});

describe('ageInYears', () => {
  it('counts completed years on/after the birthday', () => {
    expect(ageInYears(d('2000-06-15'), d('2026-06-15'))).toBe(26);
  });
  it('does not count the year before the birthday lands', () => {
    expect(ageInYears(d('2000-06-15'), d('2026-06-14'))).toBe(25);
  });
});
