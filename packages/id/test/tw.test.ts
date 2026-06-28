import { describe, it, expect } from 'vitest';
import { validateTwNationalId, generateTwNationalId, validateTwUbn } from '../src/index';

describe('validateTwNationalId', () => {
  it('accepts the golden-anchor id A123456789', () => {
    expect(validateTwNationalId('A123456789')).toBe(true);
  });

  it('rejects A123456788 (wrong check digit)', () => {
    expect(validateTwNationalId('A123456788')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(validateTwNationalId('a123456789')).toBe(false); // lowercase
    expect(validateTwNationalId('A323456789')).toBe(false); // gender digit not 1/2
    expect(validateTwNationalId('A12345678')).toBe(false); // too short
    expect(validateTwNationalId('AA23456789')).toBe(false); // second char not digit
  });
});

describe('generateTwNationalId', () => {
  it('generates ids that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateTwNationalId(seed);
      expect(id).toMatch(/^[A-Z][12]\d{8}$/);
      expect(validateTwNationalId(id)).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(generateTwNationalId(7)).toBe(generateTwNationalId(7));
  });

  it('defaults to a stable value with no seed', () => {
    expect(validateTwNationalId(generateTwNationalId())).toBe(true);
  });
});

describe('validateTwUbn', () => {
  it('accepts a valid UBN under the standard mod-10 rule', () => {
    expect(validateTwUbn('04595257')).toBe(true);
  });

  it('accepts a UBN that ONLY passes via the 7th-digit-is-7 exception', () => {
    // total%10 !== 0, but the 7th digit is 7 and (total+1)%10 === 0.
    expect(validateTwUbn('10000078')).toBe(true);
    // The same body with a non-7 in the 7th position must fail.
    expect(validateTwUbn('10000058')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateTwUbn('1234567')).toBe(false);
    expect(validateTwUbn('123456789')).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(validateTwUbn('0459525A')).toBe(false);
  });

  it('rejects a tampered UBN', () => {
    expect(validateTwUbn('04595258')).toBe(false);
  });
});
