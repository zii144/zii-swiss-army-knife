// @zii/calc — M5 "Calculation & Units Engine".
// Pure, offline, deterministic helpers for finance, dates, units, cooking, currency.

export {
  percentageOf,
  percentageChange,
  applyPercent,
  tip,
  discount,
  loanMonthlyPayment,
  amortizationSchedule,
  bmi,
  simpleInterest,
  compoundInterest,
} from './calc';
export type {
  TipResult,
  DiscountResult,
  AmortizationRow,
  BmiCategory,
  BmiResult,
} from './calc';

export { daysBetween, addDays, ageInYears } from './dates';

export { convert } from './units';
export type {
  Unit,
  LengthUnit,
  MassUnit,
  TemperatureUnit,
  VolumeUnit,
  AreaUnit,
  SpeedUnit,
  DataUnit,
} from './units';

export { convertCooking, DENSITY_G_PER_ML, US_CUP_ML } from './cooking';
export type { Ingredient, CookingUnit } from './cooking';

export { convertCurrency } from './currency';
export type { RateProvider } from './currency';
