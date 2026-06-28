import { describe, it, expect } from 'vitest';
import { buildNotification } from '../src/index';
import type { Reminder } from '../src/index';

function at(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

describe('buildNotification', () => {
  const base: Reminder = {
    id: 'pay-rent',
    title: 'Pay rent',
    recurrence: { kind: 'monthly', day: 10 },
  };

  it('fires at the occurrence instant with no leadDays', () => {
    const n = buildNotification(base, at('2026-06-10'));
    expect(n.id).toBe('pay-rent');
    expect(n.title).toBe('Pay rent');
    expect(n.fireAtIso).toBe('2026-06-10T00:00:00.000Z');
    expect(n.body).toBe('Pay rent — due 2026-06-10');
  });

  it('offsets fireAt earlier by leadDays', () => {
    const n = buildNotification({ ...base, leadDays: 7 }, at('2026-06-10'));
    expect(n.fireAtIso).toBe('2026-06-03T00:00:00.000Z');
    expect(n.body).toBe('Pay rent — due 2026-06-10 (in 7 days)');
  });

  it('uses singular wording for a 1-day lead', () => {
    const n = buildNotification({ ...base, leadDays: 1 }, at('2026-06-10'));
    expect(n.fireAtIso).toBe('2026-06-09T00:00:00.000Z');
    expect(n.body).toBe('Pay rent — due 2026-06-10 (in 1 day)');
  });

  it('crosses a month boundary when the lead exceeds the day-of-month', () => {
    const n = buildNotification({ ...base, leadDays: 12 }, at('2026-06-10'));
    expect(n.fireAtIso).toBe('2026-05-29T00:00:00.000Z');
  });
});
