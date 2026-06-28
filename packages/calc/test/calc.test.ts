import { describe, it, expect } from 'vitest';
import {
  percentageOf,
  percentageChange,
  applyPercent,
  tip,
  discount,
  loanMonthlyPayment,
  amortizationSchedule,
  bmi,
  simpleInterest,
  compoundInterest,
} from '../src/index';

describe('percentageOf', () => {
  it('computes part of whole', () => {
    expect(percentageOf(25, 200)).toBe(12.5);
    expect(percentageOf(1, 4)).toBe(25);
  });
  it('throws on zero whole', () => {
    expect(() => percentageOf(1, 0)).toThrow();
  });
});

describe('percentageChange', () => {
  it('computes increase and decrease', () => {
    expect(percentageChange(100, 150)).toBe(50);
    expect(percentageChange(200, 100)).toBe(-50);
  });
  it('throws on zero from', () => {
    expect(() => percentageChange(0, 10)).toThrow();
  });
});

describe('applyPercent', () => {
  it('applies a percentage', () => {
    expect(applyPercent(200, 10)).toBe(20);
    expect(applyPercent(50, 0)).toBe(0);
  });
});

describe('tip', () => {
  it('computes tip, total and per-person split (golden anchor)', () => {
    const r = tip(100, 18, 2);
    expect(r.tip).toBe(18);
    expect(r.total).toBe(118);
    expect(r.perPerson).toBe(59);
  });
  it('defaults split to 1', () => {
    const r = tip(50, 20);
    expect(r.tip).toBe(10);
    expect(r.total).toBe(60);
    expect(r.perPerson).toBe(60);
  });
  it('throws on invalid split', () => {
    expect(() => tip(100, 10, 0)).toThrow();
    expect(() => tip(100, 10, 1.5)).toThrow();
  });
});

describe('discount', () => {
  it('computes discount amount and final price', () => {
    const r = discount(100, 25);
    expect(r.amount).toBe(25);
    expect(r.final).toBe(75);
  });
});

describe('loanMonthlyPayment', () => {
  it('matches the golden anchor for a 30y mortgage', () => {
    expect(loanMonthlyPayment(100000, 6, 360)).toBeCloseTo(599.55, 2);
  });
  it('handles a zero-interest loan', () => {
    expect(loanMonthlyPayment(1200, 0, 12)).toBe(100);
  });
  it('throws on bad term', () => {
    expect(() => loanMonthlyPayment(1000, 5, 0)).toThrow();
  });
});

describe('amortizationSchedule', () => {
  it('produces one row per period that ends at zero balance', () => {
    const rows = amortizationSchedule(100000, 6, 360);
    expect(rows).toHaveLength(360);
    const first = rows[0];
    const last = rows[rows.length - 1];
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (!first || !last) throw new Error('rows missing');
    expect(first.period).toBe(1);
    // First month's interest on 100k at 6%/12 = 500.
    expect(first.interest).toBeCloseTo(500, 2);
    expect(first.payment).toBeCloseTo(599.55, 2);
    expect(last.period).toBe(360);
    expect(last.balance).toBe(0);
  });
  it('throws on bad term', () => {
    expect(() => amortizationSchedule(1000, 5, -1)).toThrow();
  });
});

describe('bmi', () => {
  it('matches the golden anchor', () => {
    const r = bmi(70, 175);
    expect(r.value).toBeCloseTo(22.86, 2);
    expect(r.category).toBe('normal');
  });
  it('classifies categories', () => {
    expect(bmi(45, 175).category).toBe('underweight');
    expect(bmi(80, 175).category).toBe('overweight');
    expect(bmi(100, 175).category).toBe('obese');
  });
  it('throws on non-positive height', () => {
    expect(() => bmi(70, 0)).toThrow();
  });
});

describe('simpleInterest', () => {
  it('computes interest', () => {
    expect(simpleInterest(1000, 5, 3)).toBe(150);
  });
});

describe('compoundInterest', () => {
  it('compounds monthly by default', () => {
    // 1000 at 5%/yr compounded monthly for 10y (120 periods) -> 647.01 interest.
    expect(compoundInterest(1000, 5, 10)).toBeCloseTo(647.01, 2);
  });
  it('supports annual compounding', () => {
    // 1000 at 10%/yr compounded once a year for 2y -> 210 interest.
    expect(compoundInterest(1000, 10, 2, 1)).toBeCloseTo(210, 2);
  });
  it('throws on bad compounds', () => {
    expect(() => compoundInterest(1000, 5, 1, 0)).toThrow();
  });
});
