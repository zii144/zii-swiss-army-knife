// Payroll rule contract + reference rule modules. Pure, deterministic, offline.

import type { LocalePack } from '@zii/locale';
import { progressiveTax } from './tax';
import type { TaxBracket } from './tax';

/** Input to a payroll computation. */
export interface PayrollInput {
  /** Gross pay for the period being computed. */
  gross: number;
  /** Pay periods per year (e.g. 12 monthly). Used by rules that annualise. */
  periodsPerYear?: number;
  /** Extra named amounts a rule may consume (bonuses, allowances, …). */
  extra?: Record<string, number>;
}

/** Result of a payroll computation. */
export interface PayrollBreakdown {
  gross: number;
  /** Named deduction lines (income tax, social insurance, …). */
  deductions: Record<string, number>;
  totalDeductions: number;
  net: number;
  /** Total cost to the employer (gross + employer-side contributions), if known. */
  employerCost?: number;
}

/**
 * A pluggable per-jurisdiction payroll rule. Implementations are pure functions
 * of their input; `market`/`version` identify which ruleset produced a result.
 */
export interface PayrollRuleModule {
  market: string;
  version: number;
  computeNet(input: PayrollInput): PayrollBreakdown;
}

/** Sum the values of a record. */
function sumValues(record: Record<string, number>): number {
  let total = 0;
  for (const value of Object.values(record)) {
    total += value;
  }
  return total;
}

export interface FlatRateModuleConfig {
  market: string;
  version: number;
  /** Employee-side deduction lines, each `gross * rate`. */
  rates: Record<string, number>;
  /** Employer-side contribution lines, each `gross * rate`, added to employer cost. */
  employerRates?: Record<string, number>;
}

/**
 * Reference rule module: every line deducts `gross * rate`. Net is gross minus the
 * sum of deductions; employer cost is gross plus the sum of employer contributions.
 *
 * makeFlatRateModule({ market: 'x', version: 1, rates: { pension: 0.06 } })
 *   .computeNet({ gross: 1000 })
 *   -> deductions.pension === 60, totalDeductions === 60, net === 940
 */
export function makeFlatRateModule(config: FlatRateModuleConfig): PayrollRuleModule {
  const { market, version, rates, employerRates } = config;
  return {
    market,
    version,
    computeNet(input: PayrollInput): PayrollBreakdown {
      const { gross } = input;
      const deductions: Record<string, number> = {};
      for (const [name, rate] of Object.entries(rates)) {
        deductions[name] = gross * rate;
      }
      const totalDeductions = sumValues(deductions);
      let employerContrib = 0;
      if (employerRates) {
        for (const rate of Object.values(employerRates)) {
          employerContrib += gross * rate;
        }
      }
      return {
        gross,
        deductions,
        totalDeductions,
        net: gross - totalDeductions,
        employerCost: gross + employerContrib,
      };
    },
  };
}

/**
 * Build a rule module from a locale pack (M9 config-as-data).
 *
 * Mapping:
 *  - `market`/`version`: taken from `pack.market` and `pack.year`.
 *  - Social-insurance deductions: each entry of `pack.payroll.socialInsurance`
 *    becomes a deduction line of `gross * rate`. `pack.payroll.pensionEmployeeRate`,
 *    if present, adds a `pension` line.
 *  - Income tax: `pack.tax.incomeBrackets` is fed to `progressiveTax` over the
 *    *taxable* amount (gross minus social-insurance deductions) and added as the
 *    `incomeTax` line.
 *  - Employer cost: `pack.payroll.pensionEmployerRate`, if present, is added on top
 *    of gross as the sole modelled employer contribution.
 */
export function makeTaxModuleFromPack(pack: LocalePack): PayrollRuleModule {
  const social = pack.payroll?.socialInsurance ?? {};
  const pensionEmployeeRate = pack.payroll?.pensionEmployeeRate;
  const pensionEmployerRate = pack.payroll?.pensionEmployerRate;
  const brackets: TaxBracket[] = pack.tax?.incomeBrackets ?? [];

  return {
    market: pack.market,
    version: pack.year,
    computeNet(input: PayrollInput): PayrollBreakdown {
      const { gross } = input;
      const deductions: Record<string, number> = {};
      for (const [name, rate] of Object.entries(social)) {
        deductions[name] = gross * rate;
      }
      if (pensionEmployeeRate !== undefined) {
        deductions.pension = (deductions.pension ?? 0) + gross * pensionEmployeeRate;
      }
      const socialTotal = sumValues(deductions);
      // Income tax is levied on income net of social-insurance contributions.
      const taxable = gross - socialTotal;
      if (brackets.length > 0) {
        deductions.incomeTax = progressiveTax(brackets, taxable);
      }
      const totalDeductions = sumValues(deductions);
      const employerCost =
        pensionEmployerRate !== undefined ? gross + gross * pensionEmployerRate : gross;
      return {
        gross,
        deductions,
        totalDeductions,
        net: gross - totalDeductions,
        employerCost,
      };
    },
  };
}
