import { describe, it, expect } from 'vitest';
import {
  validateMyNumber,
  generateMyNumber,
  validateCorporateNumber,
  generateCorporateNumber,
  invoiceRegistrationNumber,
  validateInvoiceNumber,
} from '../src/index';

describe('validateMyNumber', () => {
  it('accepts a hand-derived valid My Number', () => {
    // base 12345678901 -> check digit 8 (per the official mod-11 algorithm).
    expect(validateMyNumber('123456789018')).toBe(true);
  });

  it('rejects a tampered My Number', () => {
    expect(validateMyNumber('123456789019')).toBe(false);
  });

  it('rejects wrong length / non-numeric', () => {
    expect(validateMyNumber('12345678901')).toBe(false);
    expect(validateMyNumber('1234567890123')).toBe(false);
    expect(validateMyNumber('12345678901A')).toBe(false);
  });
});

describe('generateMyNumber', () => {
  it('generates My Numbers that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const n = generateMyNumber(seed);
      expect(n).toMatch(/^\d{12}$/);
      expect(validateMyNumber(n)).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(generateMyNumber(5)).toBe(generateMyNumber(5));
  });

  it('defaults to a stable value with no seed', () => {
    expect(validateMyNumber(generateMyNumber())).toBe(true);
  });
});

describe('validateCorporateNumber', () => {
  it('accepts a hand-derived valid Corporate Number', () => {
    // base 123456789012 -> leading check digit 7.
    expect(validateCorporateNumber('7123456789012')).toBe(true);
  });

  it('rejects a tampered Corporate Number', () => {
    expect(validateCorporateNumber('6123456789012')).toBe(false);
  });

  it('rejects wrong length / non-numeric', () => {
    expect(validateCorporateNumber('123456789012')).toBe(false);
    expect(validateCorporateNumber('71234567890123')).toBe(false);
    expect(validateCorporateNumber('A123456789012')).toBe(false);
  });
});

describe('generateCorporateNumber', () => {
  it('generates Corporate Numbers that validate (round-trip)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const n = generateCorporateNumber(seed);
      expect(n).toMatch(/^\d{13}$/);
      expect(validateCorporateNumber(n)).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(generateCorporateNumber(9)).toBe(generateCorporateNumber(9));
  });
});

describe('invoiceRegistrationNumber / validateInvoiceNumber', () => {
  it('prefixes a corporate number with T', () => {
    const corp = generateCorporateNumber(2);
    expect(invoiceRegistrationNumber(corp)).toBe('T' + corp);
  });

  it('validates an invoice number built from a valid corporate number', () => {
    const corp = generateCorporateNumber(11);
    const inv = invoiceRegistrationNumber(corp);
    expect(validateInvoiceNumber(inv)).toBe(true);
  });

  it('accepts the hand-derived sample invoice number', () => {
    expect(validateInvoiceNumber('T7123456789012')).toBe(true);
  });

  it('rejects a missing or wrong prefix', () => {
    expect(validateInvoiceNumber('7123456789012')).toBe(false); // no T
    expect(validateInvoiceNumber('X7123456789012')).toBe(false); // wrong prefix
  });

  it('rejects an invoice number wrapping an invalid corporate number', () => {
    expect(validateInvoiceNumber('T6123456789012')).toBe(false);
  });
});
