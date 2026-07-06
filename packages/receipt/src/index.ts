/**
 * @zii/receipt — Receipt & invoice utilities.
 *
 * Pure, offline, deterministic. Currently hosts the Taiwan Uniform-Invoice
 * Lottery (統一發票對獎) prize-matching engine. Per-period winning numbers are
 * treated as dated, sourced data — never fabricated (see `tw-drawings.ts`).
 */
export {
  checkTwInvoice,
  normalizeReceiptNumber,
  TW_PRIZE_AMOUNT,
} from './tw-invoice';
export type { TwInvoiceDrawing, TwInvoiceResult, TwPrizeTier } from './tw-invoice';
export { TW_INVOICE_DRAWINGS } from './tw-drawings';
