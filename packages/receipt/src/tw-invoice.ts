/**
 * Taiwan Uniform-Invoice Lottery (統一發票對獎).
 *
 * The Ministry of Finance draws winning numbers every two months. The *prize
 * structure* below is fixed by law and stable; only the *numbers* change each
 * period. This module implements the stable prize-matching algorithm as a pure,
 * offline function and treats the per-period numbers as dated, sourced data
 * (see {@link TwInvoiceDrawing}) supplied either from the bundled table or by
 * the user — we never ship fabricated "official" numbers.
 *
 * Prize rules (每期固定):
 *   特別獎   specialPrize   match all 8 digits            → NT$10,000,000
 *   特獎     grandPrize     match all 8 digits            → NT$2,000,000
 *   頭獎     firstPrizes    match all 8 digits            → NT$200,000
 *     二獎                  match last 7 digits           → NT$40,000
 *     三獎                  match last 6 digits           → NT$10,000
 *     四獎                  match last 5 digits           → NT$4,000
 *     五獎                  match last 4 digits           → NT$1,000
 *     六獎                  match last 3 digits           → NT$200
 *   增開六獎 additionalSixth match last 3 digits           → NT$200
 */

/** The winning numbers for one bi-monthly drawing. */
export interface TwInvoiceDrawing {
  /**
   * ROC period label, e.g. "114-11-12" for 民國114年 11–12月. Free-form; used
   * only for display and selection.
   */
  period: string;
  /** 8-digit 特別獎 number (NT$10,000,000). */
  specialPrize: string;
  /** 8-digit 特獎 number (NT$2,000,000). */
  grandPrize: string;
  /** The 頭獎 numbers (usually three). Each also seeds 二–六獎 by suffix. */
  firstPrizes: readonly string[];
  /** 增開六獎 additional 3-digit numbers (NT$200 on a last-3 match). */
  additionalSixth?: readonly string[];
  /** ISO date the numbers were drawn / take effect (provenance). */
  drawnOn: string;
  /** Where these numbers came from (provenance). */
  source: string;
}

/** Prize tiers, highest value first. `none` means no prize. */
export type TwPrizeTier =
  | 'special'
  | 'grand'
  | 'first'
  | 'second'
  | 'third'
  | 'fourth'
  | 'fifth'
  | 'sixth'
  | 'additionalSixth'
  | 'none';

/** NT$ payout for each tier. */
export const TW_PRIZE_AMOUNT: Readonly<Record<TwPrizeTier, number>> = {
  special: 10_000_000,
  grand: 2_000_000,
  first: 200_000,
  second: 40_000,
  third: 10_000,
  fourth: 4_000,
  fifth: 1_000,
  sixth: 200,
  additionalSixth: 200,
  none: 0,
};

/** Result of checking one receipt against one drawing. */
export interface TwInvoiceResult {
  tier: TwPrizeTier;
  amountTwd: number;
  /** The winning number that produced the match (for display), if any. */
  matched?: string;
}

/** Strip spaces/dashes and keep digits only. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Normalize a receipt number to its 8-digit body. Taiwan uniform-invoice
 * numbers are `XX-12345678` (a two-letter track prefix + 8 digits); only the
 * 8 digits matter for the draw, so we accept the number with or without the
 * letter prefix and return the trailing 8 digits.
 */
export function normalizeReceiptNumber(raw: string): string | null {
  const digits = digitsOnly(raw);
  if (digits.length < 3) return null;
  // Accept 8 exactly, or a longer string whose last 8 are the number body.
  if (digits.length > 8) return digits.slice(-8);
  return digits.length === 8 ? digits : null;
}

/** True when `receipt`'s last `n` digits equal `winner`'s last `n` digits. */
function suffixMatches(receipt: string, winner: string, n: number): boolean {
  return receipt.slice(-n) === winner.slice(-n);
}

/** Map the length of the longest first-prize suffix match to its tier. */
function firstPrizeTierForMatchLength(len: number): TwPrizeTier {
  switch (len) {
    case 8:
      return 'first';
    case 7:
      return 'second';
    case 6:
      return 'third';
    case 5:
      return 'fourth';
    case 4:
      return 'fifth';
    case 3:
      return 'sixth';
    default:
      return 'none';
  }
}

/**
 * Check a single receipt number against a drawing and return the best prize.
 *
 * @param receiptRaw the receipt number, with or without the 2-letter prefix.
 * @param drawing    the period's winning numbers.
 * @returns the highest-value tier the receipt wins (`none` if it wins nothing),
 *          or `null` if `receiptRaw` is not a valid 8-digit invoice number.
 */
export function checkTwInvoice(
  receiptRaw: string,
  drawing: TwInvoiceDrawing,
): TwInvoiceResult | null {
  const receipt = normalizeReceiptNumber(receiptRaw);
  if (receipt === null) return null;

  const special = digitsOnly(drawing.specialPrize);
  const grand = digitsOnly(drawing.grandPrize);

  // 特別獎 / 特獎 require a full 8-digit match.
  if (special.length === 8 && receipt === special) {
    return { tier: 'special', amountTwd: TW_PRIZE_AMOUNT.special, matched: special };
  }
  if (grand.length === 8 && receipt === grand) {
    return { tier: 'grand', amountTwd: TW_PRIZE_AMOUNT.grand, matched: grand };
  }

  // 頭獎 + 二~六獎: for each first-prize number, find the longest suffix match.
  let best: TwInvoiceResult = { tier: 'none', amountTwd: 0 };
  for (const raw of drawing.firstPrizes) {
    const winner = digitsOnly(raw);
    if (winner.length !== 8) continue;
    for (let n = 8; n >= 3; n -= 1) {
      if (suffixMatches(receipt, winner, n)) {
        const tier = firstPrizeTierForMatchLength(n);
        const amount = TW_PRIZE_AMOUNT[tier];
        if (amount > best.amountTwd) best = { tier, amountTwd: amount, matched: winner };
        break; // longest match for this winner found
      }
    }
  }

  // 增開六獎: last-3 match against an additional number (same NT$200 as 六獎).
  if (best.amountTwd < TW_PRIZE_AMOUNT.additionalSixth) {
    for (const raw of drawing.additionalSixth ?? []) {
      const add = digitsOnly(raw).slice(-3);
      if (add.length === 3 && receipt.slice(-3) === add) {
        best = {
          tier: 'additionalSixth',
          amountTwd: TW_PRIZE_AMOUNT.additionalSixth,
          matched: add,
        };
        break;
      }
    }
  }

  return best;
}
