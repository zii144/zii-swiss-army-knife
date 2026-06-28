// Currency conversion. The exchange rate is always injected — this module never
// touches the network. You may pass either a numeric rate (units of `to` per 1 unit
// of `from`) or a synchronous provider function that returns such a rate.

/** Resolves an exchange rate: `to` units per 1 unit of `from`. */
export type RateProvider = (from: string, to: string) => number;

/**
 * Convert `amount` from one currency to another using an injected rate or provider.
 *
 *   convertCurrency(100, 'USD', 'EUR', 0.9)               // === 90
 *   convertCurrency(100, 'USD', 'EUR', (f, t) => table[f][t])
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rateOrProvider: number | RateProvider,
): number {
  const rate =
    typeof rateOrProvider === 'function' ? rateOrProvider(from, to) : rateOrProvider;
  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new Error(`convertCurrency: invalid rate for ${from}->${to}`);
  }
  return amount * rate;
}
