/**
 * Korea, Germany, France, Canada, Australia identifier validators.
 *
 * Generated values are checksum-valid but otherwise arbitrary — TEST / QA only.
 */

import { luhnCheckDigit, luhnValid, validateIban } from './common';

function digitsOnly(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += ch;
  }
  return out;
}

function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomDigits(n: number, seed: number): string {
  const next = mulberry(seed);
  let out = '';
  for (let i = 0; i < n; i++) out += Math.floor(next() * 10).toString();
  return out;
}

// ---------------------------------------------------------------- Korea BRN ----

const KO_BRN_WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5] as const;

/** Korean business registration number (사업자등록번호): 10 digits, NTS checksum. */
export function validateKoBrn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const prod = (d.charCodeAt(i) - 48) * (KO_BRN_WEIGHTS[i] as number);
    sum += prod;
  }
  // Special: 9th digit (index 8) weight 5 — also add tens digit of that product.
  const ninth = (d.charCodeAt(8) - 48) * 5;
  sum += Math.floor(ninth / 10);
  const check = (10 - (sum % 10)) % 10;
  return check === d.charCodeAt(9) - 48;
}

export function generateKoBrn(seed = 0): string {
  const body = randomDigits(9, seed);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const prod = (body.charCodeAt(i) - 48) * (KO_BRN_WEIGHTS[i] as number);
    sum += prod;
  }
  const ninth = (body.charCodeAt(8) - 48) * 5;
  sum += Math.floor(ninth / 10);
  const check = (10 - (sum % 10)) % 10;
  return body + String(check);
}

// ---------------------------------------------------------------- Korea RRN ----

/**
 * Korean resident registration number (주민등록번호): 13 digits.
 * Format YYYYMMDD-S######C with checksum. Format + checksum only — no identity lookup.
 */
export function validateKoRrn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{13}$/.test(d)) return false;
  const mm = Number(d.slice(2, 4));
  const dd = Number(d.slice(4, 6));
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return false;
  const sex = d.charCodeAt(6) - 48;
  if (sex < 1 || sex > 8) return false;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (d.charCodeAt(i) - 48) * (weights[i] as number);
  const check = (11 - (sum % 11)) % 10;
  return check === d.charCodeAt(12) - 48;
}

export function generateKoRrn(seed = 0): string {
  const next = mulberry(seed);
  const yy = String(Math.floor(next() * 90) + 10).padStart(2, '0');
  const mm = String(1 + Math.floor(next() * 12)).padStart(2, '0');
  const dd = String(1 + Math.floor(next() * 28)).padStart(2, '0');
  const sex = String(1 + Math.floor(next() * 4)); // 1–4 common
  const serial = randomDigits(5, seed ^ 0xabc);
  const body = yy + mm + dd + sex + serial;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (body.charCodeAt(i) - 48) * (weights[i] as number);
  const check = (11 - (sum % 11)) % 10;
  return body + String(check);
}

// ------------------------------------------------------------- Australia ABN ----

const ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19] as const;

/** Australian Business Number: 11 digits, ABR weighted mod-89. */
export function validateAbn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{11}$/.test(d)) return false;
  const adjusted = String(Number(d[0]) - 1) + d.slice(1);
  let sum = 0;
  for (let i = 0; i < 11; i++) sum += (adjusted.charCodeAt(i) - 48) * (ABN_WEIGHTS[i] as number);
  return sum % 89 === 0;
}

export function generateAbn(seed = 0): string {
  let acc = Math.abs(Math.trunc(seed));
  for (let attempt = 0; attempt < 5000; attempt++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    const body = String(acc).padStart(10, '0').slice(-10);
    for (let first = 1; first <= 9; first++) {
      const candidate = String(first) + body;
      if (validateAbn(candidate)) return candidate;
    }
  }
  throw new Error('generateAbn: exhausted');
}

/** Australian BSB: 6 digits (XXX-XXX). */
export function validateBsb(value: string): boolean {
  return /^\d{6}$/.test(digitsOnly(value));
}

export function generateBsb(seed = 0): string {
  return randomDigits(6, seed);
}

// -------------------------------------------------------------- Canada bank ----

/** Canadian transit (5) + institution (3) — format check only. */
export function validateCaTransit(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{8}$/.test(d) || /^\d{5}-\d{3}$/.test(value.trim()) || /^\d{5}\d{3}$/.test(d);
}

