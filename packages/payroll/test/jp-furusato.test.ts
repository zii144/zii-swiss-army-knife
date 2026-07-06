import { describe, it, expect } from 'vitest';
import { furusatoLimit, jpMarginalIncomeTaxRate } from '../src/index';

describe('jpMarginalIncomeTaxRate', () => {
  it('maps 課税所得 to the NTA marginal rate', () => {
    expect(jpMarginalIncomeTaxRate(1_000_000)).toBe(0.05);
    expect(jpMarginalIncomeTaxRate(1_950_000)).toBe(0.05);
    expect(jpMarginalIncomeTaxRate(3_000_000)).toBe(0.1);
    expect(jpMarginalIncomeTaxRate(6_950_000)).toBe(0.2);
    expect(jpMarginalIncomeTaxRate(7_000_000)).toBe(0.23);
    expect(jpMarginalIncomeTaxRate(20_000_000)).toBe(0.4);
    expect(jpMarginalIncomeTaxRate(50_000_000)).toBe(0.45);
  });
  it('treats negative income as 0 (lowest bracket)', () => {
    expect(jpMarginalIncomeTaxRate(-1)).toBe(0.05);
  });
});

describe('furusatoLimit — 総務省 standard formula', () => {
  it('課税所得 300万 (rate 10%) → ~77,197 yen', () => {
    // levy = 300,000; denom = 0.90 − 0.10*1.021 = 0.7979.
    // 60,000 / 0.7979 + 2000 = 77,197.
    const r = furusatoLimit(3_000_000);
    expect(r.residentTaxIncomeLevy).toBe(300_000);
    expect(r.marginalRate).toBe(0.1);
    expect(r.limit).toBe(77_197);
  });

  it('課税所得 100万 (rate 5%) → ~25,558 yen', () => {
    // levy = 100,000; denom = 0.90 − 0.05*1.021 = 0.84895.
    // 20,000 / 0.84895 + 2000 = 25,558.
    expect(furusatoLimit(1_000_000).limit).toBe(25_558);
  });

  it('課税所得 700万 (rate 23%) → ~212,472 yen', () => {
    // levy = 700,000; denom = 0.90 − 0.23*1.021 = 0.66517.
    // 140,000 / 0.66517 + 2000 = 212,472.
    expect(furusatoLimit(7_000_000).limit).toBe(212_472);
  });

  it('higher taxable income yields a higher ceiling', () => {
    expect(furusatoLimit(5_000_000).limit).toBeGreaterThan(furusatoLimit(3_000_000).limit);
  });

  it('returns the ¥2,000 self-pay floor at zero income', () => {
    const r = furusatoLimit(0);
    expect(r.residentTaxIncomeLevy).toBe(0);
    expect(r.limit).toBe(2000);
  });

  it('never produces NaN or a negative ceiling', () => {
    for (const income of [0, 1, 1_999_999, 9_000_001, 45_000_000]) {
      const { limit } = furusatoLimit(income);
      expect(Number.isFinite(limit)).toBe(true);
      expect(limit).toBeGreaterThanOrEqual(2000);
    }
  });
});
