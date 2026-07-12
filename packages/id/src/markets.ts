/**
 * Multi-market identifier validators / generators (KO / CA / AU / DE / FR).
 *
 * Generated values are checksum-valid but otherwise arbitrary — TEST / QA only.
 */

import { luhnCheckDigit, luhnValid, validateIban } from './common';

export { validateIban };

/** Strip everything except ASCII digits. */
function digitsOnly(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += ch;
  }
  return out;
}

function lcg(seed: number): () => number {
  let acc = Math.abs(Math.trunc(seed));
  return () => {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    return acc;
  };
}

function randomDigits(next: () => number, n: number): string {
  let out = '';
  for (let i = 0; i < n; i++) out += String(next() % 10);
  return out;
}

// --- Korea BRN (사업자등록번호) ------------------------------------------------

const KO_BRN_WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5] as const;

/** 10-digit Korean business registration number (NTS checksum). */
export function validateKoBrn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const product = (d.charCodeAt(i) - 48) * KO_BRN_WEIGHTS[i]!;
    sum += product;
    if (i === 8) sum += Math.floor(product / 10);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === d.charCodeAt(9) - 48;
}

/** Generate a checksum-valid Korean BRN for TEST / QA use only. */
export function generateKoBrn(seed = 0): string {
  const next = lcg(seed);
  for (let attempt = 0; attempt < 1000; attempt++) {
    const body = randomDigits(next, 9);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const product = (body.charCodeAt(i) - 48) * KO_BRN_WEIGHTS[i]!;
      sum += product;
      if (i === 8) sum += Math.floor(product / 10);
    }
    const check = (10 - (sum % 10)) % 10;
    const full = body + String(check);
    if (validateKoBrn(full)) return full;
  }
  throw new Error('generateKoBrn: could not find a valid number');
}

// --- Korea RRN (주민등록번호) -------------------------------------------------

const KO_RRN_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5] as const;

/** 13-digit Korean resident registration number (format/checksum only). */
export function validateKoRrn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{13}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (d.charCodeAt(i) - 48) * KO_RRN_WEIGHTS[i]!;
  }
  const check = (11 - (sum % 11)) % 10;
  return check === d.charCodeAt(12) - 48;
}

/** Generate a checksum-valid Korean RRN for TEST / QA use only. */
export function generateKoRrn(seed = 0): string {
  const next = lcg(seed);
  const body = randomDigits(next, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (body.charCodeAt(i) - 48) * KO_RRN_WEIGHTS[i]!;
  }
  const check = (11 - (sum % 11)) % 10;
  return body + String(check);
}

// --- Australia ABN -----------------------------------------------------------

const ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19] as const;

/** 11-digit Australian Business Number (ABR mod-89). */
export function validateAbn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{11}$/.test(d)) return false;
  const adjusted = String(Number(d[0]) - 1) + d.slice(1);
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += (adjusted.charCodeAt(i) - 48) * ABN_WEIGHTS[i]!;
  }
  return sum % 89 === 0;
}

/** Generate a checksum-valid ABN for TEST / QA use only. */
export function generateAbn(seed = 0): string {
  const next = lcg(seed);
  for (let attempt = 0; attempt < 5000; attempt++) {
    const body = randomDigits(next, 10);
    for (let first = 1; first <= 9; first++) {
      const candidate = String(first) + body;
      if (validateAbn(candidate)) return candidate;
    }
  }
  throw new Error('generateAbn: could not find a valid number');
}

// --- Australia BSB -----------------------------------------------------------

/** 6-digit Australian Bank State Branch number. */
export function validateBsb(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{6}$/.test(d);
}

/** Generate a 6-digit BSB for TEST / QA use only. */
export function generateBsb(seed = 0): string {
  return randomDigits(lcg(seed), 6);
}

// --- Canada transit ----------------------------------------------------------

/**
 * Canadian bank transit + institution: 5-digit transit and 3-digit institution
 * (optionally separated by a hyphen), e.g. 12345-001.
 */
export function validateCaTransit(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '');
  const m = /^(\d{5})-?(\d{3})$/.exec(cleaned);
  if (!m) return false;
  const inst = m[2]!;
  // Institution 000 is unused; otherwise accept any 3-digit code.
  return inst !== '000';
}

/** Generate a sample CA transit+institution for TEST / QA use only. */
export function generateCaTransit(seed = 0): string {
  const next = lcg(seed);
  const transit = String(10000 + (next() % 90000));
  const inst = String(1 + (next() % 999)).padStart(3, '0');
  return `${transit}-${inst}`;
}

