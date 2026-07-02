/**
 * regionkit — pure, offline validators & (test/QA-only) sample generators for
 * common regional formats not covered by the @zii/id engine: US SSN / ZIP /
 * ABA routing, Japanese postal codes, and Hong Kong / Taiwan phone numbers.
 *
 * Every generator returns a format-valid but otherwise arbitrary value, for
 * synthetic test data only — never a real person's or entity's identifier.
 */

/** Strip everything except ASCII digits. */
function digits(s: string): string {
  return s.replace(/\D+/g, '');
}

/** Tiny deterministic PRNG (mulberry32) so `generate(seed)` is reproducible. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Produce `n` random decimal digits from a seed. */
function randomDigits(n: number, seed: number): string {
  const next = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) out += Math.floor(next() * 10).toString();
  return out;
}

// ---------------------------------------------------------------- US ZIP ----

/** US ZIP: five digits, optionally +four (ZIP+4). */
export function validateUsZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

export function generateUsZip(seed: number): string {
  return randomDigits(5, seed);
}

// ---------------------------------------------------------------- US SSN ----

/**
 * US Social Security Number. Nine digits as `AAA-GG-SSSS` (hyphens optional).
 * Structurally invalid: area 000 / 666 / 900–999, group 00, or serial 0000.
 */
export function validateUsSsn(value: string): boolean {
  const d = digits(value);
  if (!/^\d{9}$/.test(d)) return false;
  const area = Number(d.slice(0, 3));
  const group = Number(d.slice(3, 5));
  const serial = Number(d.slice(5));
  if (area === 0 || area === 666 || area >= 900) return false;
  if (group === 0) return false;
  if (serial === 0) return false;
  return true;
}

export function generateUsSsn(seed: number): string {
  const next = rng(seed);
  const area = 1 + Math.floor(next() * 665); // 1..665, skips 666 and 900+
  const group = 1 + Math.floor(next() * 99); // 01..99
  const serial = 1 + Math.floor(next() * 9999); // 0001..9999
  const a = String(area).padStart(3, '0');
  const g = String(group).padStart(2, '0');
  const s = String(serial).padStart(4, '0');
  return `${a}-${g}-${s}`;
}

// ------------------------------------------------------------ US routing ----

const ABA_WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7, 1];

/** US ABA routing transit number: nine digits, weighted mod-10 checksum. */
export function validateUsRouting(value: string): boolean {
  const d = digits(value);
  if (!/^\d{9}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (d.charCodeAt(i) - 48) * (ABA_WEIGHTS[i] as number);
  return sum % 10 === 0;
}

export function generateUsRouting(seed: number): string {
  const first8 = randomDigits(8, seed);
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += (first8.charCodeAt(i) - 48) * (ABA_WEIGHTS[i] as number);
  // Weight of the 9th digit is 1, so pick it to make the total a multiple of 10.
  const check = (10 - (sum % 10)) % 10;
  return first8 + String(check);
}

// -------------------------------------------------------------- JP postal ----

/** Japanese postal code: seven digits as `NNN-NNNN` (hyphen optional). */
export function validateJpPostal(value: string): boolean {
  return /^\d{3}-?\d{4}$/.test(value.trim());
}

export function generateJpPostal(seed: number): string {
  const d = randomDigits(7, seed);
  return `${d.slice(0, 3)}-${d.slice(3)}`;
}

// --------------------------------------------------------------- HK phone ----

/**
 * Hong Kong phone number: eight digits. The leading digit indicates the type
 * (2/3 fixed line, 5/6/9 mobile, 7 pager, 8 special) — 0, 1 and 4 are unused.
 */
export function validateHkPhone(value: string): boolean {
  const d = digits(value);
  return /^[235679]\d{7}$/.test(d) || /^8\d{7}$/.test(d);
}

export function generateHkPhone(seed: number): string {
  const next = rng(seed);
  const leads = '235679';
  const lead = leads[Math.floor(next() * leads.length)] as string;
  return lead + randomDigits(7, seed ^ 0x9e3779b9);
}

// ------------------------------------------------------------- TW mobile ----

/** Taiwan mobile number: ten digits beginning `09` (e.g. 0912345678). */
export function validateTwMobile(value: string): boolean {
  const d = digits(value);
  return /^09\d{8}$/.test(d);
}

export function generateTwMobile(seed: number): string {
  return '09' + randomDigits(8, seed);
}

// ---------------------------------------------------------------- US EIN ----

/** IRS campus prefixes that appear as the first two digits of a valid EIN. */
const EIN_PREFIXES = [
  '01', '02', '03', '04', '05', '06', '10', '11', '12', '13', '14', '15', '16',
  '20', '21', '22', '23', '24', '25', '26', '27', '30', '31', '32', '33', '34',
  '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
  '48', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61',
  '62', '63', '64', '65', '66', '67', '68', '71', '72', '73', '74', '75', '76',
  '77', '80', '81', '82', '83', '84', '85', '86', '87', '88', '90', '91', '92',
  '93', '94', '95', '98', '99',
];

/** US Employer Identification Number: `XX-XXXXXXX` with a valid IRS prefix. */
export function validateUsEin(value: string): boolean {
  const d = digits(value);
  if (!/^\d{9}$/.test(d)) return false;
  return EIN_PREFIXES.includes(d.slice(0, 2));
}

export function generateUsEin(seed: number): string {
  const next = rng(seed);
  const prefix = EIN_PREFIXES[Math.floor(next() * EIN_PREFIXES.length)] as string;
  return `${prefix}-${randomDigits(7, seed ^ 0x51ed270b)}`;
}

// -------------------------------------------------------------- US phone ----

/**
 * North American (NANP) phone number: ten digits where the area code and the
 * exchange code each start 2–9 (`NXX-NXX-XXXX`).
 */
export function validateUsPhone(value: string): boolean {
  const d = digits(value);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d);
}

