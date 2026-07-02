import { describe, it, expect } from 'vitest';
import { validateHkBr, generateHkBr } from '../src/index';

describe('validateHkBr', () => {
  it('accepts a known valid BRN', () => {
    expect(validateHkBr('36780058')).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(validateHkBr('36780057')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateHkBr('1234567')).toBe(false);
  });
});

describe('generateHkBr', () => {
  it('generates ids that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateHkBr(seed);
      expect(id).toMatch(/^\d{8}$/);
      expect(validateHkBr(id)).toBe(true);
    }
  });
});