// --- Canada postal -----------------------------------------------------------

const CA_POSTAL_RE =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

/** Canadian postal code (A1A 1A1). */
export function validateCaPostal(value: string): boolean {
  return CA_POSTAL_RE.test(value.trim());
}

/** Generate a sample Canadian postal code for TEST / QA use only. */
export function generateCaPostal(seed = 0): string {
  const next = lcg(seed);
  const letters = 'ABCEGHJKLMNPRSTVXY';
  const letters2 = 'ABCEGHJKLMNPRSTVWXYZ';
  const a = letters[next() % letters.length]!;
  const d1 = String(next() % 10);
  const b = letters2[next() % letters2.length]!;
  const d2 = String(next() % 10);
  const c = letters2[next() % letters2.length]!;
  const d3 = String(next() % 10);
  return `${a}${d1}${b} ${d2}${c}${d3}`;
}

// --- Australia postcode ------------------------------------------------------

/** 4-digit Australian postcode in the 0200–9999 range. */
export function validateAuPostcode(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{4}$/.test(d)) return false;
  const n = Number(d);
  return n >= 200 && n <= 9999;
}

/** Generate a sample Australian postcode for TEST / QA use only. */
export function generateAuPostcode(seed = 0): string {
  const n = 200 + (Math.abs(Math.trunc(seed)) % 9800);
  return String(n).padStart(4, '0');
}

// --- Germany PLZ -------------------------------------------------------------

/** 5-digit German Postleitzahl (not 00000). */
export function validateDePlz(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{5}$/.test(d) && d !== '00000';
}

/** Generate a sample German PLZ for TEST / QA use only. */
export function generateDePlz(seed = 0): string {
  const n = 1 + (Math.abs(Math.trunc(seed)) % 99999);
  return String(n).padStart(5, '0');
}

// --- Germany IdNr ------------------------------------------------------------

/** ISO 7064 MOD 11,10 check digit for the first 10 digits of a German IdNr. */
function deTaxIdCheckDigit(first10: string): number {
  let product = 10;
  for (let i = 0; i < 10; i++) {
    let sum = ((first10.charCodeAt(i) - 48) + product) % 10;
    if (sum === 0) sum = 10;
    product = (sum * 2) % 11;
  }
  return (11 - product) % 10;
}

function deTaxIdBodyValid(first10: string): boolean {
  if (!/^[1-9]\d{9}$/.test(first10)) return false;
  const counts = new Array(10).fill(0);
  for (let i = 0; i < 10; i++) counts[first10.charCodeAt(i) - 48]!++;
  let doubles = 0;
  let missing = 0;
  for (let d = 0; d < 10; d++) {
    const c = counts[d]!;
    if (c === 2) doubles++;
    else if (c === 0) missing++;
    else if (c !== 1) return false;
  }
  return doubles === 1 && missing === 1;
}

/** 11-digit German tax identification number (IdNr) rules. */
export function validateDeTaxId(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{11}$/.test(d)) return false;
  const body = d.slice(0, 10);
  if (!deTaxIdBodyValid(body)) return false;
  return deTaxIdCheckDigit(body) === d.charCodeAt(10) - 48;
}

/** Generate a checksum-valid German IdNr for TEST / QA use only. */
export function generateDeTaxId(seed = 0): string {
  const next = lcg(seed);
  for (let attempt = 0; attempt < 5000; attempt++) {
    const digits = [1 + (next() % 9)];
    const used = new Set<number>([digits[0]!]);
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => !used.has(x));
    // Pick one digit to duplicate and one to omit from the remaining nine slots.
    const dup = pool[next() % pool.length]!;
    const omitCandidates = pool.filter((x) => x !== dup);
    const omit = omitCandidates[next() % omitCandidates.length]!;
    const rest = pool.filter((x) => x !== omit);
    // rest has 8 unique + we need dup once more → 9 more digits for positions 1..9
    const remaining = [...rest, dup];
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = next() % (i + 1);
      const tmp = remaining[i]!;
      remaining[i] = remaining[j]!;
      remaining[j] = tmp;
    }
    const body = String(digits[0]) + remaining.join('');
    if (!deTaxIdBodyValid(body)) continue;
    const check = deTaxIdCheckDigit(body);
    const full = body + String(check);
    if (validateDeTaxId(full)) return full;
  }
  throw new Error('generateDeTaxId: could not find a valid number');
}

