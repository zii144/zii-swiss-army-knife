/**
 * Japan ふるさと納税 (hometown-tax donation) full-deduction limit.
 *
 * Pure, offline, deterministic. Implements the 総務省 (MoIC) standard formula
 * for the donation ceiling at which only the ¥2,000 self-pay is not refunded:
 *
 *   限度額 = 住民税所得割額 × 20%
 *            ────────────────────────────────  + 2,000
 *            90% − 所得税率 × 1.021
 *
 *   • 住民税所得割額 = 課税所得 × 10%
 *   • 90% = 100% − 住民税基本控除分 10%
 *   • 1.021 = 復興特別所得税 (2.1% surtax) multiplier
 *
 * We take 課税所得 (taxable income, "課税される所得金額" on the 源泉徴収票) as the
 * input, which makes the result exact — deriving it from salary would require
 * per-person social-insurance and deduction data we do not model here. This is a
 * planning estimate; the actual ceiling depends on your full tax situation.
 */
import type { TaxBracket } from './tax';

/**
 * 所得税 marginal-rate brackets on 課税所得 (taxable income). Source: NTA
 * (National Tax Agency) income-tax speed table. Stable across recent years.
 */
export const JP_INCOME_TAX_BRACKETS: readonly TaxBracket[] = [
  { upTo: 1_950_000, rate: 0.05 },
  { upTo: 3_300_000, rate: 0.1 },
  { upTo: 6_950_000, rate: 0.2 },
  { upTo: 9_000_000, rate: 0.23 },
  { upTo: 18_000_000, rate: 0.33 },
  { upTo: 40_000_000, rate: 0.4 },
  { upTo: null, rate: 0.45 },
];

/** The marginal 所得税 rate that applies to `taxableIncome`. */
export function jpMarginalIncomeTaxRate(taxableIncome: number): number {
  const income = Math.max(0, taxableIncome);
  for (const bracket of JP_INCOME_TAX_BRACKETS) {
    if (bracket.upTo === null || income <= bracket.upTo) return bracket.rate;
  }
  return 0;
}

/** Dated constants for the furusato ceiling formula. */
export interface FurusatoConfig {
  /** Provenance URL. */
  source: string;
  /** 復興特別所得税 multiplier (2.1% surtax → 1.021). */
  reconstructionSurtax: number;
  /** 住民税所得割 rate (10%). */
  residentTaxRate: number;
  /** Special-exception cap: 20% of 住民税所得割. */
  specialExceptionCap: number;
  /** 住民税 basic-deduction portion (10%) subtracted in the denominator. */
  residentBasicDeduction: number;
  /** Self-pay floor (¥2,000). */
  selfPay: number;
}

/** Standard formula constants (valid for recent years incl. FY2024). */
export const FURUSATO_STANDARD: FurusatoConfig = {
  source:
    'https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html',
  reconstructionSurtax: 1.021,
  residentTaxRate: 0.1,
  specialExceptionCap: 0.2,
  residentBasicDeduction: 0.1,
  selfPay: 2000,
};

/** A furusato ceiling estimate. */
export interface FurusatoResult {
  /** 住民税所得割額 = 課税所得 × 10%. */
  residentTaxIncomeLevy: number;
  /** Marginal 所得税 rate applied. */
  marginalRate: number;
  /** Recommended donation upper limit (full-deduction ceiling), yen (floored). */
  limit: number;
}

/**
 * Recommended ふるさと納税 upper limit for a given 課税所得 (taxable income).
 * Returns the ¥2,000 floor when taxable income is 0 or the formula degenerates.
 */
export function furusatoLimit(
  taxableIncome: number,
  cfg: FurusatoConfig = FURUSATO_STANDARD,
): FurusatoResult {
  const income = Math.max(0, taxableIncome);
  const levy = income * cfg.residentTaxRate;
  const rate = jpMarginalIncomeTaxRate(income);
  const denominator = 1 - cfg.residentBasicDeduction - rate * cfg.reconstructionSurtax;
  const limit =
    income > 0 && denominator > 0
      ? (levy * cfg.specialExceptionCap) / denominator + cfg.selfPay
      : cfg.selfPay;
  return {
    residentTaxIncomeLevy: levy,
    marginalRate: rate,
    limit: Math.floor(limit),
  };
}
