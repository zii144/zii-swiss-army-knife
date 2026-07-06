import { describe, it, expect } from 'vitest';
import {
  checkTwInvoice,
  normalizeReceiptNumber,
  TW_PRIZE_AMOUNT,
  TW_INVOICE_DRAWINGS,
  type TwInvoiceDrawing,
} from '../src/index';

// Hypothetical numbers — we test the *algorithm*, not real government data.
const DRAWING: TwInvoiceDrawing = {
  period: '999-01-02',
  specialPrize: '12345678',
  grandPrize: '87654321',
  firstPrizes: ['11223344', '55667788', '99001122'],
  additionalSixth: ['789', '456'],
  drawnOn: '2099-01-25',
  source: 'test fixture',
};

describe('normalizeReceiptNumber', () => {
  it('accepts a bare 8-digit number', () => {
    expect(normalizeReceiptNumber('12345678')).toBe('12345678');
  });
  it('strips a 2-letter track prefix and separators', () => {
    expect(normalizeReceiptNumber('AB-12345678')).toBe('12345678');
    expect(normalizeReceiptNumber('ab 1234 5678')).toBe('12345678');
  });
  it('takes the trailing 8 digits when longer', () => {
    expect(normalizeReceiptNumber('0012345678')).toBe('12345678');
  });
  it('rejects anything that cannot yield 8 digits', () => {
    expect(normalizeReceiptNumber('1234567')).toBeNull();
    expect(normalizeReceiptNumber('')).toBeNull();
    expect(normalizeReceiptNumber('abcdefgh')).toBeNull();
  });
});

describe('checkTwInvoice — prize tiers', () => {
  it('特別獎: full 8-digit match, ignoring the letter prefix', () => {
    const r = checkTwInvoice('XY-12345678', DRAWING);
    expect(r).toEqual({ tier: 'special', amountTwd: 10_000_000, matched: '12345678' });
  });

  it('特獎: full 8-digit match on the grand prize', () => {
    expect(checkTwInvoice('87654321', DRAWING)).toMatchObject({
      tier: 'grand',
      amountTwd: 2_000_000,
    });
  });

  it('頭獎: full match on a first-prize number', () => {
    expect(checkTwInvoice('11223344', DRAWING)).toMatchObject({
      tier: 'first',
      amountTwd: 200_000,
      matched: '11223344',
    });
  });

  it('二獎: last 7 digits match (but not all 8)', () => {
    expect(checkTwInvoice('91223344', DRAWING)).toMatchObject({ tier: 'second', amountTwd: 40_000 });
  });

  it('三獎: last 6 digits match', () => {
    expect(checkTwInvoice('99223344', DRAWING)).toMatchObject({ tier: 'third', amountTwd: 10_000 });
  });

  it('四獎: last 5 digits match', () => {
    expect(checkTwInvoice('99923344', DRAWING)).toMatchObject({ tier: 'fourth', amountTwd: 4_000 });
  });

  it('五獎: last 4 digits match', () => {
    expect(checkTwInvoice('99993344', DRAWING)).toMatchObject({ tier: 'fifth', amountTwd: 1_000 });
  });

  it('六獎: last 3 digits match', () => {
    expect(checkTwInvoice('99999344', DRAWING)).toMatchObject({ tier: 'sixth', amountTwd: 200 });
  });

  it('增開六獎: last 3 match an additional number only', () => {
    const r = checkTwInvoice('00000789', DRAWING);
    expect(r).toMatchObject({ tier: 'additionalSixth', amountTwd: 200, matched: '789' });
  });

  it('沒中獎: no suffix matches any number', () => {
    expect(checkTwInvoice('00000000', DRAWING)).toEqual({ tier: 'none', amountTwd: 0 });
  });
});

describe('checkTwInvoice — precedence & edge cases', () => {
  it('returns the highest-value tier across all first-prize numbers', () => {
    // Matches 55667788 on last 5 (67788 → 四獎) and nothing better elsewhere.
    expect(checkTwInvoice('11267788', DRAWING)).toMatchObject({ tier: 'fourth', amountTwd: 4_000 });
  });

  it('special/grand outrank any suffix match', () => {
    // A drawing where the special prize shares a 3-digit suffix with a first prize.
    const d: TwInvoiceDrawing = {
      ...DRAWING,
      specialPrize: '00000344',
      firstPrizes: ['11223344'],
    };
    expect(checkTwInvoice('00000344', d)).toMatchObject({ tier: 'special' });
  });

  it('returns null for an invalid receipt number', () => {
    expect(checkTwInvoice('123', DRAWING)).toBeNull();
  });

  it('tolerates a drawing with missing/short numbers', () => {
    const d: TwInvoiceDrawing = {
      ...DRAWING,
      specialPrize: '',
      grandPrize: '',
      firstPrizes: [],
      additionalSixth: [],
    };
    expect(checkTwInvoice('12345678', d)).toEqual({ tier: 'none', amountTwd: 0 });
  });
});

describe('data-trust guardrail', () => {
  it('ships no fabricated official numbers', () => {
    // Intentionally empty until a maintainer adds verified, dated periods.
    expect(TW_INVOICE_DRAWINGS).toHaveLength(0);
  });
  it('exposes the full prize table', () => {
    expect(TW_PRIZE_AMOUNT.special).toBe(10_000_000);
    expect(TW_PRIZE_AMOUNT.sixth).toBe(200);
    expect(TW_PRIZE_AMOUNT.none).toBe(0);
  });
});
