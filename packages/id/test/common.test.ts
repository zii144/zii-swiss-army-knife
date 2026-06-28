import { describe, it, expect } from 'vitest';
import {
  luhnValid,
  luhnCheckDigit,
  validateAbaRouting,
  validateIban,
} from '../src/index';

describe('luhnValid', () => {
  it('accepts a known valid card number (golden anchor)', () => {
    expect(luhnValid('4111111111111111')).toBe(true);
  });

  it('ignores non-digit separators', () => {
    expect(luhnValid('4111 1111 1111 1111')).toBe(true);
  });

  it('rejects a tampered number', () => {
    expect(luhnValid('4111111111111112')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(luhnValid('')).toBe(false);
  });
});

describe('luhnCheckDigit', () => {
  it('produces a digit that round-trips through luhnValid', () => {
    const base = '411111111111111';
    const check = luhnCheckDigit(base);
    expect(check).toBe(1);
    expect(luhnValid(base + String(check))).toBe(true);
  });

  it('round-trips for several bases', () => {
    for (const base of ['7992739871', '123456789', '0', '8']) {
      const check = luhnCheckDigit(base);
      expect(check).toBeGreaterThanOrEqual(0);
      expect(check).toBeLessThanOrEqual(9);
      expect(luhnValid(base + String(check))).toBe(true);
    }
  });
});

describe('validateAbaRouting', () => {
  it('accepts the JPMorgan Chase routing number (golden anchor)', () => {
    expect(validateAbaRouting('021000021')).toBe(true);
  });

  it('rejects a tampered routing number', () => {
    expect(validateAbaRouting('021000022')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateAbaRouting('02100002')).toBe(false);
    expect(validateAbaRouting('0210000210')).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(validateAbaRouting('02100002A')).toBe(false);
  });
});

describe('validateIban', () => {
  it('accepts a known valid IBAN (GB example)', () => {
    expect(validateIban('GB82 WEST 1234 5698 7654 32')).toBe(true);
  });

  it('accepts a known valid IBAN (DE example)', () => {
    expect(validateIban('DE89370400440532013000')).toBe(true);
  });

  it('rejects a tampered IBAN', () => {
    expect(validateIban('GB82WEST12345698765433')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(validateIban('XX')).toBe(false);
    expect(validateIban('1234567890')).toBe(false);
  });
});
