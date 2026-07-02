/**
 * Taiwan (TW) identity / business identifiers.
 *
 * NOTE: generated values are checksum-valid but otherwise arbitrary, intended
 * strictly for TEST / QA data — never for representing a real person or entity.
 */

/**
 * Official Taiwan letter -> two-digit area code used by the National ID
 * checksum. This is NOT a plain A=10..Z=35 sequence: I, O, and W..Z are
 * remapped per the Ministry of the Interior specification.
 */
const TW_LETTER_CODE: Readonly<Record<string, number>> = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 34,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  O: 35,
  P: 23,
  Q: 24,
  R: 25,
  S: 26,
  T: 27,
  U: 28,
  V: 29,
  W: 32,
  X: 30,
  Y: 31,
  Z: 33,
};

const TW_ID_RE = /^[A-Z][12]\d{8}$/;
const TW_ARC_RE = /^[A-Z][89]\d{8}$/;

/** Letters no longer assigned on new-format ARC numbers (Immigration Bureau). */
const TW_ARC_STOP_LETTERS = new Set(['L', 'R', 'S', 'Y']);

/** Compute the weighted sum for a 10-char TW id (letter + 9 digits), or null. */
function twTenCharIdSum(id: string): number | null {
  if (!/^[A-Z]\d{9}$/.test(id)) return null;
  const letter = id[0];
  if (letter === undefined) return null;
  const code = TW_LETTER_CODE[letter];
  if (code === undefined) return null;
  const firstCodeDigit = Math.floor(code / 10);
  const secondCodeDigit = code % 10;
  // The nine numeric characters following the letter.
  const digits: number[] = [];
  for (let i = 1; i < id.length; i++) {
    const ch = id[i];
    if (ch === undefined) return null;
    digits.push(ch.charCodeAt(0) - 48);
  }
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  let sum = firstCodeDigit * 1 + secondCodeDigit * 9;
  for (let i = 0; i < 8; i++) {
    const d = digits[i];
    const w = weights[i];
    if (d === undefined || w === undefined) return null;
    sum += d * w;
  }
  const check = digits[8];
  if (check === undefined) return null;
  sum += check * 1;
  return sum;
}

/**
 * Validate a Taiwan National ID (中華民國身分證字號).
 * Format: one uppercase letter, a gender digit (1 or 2), eight more digits;
 * letter is expanded to its two-digit area code and the weighted sum must be
 * a multiple of 10.
 */
function twNationalIdSum(id: string): number | null {
  if (!TW_ID_RE.test(id)) return null;
  return twTenCharIdSum(id);
}

export function validateTwNationalId(id: string): boolean {
  const trimmed = id.trim();
  if (!/^[A-Za-z][12]\d{8}$/.test(trimmed) || trimmed !== trimmed.toUpperCase()) return false;
  const sum = twNationalIdSum(trimmed);
  return sum !== null && sum % 10 === 0;
}

/**
 * Validate a Taiwan Alien Resident Certificate (外來人口統一證號, new format).
 * Same checksum as the National ID; gender digit is 8 (male) or 9 (female).
 */
export function validateTwArc(id: string): boolean {
  const trimmed = id.trim();
  if (!/^[A-Za-z][89]\d{8}$/.test(trimmed) || trimmed !== trimmed.toUpperCase()) return false;
  const normalized = trimmed.toUpperCase();
  const letter = normalized[0];
  if (letter !== undefined && TW_ARC_STOP_LETTERS.has(letter)) return false;
  const sum = twTenCharIdSum(normalized);
  return sum !== null && sum % 10 === 0;
}

/**
 * Generate a checksum-valid Taiwan National ID for TEST / QA use only.
 * Deterministic for a given seed.
 */
export function generateTwNationalId(seed = 0): string {
  const letters = Object.keys(TW_LETTER_CODE);
  // Pick a stable letter and the eight free digits from the seed.
  const s = Math.abs(Math.trunc(seed));
  const letter = letters[s % letters.length];
  if (letter === undefined) throw new Error('letter table empty');
  const code = TW_LETTER_CODE[letter];
  if (code === undefined) throw new Error('letter code missing');
  const firstCodeDigit = Math.floor(code / 10);
  const secondCodeDigit = code % 10;
  const gender = (s % 2) + 1; // 1 or 2
  // Seven free digits after the gender digit.
  const free: number[] = [];
  let acc = s;
  for (let i = 0; i < 7; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    free.push(acc % 10);
  }
  const body = [gender, ...free]; // digits[0..7]
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  let sum = firstCodeDigit * 1 + secondCodeDigit * 9;
  for (let i = 0; i < 8; i++) {
    const d = body[i];
    const w = weights[i];
    if (d === undefined || w === undefined) throw new Error('index out of range');
    sum += d * w;
  }
  const check = (10 - (sum % 10)) % 10;
  return letter + body.join('') + String(check);
}

/**
 * Generate a checksum-valid Taiwan ARC (new format) for TEST / QA use only.
 * Deterministic for a given seed.
 */
export function generateTwArc(seed = 0): string {
  const letters = Object.keys(TW_LETTER_CODE).filter((l) => !TW_ARC_STOP_LETTERS.has(l));
  const s = Math.abs(Math.trunc(seed));
  const letter = letters[s % letters.length];
  if (letter === undefined) throw new Error('letter table empty');
  const code = TW_LETTER_CODE[letter];
  if (code === undefined) throw new Error('letter code missing');
  const firstCodeDigit = Math.floor(code / 10);
  const secondCodeDigit = code % 10;
  const gender = (s % 2) + 8; // 8 or 9
  const free: number[] = [];
  let acc = s;
  for (let i = 0; i < 7; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    free.push(acc % 10);
  }
  const body = [gender, ...free];
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  let sum = firstCodeDigit * 1 + secondCodeDigit * 9;
  for (let i = 0; i < 8; i++) {
    const d = body[i];
    const w = weights[i];
    if (d === undefined || w === undefined) throw new Error('index out of range');
    sum += d * w;
  }
  const check = (10 - (sum % 10)) % 10;
  return letter + body.join('') + String(check);
}

/**
 * Validate a Taiwan business Uniform Business Number (統一編號, 8 digits).
 *
 * Each digit is multiplied by weights [1,2,1,2,1,2,4,1]; the digits of every
 * product are summed, then all summed together. The number is valid when the
 * total is a multiple of 10. Special case: when the 7th digit (index 6) is 7,
 * the number is also valid if adding 1 to the total makes it a multiple of 10
 * (because the weight-4 product can absorb the carry).
 */
export function validateTwUbn(ubn: string): boolean {
  if (!/^\d{8}$/.test(ubn)) return false;
  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  let total = 0;
  for (let i = 0; i < 8; i++) {
    const ch = ubn[i];
    const w = weights[i];
    if (ch === undefined || w === undefined) return false;
    const product = (ch.charCodeAt(0) - 48) * w;
    // Sum the digits of the (at most two-digit) product.
    total += Math.floor(product / 10) + (product % 10);
  }
  if (total % 10 === 0) return true;
  // Official exception for the seventh digit being 7.
  const seventh = ubn[6];
  if (seventh === '7' && (total + 1) % 10 === 0) return true;
  return false;
}