export function generateUsPhone(seed: number): string {
  const next = rng(seed);
  const nxx = () => String(2 + Math.floor(next() * 8));
  const area = nxx() + randomDigits(2, seed);
  const exch = nxx() + randomDigits(2, seed ^ 0x2545f491);
  const sub = randomDigits(4, seed ^ 0x1b56c4e9);
  return `(${area}) ${exch}-${sub}`;
}

// ------------------------------------------------------------ UK postcode ----

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

/** UK postcode (e.g. `SW1A 1AA`, `M1 1AA`, `B33 8TH`). */
export function validateUkPostcode(value: string): boolean {
  return UK_POSTCODE.test(value.trim());
}

export function generateUkPostcode(seed: number): string {
  const next = rng(seed);
  const A = 'ABCDEFGHJKLMNOPRSTUWXYZ';
  const letter = () => A[Math.floor(next() * A.length)] as string;
  const digit = () => String(Math.floor(next() * 10));
  return `${letter()}${digit()} ${digit()}${letter()}${letter()}`;
}

// ------------------------------------------------------------------ UK NI ----

const NI_DISALLOWED_PREFIX = new Set(['BG', 'GB', 'NK', 'KN', 'NT', 'TN', 'ZZ']);
const NI_FIRST = 'ABCEGHJKLMNOPRSTWXYZ'; // excludes D, F, I, Q, U, V
const NI_SECOND = 'ABCEGHJKLMNPRSTWXYZ'; // excludes D, F, I, O, Q, U, V

/** UK National Insurance number: two prefix letters, six digits, suffix A–D. */
export function validateUkNino(value: string): boolean {
  const s = value.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{6}[A-D]$/.test(s)) return false;
  const prefix = s.slice(0, 2);
  if (NI_DISALLOWED_PREFIX.has(prefix)) return false;
  if (!NI_FIRST.includes(prefix[0] as string)) return false;
  if (!NI_SECOND.includes(prefix[1] as string)) return false;
  return true;
}

export function generateUkNino(seed: number): string {
  const next = rng(seed);
  let prefix = '';
  do {
    prefix = `${NI_FIRST[Math.floor(next() * NI_FIRST.length)]}${NI_SECOND[Math.floor(next() * NI_SECOND.length)]}`;
  } while (NI_DISALLOWED_PREFIX.has(prefix));
  const suffix = 'ABCD'[Math.floor(next() * 4)] as string;
  return `${prefix} ${randomDigits(6, seed ^ 0x27d4eb2f).replace(/(\d{2})(\d{2})(\d{2})/, '$1 $2 $3')} ${suffix}`;
}

// ------------------------------------------------------------ UK sort code ----

/** UK bank sort code: six digits, usually written `XX-XX-XX`. */
export function validateUkSortCode(value: string): boolean {
  return /^\d{2}-?\d{2}-?\d{2}$/.test(value.trim());
}

export function generateUkSortCode(seed: number): string {
  const d = randomDigits(6, seed);
  return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
}

// ------------------------------------------------------------- TW postal ----

/** Taiwan postal code: three digits, or the newer 3+2 / 3+3 format. */
export function validateTwPostal(value: string): boolean {
  return /^\d{3}(-?\d{2,3})?$/.test(value.trim());
}

export function generateTwPostal(seed: number): string {
  const d = randomDigits(6, seed);
  return `${d.slice(0, 3)}${d.slice(3)}`;
}