// --- France SIREN / SIRET ----------------------------------------------------

/** 9-digit French SIREN (Luhn). */
export function validateSiren(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{9}$/.test(d) && luhnValid(d);
}

/** Generate a checksum-valid SIREN for TEST / QA use only. */
export function generateSiren(seed = 0): string {
  const body = randomDigits(lcg(seed), 8);
  return body + String(luhnCheckDigit(body));
}

/** 14-digit French SIRET (Luhn). */
export function validateSiret(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{14}$/.test(d) && luhnValid(d);
}

/** Generate a checksum-valid SIRET for TEST / QA use only. */
export function generateSiret(seed = 0): string {
  const siren = generateSiren(seed);
  const next = lcg(seed + 17);
  const nicBody = randomDigits(next, 4);
  const partial = siren + nicBody;
  return partial + String(luhnCheckDigit(partial));
}

// --- France NIR --------------------------------------------------------------

/**
 * French NIR (numéro de sécurité sociale): 15 chars = 13-digit body + 2-digit
 * key where key = 97 − (n mod 97). Corsica departments `2A`/`2B` map to 19/18
 * for the numeric check.
 */
export function validateNir(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length !== 15) return false;
  if (!/^[1278]/.test(cleaned)) return false;
  let body = cleaned.slice(0, 13);
  const keyStr = cleaned.slice(13);
  if (!/^\d{2}$/.test(keyStr)) return false;
  // Corsica: positions 6–7 may be 2A / 2B.
  if (body.slice(5, 7) === '2A') body = body.slice(0, 5) + '19' + body.slice(7);
  else if (body.slice(5, 7) === '2B') body = body.slice(0, 5) + '18' + body.slice(7);
  if (!/^\d{13}$/.test(body)) return false;
  const n = Number(body);
  if (!Number.isFinite(n)) return false;
  return Number(keyStr) === 97 - (n % 97);
}

/** Generate a checksum-valid NIR for TEST / QA use only. */
export function generateNir(seed = 0): string {
  const next = lcg(seed);
  const sex = next() % 2 === 0 ? '1' : '2';
  const year = String(next() % 100).padStart(2, '0');
  const month = String(1 + (next() % 12)).padStart(2, '0');
  const dept = String(1 + (next() % 95)).padStart(2, '0');
  const commune = String(next() % 990).padStart(3, '0');
  const order = String(1 + (next() % 999)).padStart(3, '0');
  const body = sex + year + month + dept + commune + order;
  const key = String(97 - (Number(body) % 97)).padStart(2, '0');
  return body + key;
}

// --- France / Korea postal & phone ------------------------------------------

/** 5-digit French code postal (00000–99999, not all-zero preferred but allowed for CEDEX). */
export function validateFrPostal(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{5}$/.test(d);
}

/** Generate a sample French postal code for TEST / QA use only. */
export function generateFrPostal(seed = 0): string {
  const n = Math.abs(Math.trunc(seed)) % 100000;
  return String(n === 0 ? 75001 : n).padStart(5, '0');
}

/** 5-digit Korean postal code. */
export function validateKoPostal(value: string): boolean {
  const d = digitsOnly(value);
  return /^\d{5}$/.test(d);
}

/** Generate a sample Korean postal code for TEST / QA use only. */
export function generateKoPostal(seed = 0): string {
  return String(Math.abs(Math.trunc(seed)) % 100000).padStart(5, '0');
}

/**
 * Korean phone: mobile 01[016789]-XXXX-XXXX, or landline 0N… (9–11 digits).
 */
export function validateKoPhone(value: string): boolean {
  const d = digitsOnly(value);
  if (/^01[016789]\d{7,8}$/.test(d)) return true;
  if (/^0[2-6]\d{7,9}$/.test(d)) return true;
  return false;
}

/** Generate a sample Korean mobile number for TEST / QA use only. */
export function generateKoPhone(seed = 0): string {
  const next = lcg(seed);
  const second = '016789'[next() % 6]!;
  return `01${second}` + randomDigits(next, 8);
}

// --- France RIB → IBAN -------------------------------------------------------

function mod97(numeric: string): number {
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
  }
  return remainder;
}

/**
 * Convert a French RIB (bank + branch + account + key) into an IBAN.
 * Inputs are digit strings; account may be alphanumeric (A→10 style not used —
 * French RIB account is typically 11 alphanumeric with letters mapped).
 */
