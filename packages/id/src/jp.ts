/**
 * Japan (JP) identity / business identifiers.
 *
 * NOTE: generated values are checksum-valid but otherwise arbitrary, intended
 * strictly for TEST / QA data — never for representing a real person or entity.
 */

/**
 * Compute the My Number (個人番号) check digit for an 11-digit base.
 *
 * Per the official algorithm, position n is counted from the least-significant
 * digit of the 11-digit base (n = 1..11). The weight is:
 *   P_n = n + 1   for n in 1..6
 *   P_n = n - 5   for n in 7..11
 * remainder = (sum of digit_n * P_n) mod 11
 * check = remainder <= 1 ? 0 : 11 - remainder
 */
function myNumberCheckDigit(base11: string): number | null {
  if (!/^\d{11}$/.test(base11)) return null;
  let sum = 0;
  // base11[10] is the least significant digit -> n = 1.
  for (let n = 1; n <= 11; n++) {
    const ch = base11[11 - n];
    if (ch === undefined) return null;
    const digit = ch.charCodeAt(0) - 48;
    const weight = n <= 6 ? n + 1 : n - 5;
    sum += digit * weight;
  }
  const remainder = sum % 11;
  return remainder <= 1 ? 0 : 11 - remainder;
}

/** Validate a 12-digit Japanese Individual Number (My Number). */
export function validateMyNumber(n: string): boolean {
  if (!/^\d{12}$/.test(n)) return false;
  const base = n.slice(0, 11);
  const checkChar = n[11];
  if (checkChar === undefined) return false;
  const expected = myNumberCheckDigit(base);
  if (expected === null) return false;
  return expected === checkChar.charCodeAt(0) - 48;
}

/**
 * Generate a checksum-valid 12-digit My Number for TEST / QA use only.
 * Deterministic for a given seed.
 */
export function generateMyNumber(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  const digits: number[] = [];
  let acc = s + 1;
  for (let i = 0; i < 11; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    digits.push(acc % 10);
  }
  const base = digits.join('');
  const check = myNumberCheckDigit(base);
  if (check === null) throw new Error('failed to compute My Number check digit');
  return base + String(check);
}

/**
 * Compute the Corporate Number (法人番号) leading check digit for a 12-digit
 * base.
 *
 * check = 9 - ( sum(Pn * Qn) mod 9 )
 * where Pn is the n-th digit counted from the least-significant digit of the
 * 12-digit base (n = 1..12) and Qn = 1 for odd n, 2 for even n.
 */
function corporateCheckDigit(base12: string): number | null {
  if (!/^\d{12}$/.test(base12)) return null;
  let sum = 0;
  for (let n = 1; n <= 12; n++) {
    const ch = base12[12 - n];
    if (ch === undefined) return null;
    const digit = ch.charCodeAt(0) - 48;
    const q = n % 2 === 1 ? 1 : 2;
    sum += digit * q;
  }
  return 9 - (sum % 9);
}

/**
 * Validate a 13-digit Japanese Corporate Number (法人番号).
 * Layout: a leading check digit followed by a 12-digit base.
 */
export function validateCorporateNumber(n: string): boolean {
  if (!/^\d{13}$/.test(n)) return false;
  const checkChar = n[0];
  const base = n.slice(1);
  if (checkChar === undefined) return false;
  const expected = corporateCheckDigit(base);
  if (expected === null) return false;
  return expected === checkChar.charCodeAt(0) - 48;
}

/**
 * Generate a checksum-valid 13-digit Corporate Number for TEST / QA use only.
 * Deterministic for a given seed.
 */
export function generateCorporateNumber(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  const digits: number[] = [];
  let acc = s + 7;
  for (let i = 0; i < 12; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    digits.push(acc % 10);
  }
  const base = digits.join('');
  const check = corporateCheckDigit(base);
  if (check === null) throw new Error('failed to compute Corporate Number check digit');
  return String(check) + base;
}

/**
 * Build a Japanese qualified-invoice registration number from a 13-digit
 * Corporate Number: simply prefix the number with 'T'.
 */
export function invoiceRegistrationNumber(corp: string): string {
  return 'T' + corp;
}

/**
 * Validate a Japanese qualified-invoice registration number.
 * Format: 'T' followed by a valid 13-digit Corporate Number.
 */
export function validateInvoiceNumber(s: string): boolean {
  if (s.length !== 14 || s[0] !== 'T') return false;
  return validateCorporateNumber(s.slice(1));
}
