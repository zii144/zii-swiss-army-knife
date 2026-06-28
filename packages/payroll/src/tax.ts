// Tax primitives. Pure, deterministic, offline.

/** A single income-tax bracket. `upTo: null` marks the open-ended top bracket. */
export interface TaxBracket {
  /** Upper bound of this bracket, or null for the top bracket. */
  upTo: number | null;
  rate: number;
}

/**
 * Marginal (bracketed) income tax. Each slice of `taxable` that falls within a
 * bracket is taxed at that bracket's `rate`; only the portion above the previous
 * bound is taxed at the next rate. Brackets must be ordered ascending by `upTo`
 * with exactly one open (`upTo: null`) top bracket.
 *
 * progressiveTax(
 *   [{ upTo: 10000, rate: 0.1 }, { upTo: 30000, rate: 0.2 }, { upTo: null, rate: 0.3 }],
 *   20000,
 * ) === 1000 + 2000 === 3000
 */
export function progressiveTax(brackets: TaxBracket[], taxable: number): number {
  if (taxable <= 0) {
    return 0;
  }
  let tax = 0;
  let lower = 0;
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (!bracket) {
      continue;
    }
    const upper = bracket.upTo;
    // Width of the slice of income that lands in this bracket.
    const ceiling = upper === null ? taxable : Math.min(upper, taxable);
    const slice = ceiling - lower;
    if (slice > 0) {
      tax += slice * bracket.rate;
    }
    lower = upper === null ? taxable : upper;
    if (upper !== null && taxable <= upper) {
      break;
    }
  }
  return tax;
}

/** Net/tax/gross split for a sales-tax (VAT/GST) calculation. */
export interface SalesTaxResult {
  net: number;
  tax: number;
  gross: number;
}

/**
 * Sales tax (VAT/GST style).
 *
 * - tax-exclusive (default): `amount` is the net price; tax is added on top.
 *   salesTax(100, 0.2) -> { net: 100, tax: 20, gross: 120 }
 * - tax-inclusive (`opts.inclusive`): `amount` already includes the tax, which is
 *   backed out.
 *   salesTax(120, 0.2, { inclusive: true }) -> { net: 100, tax: 20, gross: 120 }
 */
export function salesTax(
  amount: number,
  rate: number,
  opts?: { inclusive?: boolean },
): SalesTaxResult {
  if (opts?.inclusive) {
    const net = amount / (1 + rate);
    return { net, tax: amount - net, gross: amount };
  }
  const tax = amount * rate;
  return { net: amount, tax, gross: amount + tax };
}
