import type { TwInvoiceDrawing } from './tw-invoice';

/**
 * Bundled winning-number table for the Taiwan Uniform-Invoice Lottery.
 *
 * ⚠️ Deliberately empty. Winning numbers are official government data that
 * change every two months; shipping stale or unverified numbers would violate
 * the project's data-trust guardrail ("wrong numbers destroy trust faster than
 * a missing feature"). The tool therefore lets the user enter the current
 * period's numbers from the official source, and this table is the seam where a
 * maintainer can add *verified, dated* periods over time.
 *
 * ── Update process ──────────────────────────────────────────────────────────
 * 1. Open the official source: https://invoice.etax.nat.gov.tw/ (財政部電子發票).
 * 2. Copy the period's 特別獎 / 特獎 / 三組頭獎 / 增開六獎 numbers exactly.
 * 3. Append an entry below with `drawnOn` (ISO date) and the `source` URL.
 * 4. Add a unit test asserting a known winning receipt for that period.
 *
 * Newest period first.
 */
export const TW_INVOICE_DRAWINGS: readonly TwInvoiceDrawing[] = [];
