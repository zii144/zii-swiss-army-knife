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
