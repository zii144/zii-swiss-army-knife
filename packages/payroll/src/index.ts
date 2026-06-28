// @zii/payroll — M9 "Payroll & Tax Engine".
// Pluggable per-jurisdiction rule modules, progressive income tax, and
// VAT/GST sales tax. Pure, offline, deterministic.

export { progressiveTax, salesTax } from './tax';
export type { TaxBracket, SalesTaxResult } from './tax';

export { makeFlatRateModule, makeTaxModuleFromPack } from './rules';
export type {
  PayrollInput,
  PayrollBreakdown,
  PayrollRuleModule,
  FlatRateModuleConfig,
} from './rules';
