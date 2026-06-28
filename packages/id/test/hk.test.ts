import { describe, it, expect } from 'vitest';
import { validateHkid, generateHkid } from '../src/index';

describe('validateHkid', () => {
  it('accepts a known single-letter HKID with parentheses', () => {
    expect(validateHkid('A123456(3)')).toBe(true);
  });

  it('accepts the same HKID without parentheses', () => {
    expect(validateHkid('A1234563')).toBe(true);
  });

  it('accepts a known two-letter HKID', () => {
    expect(validateHkid('AB123456(9)')).toBe(true);
  });

  it('accepts a check digit of A (meaning 10)', () => {
    // generateHkid(23) deterministically yields X940486(A).
    const id = generateHkid(23);
    expect(id).toBe('X940486(A)');
    expect(validateHkid(id)).toBe(true);
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(validateHkid('  a123456(3)  ')).toBe(true);
  });

  it('rejects a tampered HKID', () => {
    expect(validateHkid('A123456(4)')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(validateHkid('A12345(3)')).toBe(false); // five digits
    expect(validateHkid('123456(3)')).toBe(false); // no letter
    expect(validateHkid('ABC123456(3)')).toBe(false); // three letters
  });
});

describe('generateHkid', () => {
  it('generates HKIDs that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateHkid(seed);
      expect(id).toMatch(/^[A-Z]\d{6}\([0-9A]\)$/);
      expect(validateHkid(id)).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(generateHkid(3)).toBe(generateHkid(3));
  });

  it('defaults to a stable value with no seed', () => {
    expect(validateHkid(generateHkid())).toBe(true);
  });
});
