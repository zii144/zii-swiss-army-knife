import { describe, it, expect } from 'vitest';
import { makeFlatRateModule, makeTaxModuleFromPack } from '../src/index';
import type { LocalePack } from '@zii/locale';

describe('makeFlatRateModule', () => {
  it('deducts gross * rate per line (golden anchor)', () => {
    const mod = makeFlatRateModule({
      market: 'global',
      version: 1,
      rates: { pension: 0.06 },
    });
    const r = mod.computeNet({ gross: 1000 });
    expect(r.gross).toBe(1000);
    expect(r.deductions.pension).toBeCloseTo(60, 6);
    expect(r.totalDeductions).toBeCloseTo(60, 6);
    expect(r.net).toBeCloseTo(940, 6);
  });

  it('exposes market and version metadata', () => {
    const mod = makeFlatRateModule({ market: 'tw', version: 2025, rates: {} });
    expect(mod.market).toBe('tw');
    expect(mod.version).toBe(2025);
  });

  it('sums multiple deduction lines', () => {
    const mod = makeFlatRateModule({
      market: 'global',
      version: 1,
      rates: { pension: 0.06, health: 0.02 },
    });
    const r = mod.computeNet({ gross: 1000 });
    expect(r.deductions.pension).toBeCloseTo(60, 6);
    expect(r.deductions.health).toBeCloseTo(20, 6);
    expect(r.totalDeductions).toBeCloseTo(80, 6);
    expect(r.net).toBeCloseTo(920, 6);
  });

  it('computes employer cost from employer rates', () => {
    const mod = makeFlatRateModule({
      market: 'global',
      version: 1,
      rates: { pension: 0.06 },
      employerRates: { pension: 0.1, accident: 0.005 },
    });
    const r = mod.computeNet({ gross: 1000 });
    // gross + (0.1 + 0.005) * gross = 1000 + 105 = 1105.
    expect(r.employerCost).toBeCloseTo(1105, 6);
  });

  it('defaults employer cost to gross with no employer rates', () => {
    const mod = makeFlatRateModule({
      market: 'global',
      version: 1,
      rates: { pension: 0.06 },
    });
    expect(mod.computeNet({ gross: 1000 }).employerCost).toBeCloseTo(1000, 6);
  });
});

describe('makeTaxModuleFromPack', () => {
  const pack: LocalePack = {
    market: 'global',
    year: 2026,
    effectiveDate: '2026-01-01',
    dateFormat: 'YYYY-MM-DD',
    calendars: ['gregorian'],
    currency: 'USD',
    units: 'metric',
    payroll: {
      socialInsurance: { health: 0.02 },
      pensionEmployeeRate: 0.04,
      pensionEmployerRate: 0.1,
    },
    tax: {
      incomeBrackets: [
        { upTo: 10000, rate: 0.1 },
        { upTo: 30000, rate: 0.2 },
        { upTo: null, rate: 0.3 },
      ],
    },
    dataSources: {},
    tools: { enabled: [] },
    toggles: {},
  };

  it('carries market and version from the pack', () => {
    const mod = makeTaxModuleFromPack(pack);
    expect(mod.market).toBe('global');
    expect(mod.version).toBe(2026);
  });

  it('derives social insurance, pension and progressive income tax', () => {
    const mod = makeTaxModuleFromPack(pack);
    const r = mod.computeNet({ gross: 20000 });
    // Social: health 2% = 400; pension(employee) 4% = 800 -> 1200 total social.
    expect(r.deductions.health).toBeCloseTo(400, 6);
    expect(r.deductions.pension).toBeCloseTo(800, 6);
    // Taxable = 20000 - 1200 = 18800.
    // 10000 @ 10% = 1000; 8800 @ 20% = 1760; income tax = 2760.
    expect(r.deductions.incomeTax).toBeCloseTo(2760, 6);
    expect(r.totalDeductions).toBeCloseTo(1200 + 2760, 6);
    expect(r.net).toBeCloseTo(20000 - 1200 - 2760, 6);
  });

  it('adds employer pension contribution to employer cost', () => {
    const mod = makeTaxModuleFromPack(pack);
    const r = mod.computeNet({ gross: 20000 });
    // 20000 + 10% = 22000.
    expect(r.employerCost).toBeCloseTo(22000, 6);
  });

  it('handles a pack with no payroll/tax sections', () => {
    const bare: LocalePack = {
      market: 'global',
      year: 2026,
      effectiveDate: '2026-01-01',
      dateFormat: 'YYYY-MM-DD',
      calendars: ['gregorian'],
      currency: 'USD',
      units: 'metric',
      dataSources: {},
      tools: { enabled: [] },
      toggles: {},
    };
    const r = makeTaxModuleFromPack(bare).computeNet({ gross: 1000 });
    expect(r.totalDeductions).toBe(0);
    expect(r.net).toBe(1000);
    expect(r.employerCost).toBe(1000);
  });
});
