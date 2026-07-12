/**
 * Australia payroll & tax helpers (FY 2025–26). Estimates only — not ATO official.
 */

import { progressiveTax, type TaxBracket } from './tax';

export const AU_2026 = {
  label: 'Australia FY 2025–26 (estimate)',
  source: 'https://www.ato.gov.au',
  brackets: [
    { upTo: 18_200, rate: 0 },
    { upTo: 45_000, rate: 0.16 },
    { upTo: 135_000, rate: 0.3 },
    { upTo: 190_000, rate: 0.37 },
    { upTo: null, rate: 0.45 },
  ] as TaxBracket[],
  medicareLevy: 0.02,
  superGuarantee: 0.12,
  concessionalCap: 30_000,
  /** HELP/HECS 2025–26 marginal repayment rates (simplified tiers). */
  helpThresholds: [
    { from: 67_000, rate: 0.01 },
    { from: 76_000, rate: 0.02 },
    { from: 85_000, rate: 0.025 },
    { from: 95_000, rate: 0.03 },
    { from: 110_000, rate: 0.04 },
    { from: 130_000, rate: 0.05 },
    { from: 150_000, rate: 0.06 },
    { from: 180_000, rate: 0.07 },
    { from: 220_000, rate: 0.08 },
    { from: 260_000, rate: 0.09 },
    { from: 300_000, rate: 0.1 },
  ],
  mls: [
    { from: 101_000, rate: 0.01 },
    { from: 118_000, rate: 0.0125 },
    { from: 158_000, rate: 0.015 },
  ],
  annualLeaveWeeks: 4,
  personalLeaveDays: 10,
} as const;

export function auIncomeTax(taxable: number): number {
  return progressiveTax(AU_2026.brackets, taxable);
}

export function auMedicareLevy(taxable: number): number {
  return Math.max(0, taxable) * AU_2026.medicareLevy;
}

export function auMls(taxable: number, hasPrivateHospital = true): number {
  if (hasPrivateHospital) return 0;
  let rate = 0;
  for (const tier of AU_2026.mls) {
    if (taxable >= tier.from) rate = tier.rate;
  }
  return taxable * rate;
}

export function auHelpRepayment(repaymentIncome: number): number {
  let rate = 0;
  for (const tier of AU_2026.helpThresholds) {
    if (repaymentIncome >= tier.from) rate = tier.rate;
  }
  return repaymentIncome * rate;
}

export function auSuper(employerOrdinaryTimeEarnings: number): {
  guarantee: number;
  rate: number;
} {
  return {
    guarantee: Math.max(0, employerOrdinaryTimeEarnings) * AU_2026.superGuarantee,
    rate: AU_2026.superGuarantee,
  };
}

export interface AuTakeHomeResult {
  gross: number;
  incomeTax: number;
  medicare: number;
  mls: number;
  help: number;
  superGuarantee: number;
  net: number;
}

export function auTakeHome(
  annualGross: number,
  opts?: { help?: boolean; privateHospital?: boolean },
): AuTakeHomeResult {
  const incomeTax = auIncomeTax(annualGross);
  const medicare = auMedicareLevy(annualGross);
  const mls = auMls(annualGross, opts?.privateHospital ?? true);
  const help = opts?.help ? auHelpRepayment(annualGross) : 0;
  const { guarantee } = auSuper(annualGross);
  const net = annualGross - incomeTax - medicare - mls - help;
  return {
    gross: annualGross,
    incomeTax,
    medicare,
    mls,
    help,
    superGuarantee: guarantee,
    net,
  };
}

/** Accrual estimate: weeks of annual leave × weekly ordinary pay. */
export function auLeaveAccrual(
  annualSalary: number,
  yearsWorked: number,
): { annualLeaveDays: number; annualLeaveValue: number; personalLeaveDays: number } {
  const weeks = AU_2026.annualLeaveWeeks * Math.max(0, yearsWorked);
  const weekly = annualSalary / 52;
  return {
    annualLeaveDays: weeks * 5,
    annualLeaveValue: weeks * weekly,
    personalLeaveDays: AU_2026.personalLeaveDays * Math.max(0, yearsWorked),
  };
}
