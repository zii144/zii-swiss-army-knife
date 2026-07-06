import { describe, it, expect } from 'vitest';
import { hkSeverancePayment } from '../src/index';

describe('hkSeverancePayment', () => {
  it('2/3 of wages × years, wages capped at HK$22,500', () => {
    // wage 30,000 → capped 22,500 → perYear 15,000; × 10 = 150,000.
    const r = hkSeverancePayment(30_000, 10);
    expect(r.perYear).toBe(15_000);
    expect(r.payment).toBe(150_000);
    expect(r.capped).toBe(false);
  });

  it('uses actual wages when below the cap', () => {
    // wage 18,000 → perYear 12,000; × 3 = 36,000.
    const r = hkSeverancePayment(18_000, 3);
    expect(r.perYear).toBe(12_000);
    expect(r.payment).toBe(36_000);
  });

  it('pro-rates partial years by months', () => {
    // 5 years 6 months = 5.5; 15,000 × 5.5 = 82,500.
    const r = hkSeverancePayment(30_000, 5, 6);
    expect(r.years).toBeCloseTo(5.5, 6);
    expect(r.payment).toBe(82_500);
  });

  it('caps the total at HK$390,000', () => {
    // 15,000 × 30 = 450,000 → capped to 390,000.
    const r = hkSeverancePayment(60_000, 30);
    expect(r.gross).toBe(450_000);
    expect(r.payment).toBe(390_000);
    expect(r.capped).toBe(true);
  });

  it('handles zero service and zero wages', () => {
    expect(hkSeverancePayment(0, 5).payment).toBe(0);
    expect(hkSeverancePayment(30_000, 0).payment).toBe(0);
  });

  it('clamps out-of-range months', () => {
    expect(hkSeverancePayment(22_500, 1, 12).years).toBeCloseTo(1 + 11 / 12, 6);
    expect(hkSeverancePayment(22_500, 1, -3).years).toBe(1);
  });
});
