/**
 * English-region (Commonwealth) identifier checks.
 *
 * NOTE: generated values are checksum-valid but otherwise arbitrary, intended
 * strictly for TEST / QA data — never for representing a real person.
 */

import { luhnCheckDigit, luhnValid } from './common';

/** Strip everything except ASCII digits. */
function digitsOnly(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') out += ch;
  }
  return out;
}

const TFN_WEIGHTS = [1, 4, 3, 7, 5, 8, 6, 9, 10] as const;

/**
 * Validate a Canadian Social Insurance Number (9 digits, Luhn mod-10).
 * Hyphens are ignored; the first digit must be 1–9.
 */
export function validateSin(value: string): boolean {
  const digits = digitsOnly(value);
  if (!/^\d{9}$/.test(digits)) return false;
  if (/^0+$/.test(digits)) return false;
  return luhnValid(digits);
}

/** Generate a checksum-valid Canadian SIN for TEST / QA use only. */
export function generateSin(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  let acc = s;
  const body: number[] = [];
  body.push(1 + (acc % 9)); // first digit 1–9
  for (let i = 0; i < 7; i++) {
    acc = (acc * 1103515245 + 12345) & 0x7fffffff;
    body.push(acc % 10);
  }
  const partial = body.join('');
  const check = luhnCheckDigit(partial);
  return partial + String(check);
}

/**
 * Validate an Australian Tax File Number (9 digits, weighted mod-11).
 * Hyphens and spaces are ignored.
 */
export function validateTfn(value: string): boolean {
  const digits = digitsOnly(value);
  if (!/^\d{9}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const ch = digits[i];
    const w = TFN_WEIGHTS[i];
    if (ch === undefined || w === undefined) return false;
    sum += (ch.charCodeAt(0) - 48) * w;
  }
  return sum % 11 === 0;
}

/** Generate a checksum-valid Australian TFN for TEST / QA use only. */
export function generateTfn(seed = 0): string {
  const s = Math.abs(Math.trunc(seed));
  let acc = s;
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const body: number[] = [];
    for (let i = 0; i < 8; i++) {
      acc = (acc * 1103515245 + 12345) & 0x7fffffff;
      body.push(acc % 10);
    }
    const partial = body.join('');
    let prefixSum = 0;
    for (let i = 0; i < 8; i++) {
      const w = TFN_WEIGHTS[i];
      const d = partial[i];
      if (w === undefined || d === undefined) break;
      prefixSum += Number(d) * w;
    }
    for (let check = 0; check < 10; check += 1) {
      if ((prefixSum + check * TFN_WEIGHTS[8]!) % 11 === 0) {
        return partial + String(check);
      }
    }
  }
  throw new Error('generateTfn: could not find a valid check digit');
}
