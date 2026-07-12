/**
 * Australia payroll / tax estimates — FY 2025–26.
 * Pure, offline, deterministic. Planning estimates only — not ATO advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const AU_2026 = {
  label: 'Australia FY 2025–26 (estimate)',
  concessionalCap: 30_000,
  superGuaranteeRate: 0.12,
  medicareRate: 0.02,
  incomeBrackets: [
    { upTo: 18_200, rate: 0 },
    { upTo: 45_000, rate: 0.16 },
    { upTo: 135_000, rate: 0.3 },
    { upTo: 190_000, rate: 0.37 },
    { upTo: null, rate: 0.45 },
  ] satisfies TaxBracket[],
  /** MLS thresholds (singles) when no appropriate private hospital cover. */
  mls: [
    { upTo: 93_000, rate: 0 },
    { upTo: 108_000, rate: 0.01 },
    { upTo: 144_000, rate: 0.0125 },
    { upTo: null, rate: 0.015 },
  ] satisfies TaxBracket[],
  /** HELP repayment income tiers (FY 2025–26 approx). */
  help: [
    { upTo: 54_435, rate: 0 },
    { upTo: 62_850, rate: 0.01 },
    { upTo: 66_620, rate: 0.02 },
    { upTo: 70_618, rate: 0.025 },
    { upTo: 74_855, rate: 0.03 },
    { upTo: 79_346, rate: 0.035 },
    { upTo: 84_107, rate: 0.04 },
    { upTo: 89_154, rate: 0.045 },
    { upTo: 94_503, rate: 0.05 },
    { upTo: 100_174, rate: 0.055 },
    { upTo: 106_185, rate: 0.06 },
    { upTo: 112_556, rate: 0.065 },
    { upTo: 119_309, rate: 0.07 },
    { upTo: 126_467, rate: 0.075 },
    { upTo: 134_056, rate: 0.08 },
    { upTo: 142_100, rate: 0.085 },
    { upTo: 150_626, rate: 0.09 },
    { upTo: 159_663, rate: 0.095 },
    { upTo: null, rate: 0.1 },
  ] as { upTo: number | null; rate: number }[],
  annualLeaveDays: 20,
  personalLeaveDaysPerYear: 10,
} as const;

export function auIncomeTax(taxable: number): number {
  return progressiveTax([...AU_2026.incomeBrackets], taxable);
}

export function auMedicareLevy(taxable: number): number {
  if (taxable <= 0) return 0;
  return taxable * AU_2026.medicareRate;
}

export function auMls(taxable: number, privateHospital: boolean): number {
  if (privateHospital || taxable <= 0) return 0;
  // Flat rate for the income band (not progressive slices).
  for (const band of AU_2026.mls) {
    if (band.upTo === null || taxable <= band.upTo) return taxable * band.rate;
  }
  return 0;
}

export function auHelpRepayment(repaymentIncome: number): number {
  if (repaymentIncome <= 0) return 0;
  for (const band of AU_2026.help) {
    if (band.upTo === null || repaymentIncome <= band.upTo) {
      return repaymentIncome * band.rate;
    }
  }
  return 0;
}

export function auSuper(ote: number): { guarantee: number; rate: number } {
  return {
    guarantee: Math.max(0, ote) * AU_2026.superGuaranteeRate,
    rate: AU_2026.superGuaranteeRate,
  };
}

export function auLeaveAccrual(
  annualSalary: number,
  yearsWorked: number,
): { annualLeaveDays: number; annualLeaveValue: number; personalLeaveDays: number } {
  const years = Math.max(0, yearsWorked);
  const annualLeaveDays = AU_2026.annualLeaveDays * years;
  const daily = annualSalary / 260;
  return {
    annualLeaveDays,
    annualLeaveValue: annualLeaveDays * daily,
    personalLeaveDays: AU_2026.personalLeaveDaysPerYear * years,
  };
}

export interface AuTakeHomeResult {
  net: number;
  incomeTax: number;
  medicare: number;
  mls: number;
  help: number;
  superGuarantee: number;
}

export function auTakeHome(
  gross: number,
  opts?: { help?: boolean; privateHospital?: boolean },
): AuTakeHomeResult {
  const incomeTax = auIncomeTax(gross);
  const medicare = auMedicareLevy(gross);
  const mls = auMls(gross, opts?.privateHospital ?? true);
  const help = opts?.help ? auHelpRepayment(gross) : 0;
  const superGuarantee = auSuper(gross).guarantee;
  const net = gross - incomeTax - medicare - mls - help;
  return { net, incomeTax, medicare, mls, help, superGuarantee };
}
