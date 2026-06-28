/**
 * Common, market-independent identifier checks.
 *
 * NOTE: any generated value is checksum-valid but otherwise arbitrary and is
 * intended strictly for TEST / QA data — never for representing a real person
 * or entity.
 */

/** Strip everything that is not an ASCII digit. */
function digitsOnly(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += ch;
  }
  return out;
}

/**
 * Validate a number string using the Luhn (mod-10) algorithm.
 * Non-digit characters are ignored. An empty digit sequence is invalid.
 */
export function luhnValid(num: string): boolean {
  const digits = digitsOnly(num);
  if (digits.length === 0) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    const ch = digits[i];
    if (ch === undefined) return false;
    let d = ch.charCodeAt(0) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * Compute the Luhn check digit (0-9) that should be appended to `numWithout`
 * so that the resulting string passes {@link luhnValid}.
 */
export function luhnCheckDigit(numWithout: string): number {
  const digits = digitsOnly(numWithout);
  let sum = 0;
  // The appended check digit sits at the least-significant position, so the
  // existing right-most digit will be doubled.
  let double = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    const ch = digits[i];
    if (ch === undefined) continue;
    let d = ch.charCodeAt(0) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate a US ABA routing transit number.
 * Nine digits, weighted mod-10 with weights [3,7,1,3,7,1,3,7,1].
 */
export function validateAbaRouting(n: string): boolean {
  const digits = digitsOnly(n);
  if (!/^\d{9}$/.test(digits)) return false;
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const ch = digits[i];
    const w = weights[i];
    if (ch === undefined || w === undefined) return false;
    sum += (ch.charCodeAt(0) - 48) * w;
  }
  return sum % 10 === 0;
}

/**
 * Convert a letter A-Z to its IBAN numeric value (A=10 .. Z=35) or a digit to
 * its own value. Returns null for unexpected characters.
 */
function ibanCharValue(ch: string): number | null {
  if (ch >= '0' && ch <= '9') return ch.charCodeAt(0) - 48;
  if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 55; // 'A' (65) -> 10
  return null;
}

/**
 * Validate an IBAN using the ISO 13616 / ISO 7064 MOD-97-10 algorithm.
 * Spaces are ignored; the value is upper-cased. Returns true when the
 * rearranged, alpha-expanded number is congruent to 1 modulo 97.
 */
export function validateIban(s: string): boolean {
  const cleaned = s.replace(/\s+/g, '').toUpperCase();
  // 2 country letters, 2 check digits, then up to 30 alphanumerics.
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleaned)) return false;
  // Move the first four characters to the end.
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  // Expand letters to numbers and reduce mod 97 in chunks to avoid bigint.
  let remainder = 0;
  for (const ch of rearranged) {
    const value = ibanCharValue(ch);
    if (value === null) return false;
    // A letter expands to a two-digit number; a digit to one.
    remainder = value > 9 ? (remainder * 100 + value) % 97 : (remainder * 10 + value) % 97;
  }
  return remainder === 1;
}
