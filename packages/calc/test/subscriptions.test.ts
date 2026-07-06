import { describe, it, expect } from 'vitest';
import {
  subscriptionAnnual,
  subscriptionMonthly,
  subscriptionTotals,
} from '../src/index';

describe('subscription cost normalization', () => {
  it('annualizes each cycle', () => {
    expect(subscriptionAnnual(10, 'monthly')).toBe(120);
    expect(subscriptionAnnual(100, 'yearly')).toBe(100);
    expect(subscriptionAnnual(30, 'quarterly')).toBe(120);
    expect(subscriptionAnnual(5, 'weekly')).toBe(260);
  });

  it('derives the monthly-equivalent cost', () => {
    expect(subscriptionMonthly(120, 'yearly')).toBe(10);
    expect(subscriptionMonthly(10, 'monthly')).toBe(10);
    expect(subscriptionMonthly(5, 'weekly')).toBeCloseTo(21.6667, 3); // 260/12
  });

  it('clamps negative amounts to 0', () => {
    expect(subscriptionAnnual(-50, 'monthly')).toBe(0);
  });

  it('totals a list across mixed cycles', () => {
    const totals = subscriptionTotals([
      { name: 'Streaming', amount: 15, cycle: 'monthly' }, // 180/yr
      { name: 'Domain', amount: 12, cycle: 'yearly' }, //     12/yr
      { name: 'Gym', amount: 30, cycle: 'quarterly' }, //    120/yr
    ]);
    expect(totals.annual).toBe(312);
    expect(totals.monthly).toBe(26);
  });

  it('handles an empty list', () => {
    expect(subscriptionTotals([])).toEqual({ monthly: 0, annual: 0 });
  });
});
