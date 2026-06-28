// Finance & health calculations. Pure, deterministic, offline.

/** Round to a fixed number of decimal places (half-up on the rounded magnitude). */
function roundTo(value: number, dp: number): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

/** `part` as a percentage of `whole`. percentageOf(25, 200) === 12.5 */
export function percentageOf(part: number, whole: number): number {
  if (whole === 0) {
    throw new Error('percentageOf: whole must be non-zero');
  }
  return (part / whole) * 100;
}

/** Percent change from `from` to `to`. percentageChange(100, 150) === 50 */
export function percentageChange(from: number, to: number): number {
  if (from === 0) {
    throw new Error('percentageChange: from must be non-zero');
  }
  return ((to - from) / from) * 100;
}

/** Apply a percentage to a value. applyPercent(200, 10) === 20 */
export function applyPercent(value: number, pct: number): number {
  return (value * pct) / 100;
}

export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
}

/** Tip on a bill, optionally split between people. tip(100, 18, 2) -> { tip: 18, total: 118, perPerson: 59 } */
export function tip(bill: number, pct: number, split = 1): TipResult {
  if (split < 1 || !Number.isInteger(split)) {
    throw new Error('tip: split must be a positive integer');
  }
  const tipAmount = applyPercent(bill, pct);
  const total = bill + tipAmount;
  return {
    tip: roundTo(tipAmount, 2),
    total: roundTo(total, 2),
    perPerson: roundTo(total / split, 2),
  };
}

export interface DiscountResult {
  amount: number;
  final: number;
}

/** Discount on a price. discount(100, 25) -> { amount: 25, final: 75 } */
export function discount(price: number, pct: number): DiscountResult {
  const amount = applyPercent(price, pct);
  return {
    amount: roundTo(amount, 2),
    final: roundTo(price - amount, 2),
  };
}

/**
 * Monthly payment for a fully-amortizing fixed-rate loan.
 * Uses the standard annuity formula: P * r / (1 - (1 + r)^-n), where r is the monthly rate.
 * loanMonthlyPayment(100000, 6, 360) ≈ 599.55
 */
export function loanMonthlyPayment(
  principal: number,
  annualRatePct: number,
  months: number,
): number {
  if (months <= 0 || !Number.isInteger(months)) {
    throw new Error('loanMonthlyPayment: months must be a positive integer');
  }
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) {
    return roundTo(principal / months, 2);
  }
  const factor = (1 + monthlyRate) ** -months;
  const payment = (principal * monthlyRate) / (1 - factor);
  return roundTo(payment, 2);
}

export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

/**
 * Full amortization schedule. Each row reports the interest/principal split and the
 * remaining balance after that period. The final payment is adjusted so the balance
 * lands exactly on zero (absorbing accumulated rounding).
 */
export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  months: number,
): AmortizationRow[] {
  if (months <= 0 || !Number.isInteger(months)) {
    throw new Error('amortizationSchedule: months must be a positive integer');
  }
  const monthlyRate = annualRatePct / 100 / 12;
  const payment = loanMonthlyPayment(principal, annualRatePct, months);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  for (let period = 1; period <= months; period++) {
    const interest = roundTo(balance * monthlyRate, 2);
    let principalPaid = roundTo(payment - interest, 2);
    let rowPayment = payment;
    if (period === months) {
      // Final period: settle the exact remaining balance.
      principalPaid = roundTo(balance, 2);
      rowPayment = roundTo(principalPaid + interest, 2);
    }
    balance = roundTo(balance - principalPaid, 2);
    rows.push({
      period,
      payment: rowPayment,
      interest,
      principal: principalPaid,
      balance: balance < 0 ? 0 : balance,
    });
  }
  return rows;
}

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BmiResult {
  value: number;
  category: BmiCategory;
}

/**
 * Body mass index from weight (kg) and height (cm).
 * Categories use WHO cutoffs: <18.5 underweight, <25 normal, <30 overweight, else obese.
 * bmi(70, 175) -> { value: 22.86, category: 'normal' }
 */
export function bmi(kg: number, cm: number): BmiResult {
  if (cm <= 0) {
    throw new Error('bmi: height (cm) must be positive');
  }
  const meters = cm / 100;
  const raw = kg / (meters * meters);
  const value = roundTo(raw, 2);
  let category: BmiCategory;
  if (raw < 18.5) {
    category = 'underweight';
  } else if (raw < 25) {
    category = 'normal';
  } else if (raw < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }
  return { value, category };
}

/** Simple interest earned. simpleInterest(1000, 5, 3) === 150 */
export function simpleInterest(p: number, ratePct: number, years: number): number {
  return roundTo(p * (ratePct / 100) * years, 2);
}

/**
 * Compound interest earned (return is the interest, not the final balance).
 * compoundInterest(1000, 5, 10, 12) compounds monthly.
 */
export function compoundInterest(
  p: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 12,
): number {
  if (compoundsPerYear <= 0 || !Number.isInteger(compoundsPerYear)) {
    throw new Error('compoundInterest: compoundsPerYear must be a positive integer');
  }
  const ratePerPeriod = annualRatePct / 100 / compoundsPerYear;
  const periods = compoundsPerYear * years;
  const finalAmount = p * (1 + ratePerPeriod) ** periods;
  return roundTo(finalAmount - p, 2);
}
