import { describe, it, expect } from 'vitest';
import { parseLocalePack, safeParseLocalePack } from '../src/index';

const valid = {
  market: 'tw',
  year: 2026,
  effectiveDate: '2026-01-01',
  dateFormat: 'yyyy/MM/dd',
  calendars: ['gregorian', 'roc', 'lunar'],
  currency: 'TWD',
  units: 'metric',
  holidays: { makeUpWorkdays: false },
  toggles: { einvoiceLottery: true },
};

describe('LocalePackSchema', () => {
  it('parses a valid pack and applies defaults', () => {
    const p = parseLocalePack(valid);
    expect(p.market).toBe('tw');
    expect(p.dataSources).toEqual({}); // default
    expect(p.tools.enabled).toEqual([]); // default
    expect(p.holidays?.list).toEqual([]); // nested default
  });

  it('rejects an unknown top-level key (strict)', () => {
    expect(() => parseLocalePack({ ...valid, bogus: 1 })).toThrow();
  });

  it('rejects a malformed effectiveDate', () => {
    expect(safeParseLocalePack({ ...valid, effectiveDate: '2026/01/01' }).success).toBe(false);
  });

  it('rejects a bad currency code length', () => {
    expect(safeParseLocalePack({ ...valid, currency: 'TW' }).success).toBe(false);
  });

  it('rejects an unknown market', () => {
    expect(safeParseLocalePack({ ...valid, market: 'fr' }).success).toBe(false);
  });
});
