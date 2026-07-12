/**
 * Korea payroll & labor helpers (2026 rates). Estimates — not 간이세액표 official.
 */

import { progressiveTax, type TaxBracket } from './tax';

export const KO_2026 = {
  label: 'Korea 2026 (estimate)',
  source: 'https://www.nhis.or.kr / https://www.nps.or.kr',
  nationalPension: 0.0475,
  healthInsurance: 0.03595,
  longTermCareOfHealth: 0.1314,
  employmentInsurance: 0.009,
  /** Approximate monthly withholding via simplified progressive on annualized taxable. */
  brackets: [
    { upTo: 14_000_000, rate: 0.06 },
    { upTo: 50_000_000, rate: 0.15 },
    { upTo: 88_000_000, rate: 0.24 },
    { upTo: 150_000_000, rate: 0.35 },
    { upTo: 300_000_000, rate: 0.38 },
    { upTo: 500_000_000, rate: 0.4 },
    { upTo: 1_000_000_000, rate: 0.42 },
    { upTo: null, rate: 0.45 },
  ] as TaxBracket[],
  localIncomeTaxOfIncomeTax: 0.1,
  vatRate: 0.1,
  overtimeWeekday: 0.5,
  overtimeNight: 0.5,
  overtimeHoliday: 1.0,
  monthlyHours: 209,
} as const;

export interface KoFourInsurances {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  total: number;
}

export function koFourInsurances(monthlyTaxable: number): KoFourInsurances {
  const base = Math.max(0, monthlyTaxable);
  const nationalPension = base * KO_2026.nationalPension;
  const healthInsurance = base * KO_2026.healthInsurance;
  const longTermCare = healthInsurance * KO_2026.longTermCareOfHealth;
  const employmentInsurance = base * KO_2026.employmentInsurance;
  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    total: nationalPension + healthInsurance + longTermCare + employmentInsurance,
  };
}

export interface KoTakeHomeResult {
  monthlyGross: number;
  insurances: KoFourInsurances;
  incomeTax: number;
  localTax: number;
  takeHome: number;
}

export function koTakeHome(monthlyGross: number, nonTaxable = 200_000): KoTakeHomeResult {
  const taxableMonthly = Math.max(0, monthlyGross - nonTaxable);
  const insurances = koFourInsurances(taxableMonthly);
  const annualTaxable = taxableMonthly * 12 - insurances.total * 12;
  const annualIncomeTax = progressiveTax(KO_2026.brackets, Math.max(0, annualTaxable));
  const incomeTax = annualIncomeTax / 12;
  const localTax = incomeTax * KO_2026.localIncomeTaxOfIncomeTax;
  const takeHome = monthlyGross - insurances.total - incomeTax - localTax;
  return { monthlyGross, insurances, incomeTax, localTax, takeHome };
}

/** 퇴직금: 평균임금 × 30 × (재직일수 / 365). */
export function koSeverance(averageDailyWage: number, serviceDays: number): number {
  return Math.max(0, averageDailyWage) * 30 * (Math.max(0, serviceDays) / 365);
}

/** 연차: Labor Standards Act §60 simplified. */
export function koAnnualLeaveDays(yearsOfService: number): number {
  const y = Math.max(0, yearsOfService);
  if (y < 1) return Math.min(11, Math.floor(y * 12));
  const extra = Math.floor((y - 1) / 2);
  return Math.min(25, 15 + extra);
}

export function koAnnualLeavePay(dailyOrdinaryWage: number, unusedDays: number): number {
  return Math.max(0, dailyOrdinaryWage) * Math.max(0, unusedDays);
}

export function koOvertimePay(
  hourlyOrdinary: number,
  hours: { weekday?: number; night?: number; holiday?: number },
): { weekday: number; night: number; holiday: number; total: number } {
  const h = Math.max(0, hourlyOrdinary);
  const weekday = (hours.weekday ?? 0) * h * (1 + KO_2026.overtimeWeekday);
  const night = (hours.night ?? 0) * h * (1 + KO_2026.overtimeNight);
  const holiday = (hours.holiday ?? 0) * h * (1 + KO_2026.overtimeHoliday);
  return { weekday, night, holiday, total: weekday + night + holiday };
}
