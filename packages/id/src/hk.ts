/**
 * Hong Kong (HK) identity-card number (HKID).
 *
 * NOTE: generated values are checksum-valid but otherwise arbitrary, intended
 * strictly for TEST / QA data — never for representing a real person.
 */

const HKID_RE = /^([A-Z]{1,2})(\d{6})\(?([0-9A])\)?$/;

/** Letter -> numeric value: A=10 .. Z=35. */
function hkLetterValue(ch: string): number | null {
  if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 55;
  return null;
}

/**
 * Compute the weighted mod-11 sum for the eight leading characters of an HKID.
 * `letters` is one or two uppercase letters; `digits` the six body digits.
 * A single-letter prefix is left-padded with a space whose value is 36.
 */
function hkidBaseSum(letters: string, digits: string): number | null {
  const values: number[] = [];
  if (letters.length === 1) {
    values.push(36); // leading space
    const v = hkLetterValue(letters);
    if (v === null) return null;
    values.push(v);
  } else if (letters.length === 2) {
    const a = letters[0];
    const b = letters[1];
    if (a === undefined || b === undefined) return null;
    const va = hkLetterValue(a);
    const vb = hkLetterValue(b);
    if (va === null || vb === null) return null;
    values.push(va, vb);
  } else {
    return null;
  }
  for (const ch of digits) values.push(ch.charCodeAt(0) - 48);
  // values now has exactly 8 entries, weights 9..2.
  if (values.length !== 8) return null;
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const v = values[i];
    if (v === undefined) return null;
    sum += v * (9 - i);
  }
  return sum;
}

/**
 * Validate a Hong Kong identity-card number.
 * Accepts the check digit with or without surrounding parentheses.
 * Check digit is 0-9, or 'A' meaning 10.
 */
export function validateHkid(id: string): boolean {
  const m = HKID_RE.exec(id.trim().toUpperCase());
  if (m === null) return false;
  const letters = m[1];
  const digits = m[2];
  const checkRaw = m[3];
  if (letters === undefined || digits === undefined || checkRaw === undefined) return false;
  const base = hkidBaseSum(letters, digits);
  if (base === null) return false;
  const check = checkRaw === 'A' ? 10 : checkRaw.charCodeAt(0) - 48;
  return (base + check) % 11 === 0;
}

/**
 * Generate a checksum-valid HKID for TEST / QA use only.
 * Deterministic for a given seed. Returns the check digit in parentheses.
 */
export function generateHkid(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  // One leading letter and six body digits derived deterministically.
  const letter = String.fromCharCode(65 + (s % 26));
  const digits: number[] = [];
  let acc = s + 1;
  for (let i = 0; i < 6; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    digits.push(acc % 10);
  }
  const digitsStr = digits.join('');
  const base = hkidBaseSum(letter, digitsStr);
  if (base === null) throw new Error('failed to compute HKID base sum');
  const remainder = base % 11;
  const checkValue = (11 - remainder) % 11; // 0..10
  const checkChar = checkValue === 10 ? 'A' : String(checkValue);
  return `${letter}${digitsStr}(${checkChar})`;
}

const HK_BR_WEIGHTS = [2, 9, 8, 7, 4, 3, 2] as const;

/**
 * Validate a Hong Kong Business Registration Number (商業登記號碼, 8 digits).
 * The 8th digit is a weighted mod-10 check digit over the first seven digits.
 */
export function validateHkBr(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (!/^\d{8}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const ch = digits[i];
    const w = HK_BR_WEIGHTS[i];
    if (ch === undefined || w === undefined) return false;
    sum += (ch.charCodeAt(0) - 48) * w;
  }
  const remainder = sum % 10;
  const expected = remainder === 0 ? 0 : 10 - remainder;
  const check = digits[7];
  if (check === undefined) return false;
  return check.charCodeAt(0) - 48 === expected;
}

/** Generate a checksum-valid HK BRN for TEST / QA use only. */
export function generateHkBr(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  let acc = s;
  const body: number[] = [];
  for (let i = 0; i < 7; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    body.push(acc % 10);
  }
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = body[i];
    const w = HK_BR_WEIGHTS[i];
    if (d === undefined || w === undefined) throw new Error('index out of range');
    sum += d * w;
  }
  const remainder = sum % 10;
  const check = remainder === 0 ? 0 : 10 - remainder;
  return body.join('') + String(check);
}
