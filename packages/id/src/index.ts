/**
 * @zii/id — Identity & Address Engine (M7).
 *
 * Multi-market national-ID, business-number, and financial-identifier
 * validators and (TEST/QA-only) generators. Pure, offline, deterministic.
 *
 * IMPORTANT: every generated value is checksum-valid but otherwise arbitrary.
 * Generators exist solely to produce synthetic TEST / QA data and must never be
 * used to represent a real person or entity.
 */

// Common / market-independent.
export {
  luhnValid,
  luhnCheckDigit,
  validateAbaRouting,
  validateIban,
} from './common';

// Taiwan.
export {
  validateTwNationalId,
  generateTwNationalId,
  validateTwUbn,
} from './tw';

// Hong Kong.
export { validateHkid, generateHkid } from './hk';

// Japan.
export {
  validateMyNumber,
  generateMyNumber,
  validateCorporateNumber,
  generateCorporateNumber,
  invoiceRegistrationNumber,
  validateInvoiceNumber,
} from './jp';
