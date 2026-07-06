import { describe, it, expect } from 'vitest';
import {
  hkSalariesTax,
  hkMpfEmployeeAnnual,
  HK_SALARIES_TAX_2024_25 as CFG,
} from '../src/index';

describe('hkMpfEmployeeAnnual', () => {
  it('is 5% of monthly income, annualised', () => {
    expect(hkMpfEmployeeAnnual(20_000, CFG)).toBe(12_000); // 20000*5%*12
  });
  it('caps at the annual maximum', () => {
    expect(hkMpfEmployeeAnnual(40_000, CFG)).toBe(18_000); // min(30000,40000)*5%*12
    expect(hkMpfEmployeeAnnual(30_000, CFG)).toBe(18_000);
  });
  it('is exempt below the minimum relevant income', () => {
    expect(hkMpfEmployeeAnnual(5_000, CFG)).toBe(0);
    expect(hkMpfEmployeeAnnual(7_099, CFG)).toBe(0);
    expect(hkMpfEmployeeAnnual(7_100, CFG)).toBeCloseTo(4_260, 6); // 7100*5%*12
  });
});

describe('hkSalariesTax — progressive vs standard', () => {
  it('single earner, $600k: progressive rate applies', () => {
    // NCI = 600,000 − 132,000 = 468,000.
    // 1,000 + 3,000 + 5,000 + 7,000 + 268,000*17% (=45,560) = 61,560.
    const r = hkSalariesTax({ annualIncome: 600_000 }, CFG);
    expect(r.netChargeableIncome).toBe(468_000);
    expect(r.progressiveTax).toBe(61_560);
    expect(r.standardTax).toBe(90_000); // 15% × 600,000
    expect(r.taxPayable).toBe(61_560);
    expect(r.effectiveRate).toBeCloseTo(0.1026, 4);
  });

  it('very high earner, $10m: two-tier standard rate caps the bill', () => {
    // Progressive: 16,000 + (9,868,000−200,000)*17% = 16,000 + 1,643,560 = 1,659,560.
    // Standard: 5,000,000*15% + 5,000,000*16% = 750,000 + 800,000 = 1,550,000.
    const r = hkSalariesTax({ annualIncome: 10_000_000 }, CFG);
    expect(r.progressiveTax).toBeCloseTo(1_659_560, 2);
    expect(r.standardTax).toBe(1_550_000);
    expect(r.taxPayable).toBe(1_550_000);
  });
});

describe('hkSalariesTax — allowances & deductions', () => {
  it('married person allowance lowers the bill', () => {
    // NCI = 600,000 − 264,000 = 336,000.
    // 16,000 + 136,000*17% (=23,120) = 39,120.
    const r = hkSalariesTax({ annualIncome: 600_000, married: true }, CFG);
    expect(r.allowances).toBe(264_000);
    expect(r.taxPayable).toBe(39_120);
  });

  it('child allowances stack on top', () => {
    // Married + 2 children: allowance 264,000 + 260,000 = 524,000; NCI 76,000.
    // 50,000*2% + 26,000*6% = 1,000 + 1,560 = 2,560.
    const r = hkSalariesTax({ annualIncome: 600_000, married: true, children: 2 }, CFG);
    expect(r.allowances).toBe(524_000);
    expect(r.taxPayable).toBe(2_560);
  });

  it('mandatory MPF is deductible from assessable income', () => {
    // netTotal = 600,000 − 18,000 = 582,000; NCI = 450,000.
    // 16,000 + 250,000*17% (=42,500) = 58,500.
    const r = hkSalariesTax({ annualIncome: 600_000, mpfDeduction: 18_000 }, CFG);
    expect(r.netTotalIncome).toBe(582_000);
    expect(r.taxPayable).toBe(58_500);
  });

  it('MPF deduction is capped at the annual cap', () => {
    const uncapped = hkSalariesTax({ annualIncome: 600_000, mpfDeduction: 50_000 }, CFG);
    const capped = hkSalariesTax({ annualIncome: 600_000, mpfDeduction: 18_000 }, CFG);
    expect(uncapped.taxPayable).toBe(capped.taxPayable);
  });

  it('no tax when allowances exceed income', () => {
    const r = hkSalariesTax({ annualIncome: 100_000 }, CFG);
    expect(r.netChargeableIncome).toBe(0);
    expect(r.taxPayable).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it('handles zero / negative income without NaN', () => {
    const r = hkSalariesTax({ annualIncome: 0 }, CFG);
    expect(r.taxPayable).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });
});
