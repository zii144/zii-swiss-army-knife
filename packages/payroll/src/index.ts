// @zii/payroll — M9 "Payroll & Tax Engine".
// Pluggable per-jurisdiction rule modules, progressive income tax, and
// VAT/GST sales tax. Pure, offline, deterministic.

export { progressiveTax, salesTax } from './tax';
export type { TaxBracket, SalesTaxResult } from './tax';

export { makeFlatRateModule, makeTaxModuleFromPack, grossForNet } from './rules';
export type {
  PayrollInput,
  PayrollBreakdown,
  PayrollRuleModule,
  FlatRateModuleConfig,
} from './rules';

// Hong Kong salaries tax (薪俸稅) + MPF.
export { hkSalariesTax, hkMpfEmployeeAnnual, HK_SALARIES_TAX_2024_25 } from './hk';
export type { HkSalariesTaxConfig, HkSalariesTaxInput, HkSalariesTaxResult } from './hk';

// Japan ふるさと納税 (hometown-tax) donation ceiling.
export {
  furusatoLimit,
  jpMarginalIncomeTaxRate,
  JP_INCOME_TAX_BRACKETS,
  FURUSATO_STANDARD,
} from './jp-furusato';
export type { FurusatoConfig, FurusatoResult } from './jp-furusato';

// Japan take-home pay (手取り) — 協会けんぽ 東京 令和6年度.
export {
  jpTakeHome,
  jpSocialInsuranceMonthly,
  jpHealthStandardRemuneration,
  jpPensionStandardRemuneration,
  jpEmploymentIncomeDeduction,
  jpIncomeTaxAnnual,
  jpResidentTaxAnnual,
  JP_TAKEHOME_TOKYO_2024,
} from './jp-takehome';
export type { JpTakeHomeConfig, JpSocialInsurance, JpTakeHomeResult } from './jp-takehome';
