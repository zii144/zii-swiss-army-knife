import { describe, it, expect } from 'vitest';
import { convertCurrency } from '../src/index';
import type { RateProvider } from '../src/index';

describe('convertCurrency', () => {
  it('converts with a numeric rate', () => {
    expect(convertCurrency(100, 'USD', 'EUR', 0.9)).toBeCloseTo(90, 9);
  });
  it('converts with a provider function', () => {
    const table: Record<string, Record<string, number>> = {
      USD: { JPY: 150, EUR: 0.9 },
    };
    const provider: RateProvider = (from, to) => {
      const rate = table[from]?.[to];
      if (rate === undefined) throw new Error(`no rate ${from}->${to}`);
      return rate;
    };
    expect(convertCurrency(2, 'USD', 'JPY', provider)).toBe(300);
    expect(convertCurrency(100, 'USD', 'EUR', provider)).toBeCloseTo(90, 9);
  });
  it('throws on a non-finite rate', () => {
    expect(() => convertCurrency(100, 'USD', 'EUR', Number.NaN)).toThrow();
  });
});