export function generateCaTransit(seed = 0): string {
  const t = randomDigits(5, seed);
  const inst = randomDigits(3, seed ^ 0x55);
  return `${t}-${inst}`;
}

/** Canadian postal code: A1A 1A1 (no D/F/I/O/Q/U in letter positions; W/Z not first). */
export function validateCaPostal(value: string): boolean {
  const v = value.trim().toUpperCase().replace(/\s+/g, '');
  return /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\d[ABCEGHJKLMNPRSTVWXYZ]\d$/.test(v);
}

export function generateCaPostal(seed = 0): string {
  const next = mulberry(seed);
  const L1 = 'ABCEGHJKLMNPRSTVXY';
  const L = 'ABCEGHJKLMNPRSTVWXYZ';
  const a = L1[Math.floor(next() * L1.length)]!;
  const b = String(Math.floor(next() * 10));
  const c = L[Math.floor(next() * L.length)]!;
  const d = String(Math.floor(next() * 10));
  const e = L[Math.floor(next() * L.length)]!;
  const f = String(Math.floor(next() * 10));
  return `${a}${b}${c} ${d}${e}${f}`;
}

/** Australian postcode: 4 digits (0200–9999 typical). */
export function validateAuPostcode(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{4}$/.test(d)) return false;
  const n = Number(d);
  return n >= 200 && n <= 9999;
}

export function generateAuPostcode(seed = 0): string {
  const n = 200 + (Math.abs(Math.trunc(seed)) % 9800);
  return String(n).padStart(4, '0');
}

// ----------------------------------------------------------- Germany / France ----

export function validateDePlz(value: string): boolean {
  return /^\d{5}$/.test(digitsOnly(value));
}

export function generateDePlz(seed = 0): string {
  return randomDigits(5, seed === 0 ? 1 : seed).replace(/^0/, '1');
}

/** German tax ID (IdNr): 11 digits, unique digits rules + checksum (simplified). */
export function validateDeTaxId(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{11}$/.test(d)) return false;
  // One digit appears exactly twice; others at most once; first digit ≠ 0.
  if (d[0] === '0') return false;
  const counts = new Array(10).fill(0);
  for (const ch of d.slice(0, 10)) counts[ch.charCodeAt(0) - 48]++;
  const doubles = counts.filter((c) => c === 2).length;
  const triples = counts.some((c) => c > 2);
  if (triples || doubles !== 1) return false;
  // Check digit: ISO 7064 MOD 11,10 approximation used by BZSt.
  let product = 10;
  for (let i = 0; i < 10; i++) {
    let sum = (d.charCodeAt(i) - 48 + product) % 10;
    if (sum === 0) sum = 10;
    product = (sum * 2) % 11;
  }
  const check = (11 - product) % 10;
  return check === d.charCodeAt(10) - 48;
}

export function generateDeTaxId(seed = 0): string {
  let acc = Math.abs(Math.trunc(seed)) + 1;
  for (let attempt = 0; attempt < 8000; attempt++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    const digits = Array.from({ length: 10 }, (_, i) => i);
    // Shuffle and pick with one duplicate.
    for (let i = digits.length - 1; i > 0; i--) {
      acc = (acc * 1103515245 + 12345) & 0x7fffffff;
      const j = acc % (i + 1);
      const tmp = digits[i]!;
      digits[i] = digits[j]!;
      digits[j] = tmp;
    }
    const bodyArr = digits.slice(0, 9);
    const dup = bodyArr[acc % 9]!;
    bodyArr.push(dup);
    if (bodyArr[0] === 0) bodyArr[0] = 1 + (acc % 9);
    const body = bodyArr.join('');
    let product = 10;
    for (let i = 0; i < 10; i++) {
      let sum = (body.charCodeAt(i) - 48 + product) % 10;
      if (sum === 0) sum = 10;
      product = (sum * 2) % 11;
    }
    const check = (11 - product) % 10;
    const candidate = body + String(check);
    if (validateDeTaxId(candidate)) return candidate;
  }
  throw new Error('generateDeTaxId: exhausted');
}

export { validateIban };

/** French SIREN: 9 digits, Luhn. */
export function validateSiren(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{9}$/.test(d) && luhnValid(d);
}

