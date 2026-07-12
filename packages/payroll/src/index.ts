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

// Hong Kong salaries tax (薪俸稅) + MPF + severance (遣散費/長服金).
export {
  hkSalariesTax,
  hkMpfEmployeeAnnual,
  hkSeverancePayment,
  HK_SALARIES_TAX_2024_25,
  HK_SEVERANCE,
} from './hk';
export type {
  HkSalariesTaxConfig,
  HkSalariesTaxInput,
  HkSalariesTaxResult,
  HkSeveranceConfig,
  HkSeveranceResult,
} from './hk';

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

// Canada 2026.
export {
  caTakeHome,
  caCppEmployee,
  caEiEmployee,
  caFederalTax,
  caProvincialTax,
  caGstHst,
  caRrspTaxImpact,
  caTfsaRoom,
  CA_2026,
} from './ca';
export type { CaProvince, CaTakeHomeResult } from './ca';

// Australia FY 2025–26.
export {
  auTakeHome,
  auIncomeTax,
  auMedicareLevy,
  auMls,
  auHelpRepayment,
  auSuper,
  auLeaveAccrual,
  AU_2026,
} from './au';
export type { AuTakeHomeResult } from './au';

// Korea 2026.
export {
  koTakeHome,
  koFourInsurances,
  koSeverance,
  koAnnualLeaveDays,
  koAnnualLeavePay,
  koOvertimePay,
  KO_2026,
} from './ko';
export type { KoFourInsurances, KoTakeHomeResult } from './ko';

// Germany 2026.
export {
  deTakeHome,
  deIncomeTaxAnnual,
  deVacationDays,
  deCommuteAllowance,
  deSeveranceTax,
  DE_2026,
  DE_HOLIDAYS_2026_FEDERAL,
} from './de';
export type { DeTaxClass, DeTakeHomeResult } from './de';

// France 2026.
export {
  frBrutNet,
  frEmployerCost,
  frPasAmount,
  frCongesAccrual,
  frIncomeTaxAnnual,
  FR_2026,
  FR_HOLIDAYS_2026,
  FR_HOLIDAYS_ALSACE_EXTRA,
} from './fr';
export type { FrBrutNetResult } from './fr';
