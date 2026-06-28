import { describe, it, expect } from 'vitest';
import { progressiveTax, salesTax } from '../src/index';
import type { TaxBracket } from '../src/index';

const BRACKETS: TaxBracket[] = [
  { upTo: 10000, rate: 0.1 },
  { upTo: 30000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

describe('progressiveTax', () => {
  it('matches the golden anchor (marginal slices)', () => {
    // 10000 @ 10% = 1000; next 10000 @ 20% = 2000; total = 3000.
    expect(progressiveTax(BRACKETS, 20000)).toBeCloseTo(3000, 6);
  });

  it('taxes income entirely within the first bracket', () => {
    expect(progressiveTax(BRACKETS, 5000)).toBeCloseTo(500, 6);
  });

  it('taxes exactly at a bracket boundary', () => {
    expect(progressiveTax(BRACKETS, 10000)).toBeCloseTo(1000, 6);
  });

  it('reaches into the open top bracket', () => {
    // 1000 + 4000 + (10000 @ 30% = 3000) = 8000.
    expect(progressiveTax(BRACKETS, 40000)).toBeCloseTo(8000, 6);
  });

  it('returns zero for zero or negative income', () => {
    expect(progressiveTax(BRACKETS, 0)).toBe(0);
    expect(progressiveTax(BRACKETS, -100)).toBe(0);
  });

  it('returns zero with no brackets', () => {
    expect(progressiveTax([], 50000)).toBe(0);
  });
});

describe('salesTax', () => {
  it('adds tax on top (exclusive, golden anchor)', () => {
    const r = salesTax(100, 0.2);
    expect(r.net).toBeCloseTo(100, 6);
    expect(r.tax).toBeCloseTo(20, 6);
    expect(r.gross).toBeCloseTo(120, 6);
  });

  it('backs tax out (inclusive, golden anchor)', () => {
    const r = salesTax(120, 0.2, { inclusive: true });
    expect(r.net).toBeCloseTo(100, 6);
    expect(r.tax).toBeCloseTo(20, 6);
    expect(r.gross).toBeCloseTo(120, 6);
  });

  it('treats explicit inclusive:false as exclusive', () => {
    const r = salesTax(200, 0.05, { inclusive: false });
    expect(r.net).toBeCloseTo(200, 6);
    expect(r.tax).toBeCloseTo(10, 6);
    expect(r.gross).toBeCloseTo(210, 6);
  });

  it('round-trips exclusive then inclusive', () => {
    const out = salesTax(80, 0.15);
    const back = salesTax(out.gross, 0.15, { inclusive: true });
    expect(back.net).toBeCloseTo(80, 6);
  });
});
