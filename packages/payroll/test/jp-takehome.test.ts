import { describe, it, expect } from 'vitest';
import {
  jpHealthStandardRemuneration,
  jpPensionStandardRemuneration,
  jpSocialInsuranceMonthly,
  jpEmploymentIncomeDeduction,
  jpIncomeTaxAnnual,
  jpResidentTaxAnnual,
  jpTakeHome,
} from '../src/index';

describe('標準報酬月額 grade lookup', () => {
  it('maps salary into the right health grade', () => {
    expect(jpHealthStandardRemuneration(50_000)).toBe(58_000); // grade 1 floor
    expect(jpHealthStandardRemuneration(200_000)).toBe(200_000);
    expect(jpHealthStandardRemuneration(205_000)).toBe(200_000); // below next bound 210k
    expect(jpHealthStandardRemuneration(210_000)).toBe(220_000); // steps up
    expect(jpHealthStandardRemuneration(300_000)).toBe(300_000);
    expect(jpHealthStandardRemuneration(1_400_000)).toBe(1_390_000); // top grade cap
  });

  it('clamps pension standard remuneration to ¥88,000–¥650,000', () => {
    expect(jpPensionStandardRemuneration(50_000)).toBe(88_000); // floor
    expect(jpPensionStandardRemuneration(300_000)).toBe(300_000);
    expect(jpPensionStandardRemuneration(700_000)).toBe(650_000); // cap
    expect(jpPensionStandardRemuneration(2_000_000)).toBe(650_000);
  });
});

describe('社会保険料 (monthly, employee side)', () => {
  it('¥300,000 salary, under 40 — health 9.98%, pension 18.3%, no care', () => {
    const s = jpSocialInsuranceMonthly(300_000, { age40to64: false });
    expect(s.health).toBe(14_970); // 300000*0.0998/2
    expect(s.care).toBe(0);
    expect(s.pension).toBe(27_450); // 300000*0.183/2
    expect(s.employment).toBe(1_800); // 300000*0.006
    expect(s.total).toBe(44_220);
  });

  it('adds 介護保険 for age 40–64', () => {
    const s = jpSocialInsuranceMonthly(300_000, { age40to64: true });
    expect(s.care).toBe(2_400); // 300000*0.016/2
    expect(s.total).toBe(46_620);
  });

  it('applies the 50-sen rounding rule (>50 銭 rounds up)', () => {
    // standard 134,000 × 0.0499 = 6,686.6 → 6,687.
    const s = jpSocialInsuranceMonthly(134_000, { age40to64: false });
    expect(s.health).toBe(6_687);
  });

  it('caps the pension base at ¥650,000', () => {
    const s = jpSocialInsuranceMonthly(1_000_000, { age40to64: false });
    expect(s.pension).toBe(Math.ceil((650_000 * 0.183) / 2 - 0.5)); // 59,475
  });
});

describe('給与所得控除', () => {
  it('follows the FY2020+ schedule', () => {
    expect(jpEmploymentIncomeDeduction(1_000_000)).toBe(550_000);
    expect(jpEmploymentIncomeDeduction(3_600_000)).toBe(1_160_000);
    expect(jpEmploymentIncomeDeduction(6_600_000)).toBe(1_760_000);
    expect(jpEmploymentIncomeDeduction(10_000_000)).toBe(1_950_000); // cap
  });
});

describe('所得税 / 住民税 (annual, single earner)', () => {
  // gross 3,600,000; annual social 530,640 (= 44,220 × 12).
  const social = 530_640;

  it('所得税: 給与所得控除 → 基礎控除 → 5% bracket × 復興税', () => {
    // employmentIncome 2,440,000; taxable 1,429,000; 5% = 71,450 ×1.021 = 72,950 → 72,900.
    expect(jpIncomeTaxAnnual(3_600_000, social)).toBe(72_900);
  });

  it('住民税: 所得割 10% − 調整控除 + 均等割', () => {
    // taxable 1,479,000; 147,900 − 2,500 = 145,400; + 5,000 = 150,400.
    expect(jpResidentTaxAnnual(3_600_000, social)).toBe(150_400);
  });

  it('no income/resident tax when taxable income is wiped out', () => {
    expect(jpIncomeTaxAnnual(1_000_000, 200_000)).toBe(0);
    expect(jpResidentTaxAnnual(1_000_000, 200_000)).toBe(0);
  });
});

describe('jpTakeHome (end-to-end)', () => {
  it('¥300,000/month, under 40 → ¥237,172 take-home', () => {
    const r = jpTakeHome(300_000, { age40to64: false });
    expect(r.social.total).toBe(44_220);
    expect(r.incomeTaxMonthly).toBe(6_075); // 72,900 / 12
    expect(r.residentTaxMonthly).toBe(12_533); // round(150,400 / 12)
    expect(r.deductionsMonthly).toBe(62_828);
    expect(r.takeHomeMonthly).toBe(237_172);
  });

  it('deductions rise into a realistic band (~15–30%) across salaries', () => {
    for (const gross of [200_000, 300_000, 500_000, 800_000]) {
      const r = jpTakeHome(gross);
      const rate = r.deductionsMonthly / gross;
      expect(rate).toBeGreaterThan(0.14);
      expect(rate).toBeLessThan(0.35);
      expect(r.takeHomeMonthly).toBe(gross - r.deductionsMonthly);
    }
  });

  it('handles zero gross without NaN', () => {
    const r = jpTakeHome(0);
    expect(r.takeHomeMonthly).toBe(0);
    expect(r.deductionsMonthly).toBe(0);
  });
});