export function ribToIban(bank: string, branch: string, account: string, key: string): string {
  const b = digitsOnly(bank).padStart(5, '0').slice(-5);
  const g = digitsOnly(branch).padStart(5, '0').slice(-5);
  const rawAccount = account.replace(/\s+/g, '').toUpperCase();
  // Map letters in account to digits (A=1 … Z=9 cycling? French uses A=10 style via expanding).
  // RIB accounts are 11 chars; letters are rare. Expand A–Z → 10–35 for IBAN math,
  // but BBAN itself keeps alphanumerics. Pad/truncate to 11.
  let acct = rawAccount.replace(/[^0-9A-Z]/g, '');
  if (acct.length < 11) acct = acct.padStart(11, '0');
  if (acct.length > 11) acct = acct.slice(-11);
  const k = digitsOnly(key).padStart(2, '0').slice(-2);
  const bban = b + g + acct + k;
  // IBAN check: rearrange BBAN + "FR00", expand letters, mod 97 → check = 98 - rem.
  const rearranged = bban + 'FR00';
  let expanded = '';
  for (const ch of rearranged) {
    if (ch >= 'A' && ch <= 'Z') expanded += String(ch.charCodeAt(0) - 55);
    else expanded += ch;
  }
  const check = String(98 - mod97(expanded)).padStart(2, '0');
  return `FR${check}${bban}`;
}

// --- Spain DNI / NIE ---------------------------------------------------------

const ES_DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/** Spanish DNI (8 digits + letter) or NIE (X/Y/Z + 7 digits + letter). */
export function validateEsDni(value: string): boolean {
  const v = value.replace(/[\s-]/g, '').toUpperCase();
  let num: number;
  let letter: string;
  if (/^\d{8}[A-Z]$/.test(v)) {
    num = Number(v.slice(0, 8));
    letter = v.slice(8);
  } else if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
    const map: Record<string, string> = { X: '0', Y: '1', Z: '2' };
    num = Number(map[v[0]!]! + v.slice(1, 8));
    letter = v.slice(8);
  } else return false;
  return ES_DNI_LETTERS[num % 23] === letter;
}

/** Generate a checksum-valid DNI for TEST / QA use only. */
export function generateEsDni(seed = 0): string {
  const body = String(Math.abs(Math.trunc(seed)) % 100_000_000).padStart(8, '0');
  return body + ES_DNI_LETTERS[Number(body) % 23]!;
}

/** Spanish CIF (letter + 7 digits + check). Simplified: letter + 7 digits + Luhn-like digit. */
export function validateEsCif(value: string): boolean {
  const v = value.replace(/[\s-]/g, '').toUpperCase();
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[\dA-J]$/.test(v)) return false;
  const digits = v.slice(1, 8);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    let n = Number(digits[i]);
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n = Math.floor(n / 10) + (n % 10);
    }
    sum += n;
  }
  const check = (10 - (sum % 10)) % 10;
  const last = v[8]!;
  if (/\d/.test(last)) return Number(last) === check;
  return 'JABCDEFGHI'[check] === last;
}

/** Generate a checksum-valid CIF for TEST / QA use only. */
export function generateEsCif(seed = 0): string {
  const next = lcg(seed);
  const letter = 'ABCDEFGHJNPQRSUVW'[next() % 17]!;
  const body = randomDigits(next, 7);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    let n = Number(body[i]);
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n = Math.floor(n / 10) + (n % 10);
    }
    sum += n;
  }
  const check = (10 - (sum % 10)) % 10;
  return letter + body + String(check);
}

/** 5-digit Spanish código postal. */
export function validateEsPostal(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{5}$/.test(d)) return false;
  const n = Number(d.slice(0, 2));
  return n >= 1 && n <= 52;
}

export function generateEsPostal(seed = 0): string {
  const prov = (Math.abs(Math.trunc(seed)) % 52) + 1;
  const rest = Math.abs(Math.trunc(seed * 7)) % 1000;
  return String(prov).padStart(2, '0') + String(rest).padStart(3, '0');
}

// --- Italy codice fiscale / P.IVA / CAP --------------------------------------

