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
export type { TipResult, DiscountResult, AmortizationRow, BmiCategory, BmiResult } from './calc';

export { daysBetween, addDays, ageInYears } from './dates';

export { unixToIso, isoToUnix, nowUnix, parseUnixTimestamp } from './timestamp';
export type { UnixUnit } from './timestamp';

export { formatDuration, parseDuration } from './duration';

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
  PressureUnit,
  EnergyUnit,
  AngleUnit,
  PowerUnit,
  FrequencyUnit,
} from './units';

export { convertCooking, DENSITY_G_PER_ML, US_CUP_ML } from './cooking';
export type { Ingredient, CookingUnit } from './cooking';

export { convertCurrency } from './currency';
export type { RateProvider } from './currency';

export { gcd, lcm } from './math';

export {
  subscriptionAnnual,
  subscriptionMonthly,
  subscriptionTotals,
} from './subscriptions';
export type { BillingCycle, Subscription, SubscriptionTotals } from './subscriptions';
