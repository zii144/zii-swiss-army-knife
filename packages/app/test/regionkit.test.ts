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
  validateUsEin,
  generateUsEin,
  validateUsPhone,
  generateUsPhone,
  validateUkPostcode,
  generateUkPostcode,
  validateUkNino,
  generateUkNino,
  validateUkSortCode,
  generateUkSortCode,
  validateTwPostal,
  generateTwPostal,
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

describe('regionkit — US EIN / phone', () => {
  it('validates EIN format + prefix', () => {
    expect(validateUsEin('12-3456789')).toBe(true);
    expect(validateUsEin('123456789')).toBe(true);
    expect(validateUsEin('07-1234567')).toBe(false); // 07 is not a valid prefix
    expect(validateUsEin('12-34567')).toBe(false);
  });
  it('validates NANP phone numbers', () => {
    expect(validateUsPhone('(212) 555-0182')).toBe(true);
    expect(validateUsPhone('2125550182')).toBe(true);
    expect(validateUsPhone('112-555-0182')).toBe(false); // area starts with 1
    expect(validateUsPhone('212-155-0182')).toBe(false); // exchange starts with 1
  });
});

describe('regionkit — UK postcode / NI / sort code', () => {
  it('validates postcodes', () => {
    expect(validateUkPostcode('SW1A 1AA')).toBe(true);
    expect(validateUkPostcode('M1 1AA')).toBe(true);
    expect(validateUkPostcode('B33 8TH')).toBe(true);
    expect(validateUkPostcode('nonsense')).toBe(false);
  });
  it('validates NI numbers and rejects bad prefixes', () => {
    expect(validateUkNino('AB123456C')).toBe(true);
    expect(validateUkNino('QQ123456C')).toBe(false); // Q not allowed
    expect(validateUkNino('BG123456C')).toBe(false); // disallowed prefix
    expect(validateUkNino('AB123456E')).toBe(false); // suffix must be A-D
  });
  it('validates sort codes', () => {
    expect(validateUkSortCode('12-34-56')).toBe(true);
    expect(validateUkSortCode('123456')).toBe(true);
    expect(validateUkSortCode('12-34')).toBe(false);
  });
});

describe('regionkit — TW postal', () => {
  it('validates 3 / 5 / 6-digit codes', () => {
    expect(validateTwPostal('100')).toBe(true);
    expect(validateTwPostal('10058')).toBe(true);
    expect(validateTwPostal('100058')).toBe(true);
    expect(validateTwPostal('10')).toBe(false);
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
      expect(validateUsEin(generateUsEin(s))).toBe(true);
      expect(validateUsPhone(generateUsPhone(s))).toBe(true);
      expect(validateUkPostcode(generateUkPostcode(s))).toBe(true);
      expect(validateUkNino(generateUkNino(s))).toBe(true);
      expect(validateUkSortCode(generateUkSortCode(s))).toBe(true);
      expect(validateTwPostal(generateTwPostal(s))).toBe(true);
    }
  });
});