const IT_CF_ODD: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
  K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
  U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
};
const IT_CF_EVEN: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
  K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
  U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
};
const IT_CF_CHECK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** 16-char Italian codice fiscale (format + check character). */
export function validateCodiceFiscale(value: string): boolean {
  const v = value.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{6}\d{2}[A-EHLMPRST]\d{2}[A-Z]\d{3}[A-Z]$/.test(v)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const ch = v[i]!;
    sum += i % 2 === 0 ? IT_CF_ODD[ch]! : IT_CF_EVEN[ch]!;
  }
  return IT_CF_CHECK[sum % 26] === v[15];
}

export function generateCodiceFiscale(seed = 0): string {
  const next = lcg(seed);
  const letters = () => String.fromCharCode(65 + (next() % 26));
  const body =
    letters() + letters() + letters() + letters() + letters() + letters() +
    String(next() % 100).padStart(2, '0') +
    'ABCDEHLMPRST'[next() % 12]! +
    String((next() % 28) + 1).padStart(2, '0') +
    letters() +
    String(next() % 1000).padStart(3, '0');
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const ch = body[i]!;
    sum += i % 2 === 0 ? IT_CF_ODD[ch]! : IT_CF_EVEN[ch]!;
  }
  return body + IT_CF_CHECK[sum % 26]!;
}

/** 11-digit Italian partita IVA (Luhn-like Italian check). */
export function validatePartitaIva(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{11}$/.test(d)) return false;
  let s = 0;
  for (let i = 0; i < 10; i++) {
    let n = d.charCodeAt(i) - 48;
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    s += n;
  }
  const check = (10 - (s % 10)) % 10;
  return check === d.charCodeAt(10) - 48;
}

export function generatePartitaIva(seed = 0): string {
  const body = randomDigits(lcg(seed), 10);
  let s = 0;
  for (let i = 0; i < 10; i++) {
    let n = body.charCodeAt(i) - 48;
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    s += n;
  }
  return body + String((10 - (s % 10)) % 10);
}

/** 5-digit Italian CAP. */
export function validateItCap(value: string): boolean {
  return /^\d{5}$/.test(digitsOnly(value));
}

export function generateItCap(seed = 0): string {
  return String(Math.abs(Math.trunc(seed)) % 100000).padStart(5, '0');
}

// --- Netherlands BSN / KvK / postcode ----------------------------------------

/** 9-digit BSN with "11-proef". */
export function validateBsn(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^\d{9}$/.test(d) || d === '000000000') return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += (d.charCodeAt(i) - 48) * (9 - i);
  sum -= d.charCodeAt(8) - 48;
  return sum % 11 === 0;
}

export function generateBsn(seed = 0): string {
  const next = lcg(seed);
  for (let attempt = 0; attempt < 2000; attempt++) {
    const body = randomDigits(next, 8);
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += (body.charCodeAt(i) - 48) * (9 - i);
    const check = sum % 11;
    if (check === 10) continue;
    const full = body + String(check);
    if (validateBsn(full)) return full;
  }
  throw new Error('generateBsn: could not find a valid number');
}

/** Dutch KvK number: 8 digits. */
export function validateKvk(value: string): boolean {
  return /^\d{8}$/.test(digitsOnly(value));
}

export function generateKvk(seed = 0): string {
  return String(Math.abs(Math.trunc(seed)) % 100_000_000).padStart(8, '0');
}

/** Dutch postcode: 1234 AB. */
export function validateNlPostcode(value: string): boolean {
  return /^\d{4}\s?[A-Za-z]{2}$/.test(value.trim());
}

export function generateNlPostcode(seed = 0): string {
  const next = lcg(seed);
  const n = 1000 + (next() % 9000);
  const a = String.fromCharCode(65 + (next() % 26));
  const b = String.fromCharCode(65 + (next() % 26));
  return `${n} ${a}${b}`;
}

// --- Singapore NRIC / UEN / postal / phone -----------------------------------

const SG_NRIC_ST = 'JZIHGFEDCBA';
const SG_NRIC_FG = 'XWUTRQPNMLK';

