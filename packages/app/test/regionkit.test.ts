import { describe, it, expect } from 'vitest';
import {
  validateUsZip,
  generateUsZip,
  validateUsSsn,
  generateUsSsn,
  validateUsRouting,
  generateUsRouting,
  validateJpPostal,
  generateJpPostal,
  validateHkPhone,
  generateHkPhone,
  validateTwMobile,
  generateTwMobile,
} from '../src/lib/regionkit';

describe('regionkit — US ZIP', () => {
  it('accepts 5-digit and ZIP+4', () => {
    expect(validateUsZip('90210')).toBe(true);
    expect(validateUsZip('90210-1234')).toBe(true);
  });
  it('rejects bad formats', () => {
    expect(validateUsZip('9021')).toBe(false);
    expect(validateUsZip('90210-12')).toBe(false);
    expect(validateUsZip('abcde')).toBe(false);
  });
});

describe('regionkit — US SSN', () => {
  it('accepts a well-formed SSN', () => {
    expect(validateUsSsn('123-45-6789')).toBe(true);
    expect(validateUsSsn('123456789')).toBe(true);
  });
  it('rejects structurally invalid areas/groups/serials', () => {
    expect(validateUsSsn('000-45-6789')).toBe(false);
    expect(validateUsSsn('666-45-6789')).toBe(false);
    expect(validateUsSsn('900-45-6789')).toBe(false);
    expect(validateUsSsn('123-00-6789')).toBe(false);
    expect(validateUsSsn('123-45-0000')).toBe(false);
  });
});

describe('regionkit — US routing', () => {
  it('validates a known-good ABA number', () => {
    // 021000021 (JPMorgan Chase) passes the weighted mod-10 check.
    expect(validateUsRouting('021000021')).toBe(true);
  });
  it('rejects a bad checksum', () => {
    expect(validateUsRouting('021000022')).toBe(false);
    expect(validateUsRouting('12345')).toBe(false);
  });
});

describe('regionkit — JP postal / HK phone / TW mobile', () => {
  it('validates postal formats', () => {
    expect(validateJpPostal('100-0001')).toBe(true);
    expect(validateJpPostal('1000001')).toBe(true);
    expect(validateJpPostal('100-01')).toBe(false);
  });
  it('validates HK phones', () => {
    expect(validateHkPhone('2345 6789')).toBe(true);
    expect(validateHkPhone('9123 4567')).toBe(true);
    expect(validateHkPhone('1234 5678')).toBe(false);
    expect(validateHkPhone('12345')).toBe(false);
  });
  it('validates TW mobiles', () => {
    expect(validateTwMobile('0912345678')).toBe(true);
    expect(validateTwMobile('0812345678')).toBe(false);
    expect(validateTwMobile('091234567')).toBe(false);
  });
});

describe('regionkit — generators round-trip through their validators', () => {
  const seeds = [0, 1, 42, 777, 123456, 999999999];
  it('every generated sample validates', () => {
    for (const s of seeds) {
      expect(validateUsZip(generateUsZip(s))).toBe(true);
      expect(validateUsSsn(generateUsSsn(s))).toBe(true);
      expect(validateUsRouting(generateUsRouting(s))).toBe(true);
      expect(validateJpPostal(generateJpPostal(s))).toBe(true);
      expect(validateHkPhone(generateHkPhone(s))).toBe(true);
      expect(validateTwMobile(generateTwMobile(s))).toBe(true);
    }
  });
});
