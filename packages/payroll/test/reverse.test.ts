import { describe, it, expect } from 'vitest';
import { makeFlatRateModule, grossForNet } from '../src/index';

describe('grossForNet (reverse payroll)', () => {
  const mod = makeFlatRateModule({
    market: 'x',
    version: 1,
    rates: { pension: 0.06, health: 0.02 }, // 8% employee deductions
  });

  it('inverts a linear flat-rate module exactly', () => {
    // net = gross * (1 - 0.08) => gross = net / 0.92
    const gross = grossForNet(mod, 920);
    expect(gross).toBeCloseTo(1000, 2);
    expect(mod.computeNet({ gross }).net).toBeCloseTo(920, 2);
  });

  it('round-trips an arbitrary target net', () => {
    const target = 3456.78;
    const gross = grossForNet(mod, target);
    expect(mod.computeNet({ gross }).net).toBeCloseTo(target, 1);
  });

  it('returns the target itself when there are no deductions', () => {
    const free = makeFlatRateModule({ market: 'x', version: 1, rates: {} });
    expect(grossForNet(free, 500)).toBeCloseTo(500, 2);
  });

  it('rejects a negative target', () => {
    expect(() => grossForNet(mod, -1)).toThrow(/>= 0/);
  });
});