/** Singapore NRIC/FIN: S/T/F/G/M + 7 digits + checksum letter. */
export function validateNric(value: string): boolean {
  const v = value.replace(/[\s-]/g, '').toUpperCase();
  if (!/^[STFGM]\d{7}[A-Z]$/.test(v)) return false;
  const weights = [2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += (v.charCodeAt(i + 1) - 48) * weights[i]!;
  if (v[0] === 'T' || v[0] === 'G') sum += 4;
  if (v[0] === 'M') sum += 3;
  const offset = sum % 11;
  const table = v[0] === 'S' || v[0] === 'T' ? SG_NRIC_ST : SG_NRIC_FG;
  return table[offset] === v[8];
}

export function generateNric(seed = 0): string {
  const next = lcg(seed);
  const prefix = 'STFG'[next() % 4]!;
  const body = randomDigits(next, 7);
  const weights = [2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += (body.charCodeAt(i) - 48) * weights[i]!;
  if (prefix === 'T' || prefix === 'G') sum += 4;
  const table = prefix === 'S' || prefix === 'T' ? SG_NRIC_ST : SG_NRIC_FG;
  return prefix + body + table[sum % 11]!;
}

/** UEN: several formats; accept 9–10 alphanumeric common patterns. */
export function validateUen(value: string): boolean {
  const v = value.replace(/\s+/g, '').toUpperCase();
  return /^(?:\d{8}[A-Z]|\d{9}[A-Z]|[ST]\d{2}[A-Z]{2}\d{4}[A-Z])$/.test(v);
}

export function generateUen(seed = 0): string {
  const body = randomDigits(lcg(seed), 8);
  const letter = String.fromCharCode(65 + (Math.abs(Math.trunc(seed)) % 26));
  return body + letter;
}

export function validateSgPostal(value: string): boolean {
  return /^\d{6}$/.test(digitsOnly(value));
}

export function generateSgPostal(seed = 0): string {
  return String(Math.abs(Math.trunc(seed)) % 1_000_000).padStart(6, '0');
}

export function validateSgPhone(value: string): boolean {
  const d = digitsOnly(value);
  return /^[689]\d{7}$/.test(d);
}

export function generateSgPhone(seed = 0): string {
  const next = lcg(seed);
  const first = '689'[next() % 3]!;
  return first + randomDigits(next, 7);
}

// --- India PAN / Aadhaar / GSTIN / IFSC / PIN --------------------------------

/** PAN: AAAAA9999A. */
export function validatePan(value: string): boolean {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(value.replace(/\s+/g, '').toUpperCase());
}

export function generatePan(seed = 0): string {
  const next = lcg(seed);
  const L = () => String.fromCharCode(65 + (next() % 26));
  return L() + L() + L() + L() + L() + randomDigits(next, 4) + L();
}

/** Aadhaar Verhoeff checksum (12 digits). */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
] as const;
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
] as const;

export function validateAadhaar(value: string): boolean {
  const d = digitsOnly(value);
  if (!/^[2-9]\d{11}$/.test(d)) return false;
  let c = 0;
  const reversed = d.split('').reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = VERHOEFF_D[c]![VERHOEFF_P[i % 8]![reversed[i]!.charCodeAt(0) - 48]!]!;
  }
  return c === 0;
}

export function generateAadhaar(seed = 0): string {
  const next = lcg(seed);
  for (let attempt = 0; attempt < 500; attempt++) {
    const body = String(2 + (next() % 8)) + randomDigits(next, 10);
    for (let check = 0; check < 10; check++) {
      const full = body + String(check);
      if (validateAadhaar(full)) return full;
    }
  }
  throw new Error('generateAadhaar: could not find a valid number');
}

/** GSTIN: 15 chars — state + PAN + entity + Z + check. */
export function validateGstin(value: string): boolean {
  const v = value.replace(/\s+/g, '').toUpperCase();
  if (!/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/.test(v)) return false;
  return validatePan(v.slice(2, 12));
}

export function generateGstin(seed = 0): string {
  const next = lcg(seed);
  const state = String(1 + (next() % 37)).padStart(2, '0');
  const pan = generatePan(seed);
  const entity = String.fromCharCode(65 + (next() % 26));
  const check = String.fromCharCode(65 + (next() % 26));
  return state + pan + entity + 'Z' + check;
}

/** IFSC: 4 letters + 0 + 6 alphanumeric. */
export function validateIfsc(value: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.replace(/\s+/g, '').toUpperCase());
}

export function generateIfsc(seed = 0): string {
  const next = lcg(seed);
  const L = () => String.fromCharCode(65 + (next() % 26));
  return L() + L() + L() + L() + '0' + randomDigits(next, 6);
}

/** Indian PIN: 6 digits, first digit 1–9. */
export function validateInPincode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(digitsOnly(value));
}

export function generateInPincode(seed = 0): string {
  const n = 100_000 + (Math.abs(Math.trunc(seed)) % 900_000);
  return String(n);
}
