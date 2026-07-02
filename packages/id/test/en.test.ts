import { describe, it, expect } from 'vitest';
import { validateSin, generateSin, validateTfn, generateTfn } from '../src/index';

describe('validateSin', () => {
  it('accepts the Wikipedia golden example', () => {
    expect(validateSin('046454286')).toBe(true);
  });

  it('rejects a tampered SIN', () => {
    expect(validateSin('046454285')).toBe(false);
  });
});

describe('generateSin', () => {
  it('generates ids that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateSin(seed);
      expect(validateSin(id)).toBe(true);
    }
  });
});

describe('validateTfn', () => {
  it('accepts the Wikipedia golden example', () => {
    expect(validateTfn('123456782')).toBe(true);
  });

  it('rejects a tampered TFN', () => {
    expect(validateTfn('123456783')).toBe(false);
  });
});

describe('generateTfn', () => {
  it('generates ids that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateTfn(seed);
      expect(validateTfn(id)).toBe(true);
    }
  });
});
