/**
 * Korea payroll / labor estimates — 2026.
 * Pure, offline, deterministic. Planning estimates only — not NTS / MOEL advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const KO_2026 = {
  label: 'Korea 2026 (estimate)',
  nationalPensionRate: 0.0475,
  nationalPensionCap: 6_370_000,
  healthInsuranceRate: 0.03595,
  longTermCareOfHealth: 0.1295,
  employmentInsuranceRate: 0.009,
  localTaxOfIncomeTax: 0.1,
  incomeBrackets: [
    { upTo: 14_000_000, rate: 0.06 },
    { upTo: 50_000_000, rate: 0.15 },
    { upTo: 88_000_000, rate: 0.24 },
    { upTo: 150_000_000, rate: 0.35 },
    { upTo: 300_000_000, rate: 0.38 },
    { upTo: 500_000_000, rate: 0.4 },
    { upTo: 1_000_000_000, rate: 0.42 },
    { upTo: null, rate: 0.45 },
  ] satisfies TaxBracket[],
  overtimeWeekdayPremium: 0.5,
  overtimeNightPremium: 0.5,
  overtimeHolidayPremium: 1.0,
} as const;

export interface KoInsurances {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  total: number;
}

export function koFourInsurances(monthlyTaxable: number): KoInsurances {
  const base = Math.max(0, monthlyTaxable);
  const pensionBase = Math.min(base, KO_2026.nationalPensionCap);
  const nationalPension = pensionBase * KO_2026.nationalPensionRate;
  const healthInsurance = base * KO_2026.healthInsuranceRate;
  const longTermCare = healthInsurance * KO_2026.longTermCareOfHealth;
  const employmentInsurance = base * KO_2026.employmentInsuranceRate;
  const total = nationalPension + healthInsurance + longTermCare + employmentInsurance;
  return { nationalPension, healthInsurance, longTermCare, employmentInsurance, total };
}

/** Monthly take-home from monthly gross and non-taxable allowances. */
export function koTakeHome(
  monthlyGross: number,
  nontaxable = 0,
): {
  takeHome: number;
  insurances: KoInsurances;
  incomeTax: number;
  localTax: number;
} {
  const taxablePay = Math.max(0, monthlyGross - Math.max(0, nontaxable));
  const insurances = koFourInsurances(taxablePay);
  // Rough simplified monthly withholding from annualized taxable − insurance.
  const annualTaxable = Math.max(0, (taxablePay - insurances.total) * 12);
  const annualIncomeTax = progressiveTax([...KO_2026.incomeBrackets], annualTaxable);
  const incomeTax = annualIncomeTax / 12;
  const localTax = incomeTax * KO_2026.localTaxOfIncomeTax;
  const takeHome = monthlyGross - insurances.total - incomeTax - localTax;
  return { takeHome, insurances, incomeTax, localTax };
}

/** 퇴직금 = average daily wage × 30 × (service days ÷ 365). */
export function koSeverance(averageDailyWage: number, serviceDays: number): number {
  return Math.max(0, averageDailyWage) * 30 * (Math.max(0, serviceDays) / 365);
}

/** Labor Standards Act §60 annual leave days from completed years of service. */
export function koAnnualLeaveDays(yearsOfService: number): number {
  const y = Math.max(0, Math.floor(yearsOfService));
  if (y < 1) return 0;
  if (y === 1) return 15;
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
  const weekday = h * (1 + KO_2026.overtimeWeekdayPremium) * (hours.weekday ?? 0);
  const night = h * KO_2026.overtimeNightPremium * (hours.night ?? 0);
  // Night premium is additive on top of ordinary; holiday pay is 100% premium (2×).
  const holiday = h * (1 + KO_2026.overtimeHolidayPremium) * (hours.holiday ?? 0);
  return { weekday, night, holiday, total: weekday + night + holiday };
}