export function generateSiren(seed = 0): string {
  const body = randomDigits(8, seed);
  return body + String(luhnCheckDigit(body));
}

/** French SIRET: 14 digits = SIREN + NIC, Luhn on full. */
export function validateSiret(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{14}$/.test(d) && luhnValid(d);
}

export function generateSiret(seed = 0): string {
  const siren = generateSiren(seed);
  const nic = randomDigits(4, seed ^ 0x111);
  const body = siren + nic.slice(0, 4);
  // Rebuild last digit of NIC to satisfy Luhn on 14 digits.
  const first13 = body.slice(0, 13);
  return first13 + String(luhnCheckDigit(first13));
}

/**
 * French NIR (numéro de sécurité sociale): 15 chars (13 + 2 key).
 * Key = 97 - (number mod 97). Corsica 2A/2B handled as 19/18.
 */
export function validateNir(value: string): boolean {
  const raw = value.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[12]\d{2}(0[1-9]|1[0-2]|20)\d{2}(2A|2B|\d{2})\d{3}\d{3}\d{2}$/.test(raw)) {
    // Simpler: 15 alnum with 2A/2B
    if (!/^[12][0-9]{2}(0[1-9]|1[0-2])[0-9]{2}([0-9]{2}|2A|2B)[0-9]{6}[0-9]{2}$/.test(raw)) {
      return false;
    }
  }
  const body = raw.slice(0, 13).replace('2A', '19').replace('2B', '18');
  if (!/^\d{13}$/.test(body)) return false;
  const key = Number(raw.slice(13));
  const expected = 97 - (Number(BigInt(body) % 97n));
  return key === expected;
}

export function generateNir(seed = 0): string {
  const next = mulberry(seed);
  const sex = next() < 0.5 ? '1' : '2';
  const yy = String(Math.floor(next() * 90) + 10).padStart(2, '0');
  const mm = String(1 + Math.floor(next() * 12)).padStart(2, '0');
  const dept = String(1 + Math.floor(next() * 95)).padStart(2, '0');
  const commune = randomDigits(3, seed ^ 1);
  const order = randomDigits(3, seed ^ 2);
  const body = sex + yy + mm + dept + commune + order;
  const key = String(97 - Number(BigInt(body) % 97n)).padStart(2, '0');
  return body + key;
}

export function validateFrPostal(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{5}$/.test(d) && d !== '00000';
}

export function generateFrPostal(seed = 0): string {
  return randomDigits(5, seed === 0 ? 75 : seed).replace(/^0{5}$/, '75001');
}

/** Korea postal: 5 digits (since 2015). */
export function validateKoPostal(value: string): boolean {
  return /^\d{5}$/.test(digitsOnly(value));
}

export function generateKoPostal(seed = 0): string {
  return randomDigits(5, seed === 0 ? 6 : seed);
}

/** Korea mobile: 010/011/016/017/018/019 + 7–8 digits. */
export function validateKoPhone(value: string): boolean {
  const d = digitsOnly(value);
  return /^01[016789]\d{7,8}$/.test(d);
}

export function generateKoPhone(seed = 0): string {
  return '010' + randomDigits(8, seed);
}

/** Build FR IBAN from RIB (bank 5 + branch 5 + account 11 + key 2). */
export function ribToIban(bank: string, branch: string, account: string, key: string): string | null {
  const b = digitsOnly(bank);
  const g = digitsOnly(branch);
  const a = account.replace(/\s+/g, '').toUpperCase();
  const k = digitsOnly(key);
  if (!/^\d{5}$/.test(b) || !/^\d{5}$/.test(g) || !/^\d{2}$/.test(k)) return null;
  if (!/^[A-Z0-9]{11}$/.test(a)) return null;
  const bban = b + g + a + k;
  const iban = 'FR76' + bban; // check digits recomputed
  // Recalculate check digits
  const rearranged = bban + 'FR00';
  let expanded = '';
  for (const ch of rearranged) {
    if (ch >= 'A' && ch <= 'Z') expanded += String(ch.charCodeAt(0) - 55);
    else expanded += ch;
  }
  const mod = Number(BigInt(expanded) % 97n);
  const check = String(98 - mod).padStart(2, '0');
  const result = 'FR' + check + bban;
  return validateIban(result) ? result : result;
}
