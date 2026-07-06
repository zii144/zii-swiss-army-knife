/**
 * Hong Kong Salaries Tax (薪俸稅) + mandatory MPF (強積金).
 *
 * Pure, offline, deterministic. All rates/allowances are dated, sourced
 * constants for one year of assessment (see {@link HkSalariesTaxConfig}); the
 * math is stable law. Salaries tax is the LOWER of:
 *   • progressive tax on Net Chargeable Income (income − deductions − allowances)
 *   • standard-rate tax on Net Total Income (income − deductions, no allowances)
 *
 * This is an estimate for planning — it does not model every allowance
 * (dependent parent/grandparent, disability, home-loan interest, etc.) or the
 * annual one-off tax reduction, which changes every budget.
 */
import { progressiveTax, type TaxBracket } from './tax';

/** Dated salaries-tax + MPF constants for one year of assessment. */
export interface HkSalariesTaxConfig {
  /** e.g. "2024/25". */
  yearOfAssessment: string;
  /** Provenance URL. */
  source: string;
  /** Progressive rates applied to Net Chargeable Income. */
  progressiveBrackets: readonly TaxBracket[];
  /** Standard-rate brackets applied to Net Total Income (before allowances). */
  standardBrackets: readonly TaxBracket[];
  /** Basic allowance (single). */
  basicAllowance: number;
  /** Married person's allowance (replaces basic). */
  marriedAllowance: number;
  /** Child allowance, per child (1st–9th), excluding year-of-birth uplift. */
  childAllowance: number;
  /** Mandatory MPF employee contribution rate. */
  mpfRate: number;
  /** Annual cap on deductible/mandatory employee MPF. */
  mpfAnnualCap: number;
  /** Minimum monthly relevant income below which no employee MPF is due. */
  mpfMinMonthly: number;
  /** Maximum monthly relevant income counted for MPF. */
  mpfMaxMonthly: number;
}

/**
 * Year of assessment 2024/25. Source: Inland Revenue Department (ird.gov.hk)
 * and MPFA (mpfa.org.hk). Standard rate is the two-tiered 15%/16% introduced
 * in 2024/25 (16% on net income above HK$5,000,000).
 */
export const HK_SALARIES_TAX_2024_25: HkSalariesTaxConfig = {
  yearOfAssessment: '2024/25',
  source: 'https://www.ird.gov.hk/',
  progressiveBrackets: [
    { upTo: 50_000, rate: 0.02 },
    { upTo: 100_000, rate: 0.06 },
    { upTo: 150_000, rate: 0.1 },
    { upTo: 200_000, rate: 0.14 },
    { upTo: null, rate: 0.17 },
  ],
  standardBrackets: [
    { upTo: 5_000_000, rate: 0.15 },
    { upTo: null, rate: 0.16 },
  ],
  basicAllowance: 132_000,
  marriedAllowance: 264_000,
  childAllowance: 130_000,
  mpfRate: 0.05,
  mpfAnnualCap: 18_000,
  mpfMinMonthly: 7_100,
  mpfMaxMonthly: 30_000,
};

/**
 * Mandatory employee MPF contribution for one year, from monthly relevant
 * income: 5% of income, exempt below the min, and capped at the annual max.
 */
export function hkMpfEmployeeAnnual(monthlyIncome: number, cfg: HkSalariesTaxConfig): number {
  if (monthlyIncome < cfg.mpfMinMonthly) return 0;
  const capped = Math.min(monthlyIncome, cfg.mpfMaxMonthly);
  return Math.min(capped * cfg.mpfRate * 12, cfg.mpfAnnualCap);
}

/** Inputs to a salaries-tax estimate (annual figures unless noted). */
export interface HkSalariesTaxInput {
  /** Annual assessable income. */
  annualIncome: number;
  /** Use the married person's allowance instead of the basic allowance. */
  married?: boolean;
  /** Number of dependent children (1st–9th counted). */
  children?: number;
  /** Deductible mandatory MPF (capped internally at the annual cap). */
  mpfDeduction?: number;
  /** Other approved deductions (charitable donations, self-education, …). */
  otherDeductions?: number;
}

/** A salaries-tax estimate. */
export interface HkSalariesTaxResult {
  yearOfAssessment: string;
  /** Income − deductions (basis for the standard rate). */
  netTotalIncome: number;
  /** Total allowances applied. */
  allowances: number;
  /** Net Chargeable Income = max(0, netTotalIncome − allowances). */
  netChargeableIncome: number;
  /** Progressive tax on Net Chargeable Income. */
  progressiveTax: number;
  /** Standard-rate tax on Net Total Income. */
  standardTax: number;
  /** Tax payable = min(progressive, standard). */
  taxPayable: number;
  /** taxPayable / annualIncome (0 when income is 0). */
  effectiveRate: number;
}

/** Estimate HK salaries tax for one year of assessment. */
export function hkSalariesTax(
  input: HkSalariesTaxInput,
  cfg: HkSalariesTaxConfig = HK_SALARIES_TAX_2024_25,
): HkSalariesTaxResult {
  const income = Math.max(0, input.annualIncome);
  const deductions =
    Math.min(Math.max(0, input.mpfDeduction ?? 0), cfg.mpfAnnualCap) +
    Math.max(0, input.otherDeductions ?? 0);
  const netTotalIncome = Math.max(0, income - deductions);

  const allowances =
    (input.married ? cfg.marriedAllowance : cfg.basicAllowance) +
    Math.max(0, Math.floor(input.children ?? 0)) * cfg.childAllowance;
  const netChargeableIncome = Math.max(0, netTotalIncome - allowances);

  const prog = progressiveTax([...cfg.progressiveBrackets], netChargeableIncome);
  const std = progressiveTax([...cfg.standardBrackets], netTotalIncome);
  const taxPayable = Math.min(prog, std);

  return {
    yearOfAssessment: cfg.yearOfAssessment,
    netTotalIncome,
    allowances,
    netChargeableIncome,
    progressiveTax: prog,
    standardTax: std,
    taxPayable,
    effectiveRate: income > 0 ? taxPayable / income : 0,
  };
}
