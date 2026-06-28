import { describe, it, expect } from 'vitest';
import {
  gregorianToRoc,
  rocToGregorian,
  toJapaneseEra,
  japaneseEraToGregorian,
} from '../src/index';

describe('ROC era conversions', () => {
  it('gregorianToRoc(2026) === 115 (golden anchor)', () => {
    expect(gregorianToRoc(2026)).toBe(115);
  });

  it('rocToGregorian(115) === 2026 (golden anchor)', () => {
    expect(rocToGregorian(115)).toBe(2026);
  });

  it('round-trips ROC year 1 <-> 1912', () => {
    expect(rocToGregorian(1)).toBe(1912);
    expect(gregorianToRoc(1912)).toBe(1);
  });

  it('handles years before the ROC founding (negative ROC years)', () => {
    expect(gregorianToRoc(1900)).toBe(-11);
  });
});

describe('toJapaneseEra', () => {
  it('2026-06-28 -> reiwa year 8 (golden anchor)', () => {
    const r = toJapaneseEra(new Date('2026-06-28'));
    expect(r.era).toBe('reiwa');
    expect(r.year).toBe(8);
    expect(r.label).toBe('令和8年');
  });

  it('2019-04-30 -> heisei year 31 (last day of Heisei)', () => {
    const r = toJapaneseEra(new Date('2019-04-30'));
    expect(r.era).toBe('heisei');
    expect(r.year).toBe(31);
  });

  it('2019-05-01 -> reiwa year 1 (first day of Reiwa)', () => {
    const r = toJapaneseEra(new Date('2019-05-01'));
    expect(r.era).toBe('reiwa');
    expect(r.year).toBe(1);
  });

  it('honors the Heisei start boundary 1989-01-08', () => {
    expect(toJapaneseEra(new Date('1989-01-07')).era).toBe('showa');
    expect(toJapaneseEra(new Date('1989-01-08')).era).toBe('heisei');
    expect(toJapaneseEra(new Date('1989-01-08')).year).toBe(1);
  });

  it('honors the Showa start boundary 1926-12-25', () => {
    expect(toJapaneseEra(new Date('1926-12-24')).era).toBe('taisho');
    expect(toJapaneseEra(new Date('1926-12-25')).era).toBe('showa');
  });

  it('honors the Taisho start boundary 1912-07-30', () => {
    expect(toJapaneseEra(new Date('1912-07-29')).era).toBe('meiji');
    expect(toJapaneseEra(new Date('1912-07-30')).era).toBe('taisho');
  });

  it('throws for dates before the Meiji era', () => {
    expect(() => toJapaneseEra(new Date('1800-01-01'))).toThrow(RangeError);
  });
});

describe('japaneseEraToGregorian', () => {
  it('reiwa year 1 -> 2019', () => {
    expect(japaneseEraToGregorian('reiwa', 1)).toBe(2019);
  });

  it('reiwa year 8 -> 2026', () => {
    expect(japaneseEraToGregorian('reiwa', 8)).toBe(2026);
  });

  it('heisei year 31 -> 2019', () => {
    expect(japaneseEraToGregorian('heisei', 31)).toBe(2019);
  });

  it('showa year 1 -> 1926', () => {
    expect(japaneseEraToGregorian('showa', 1)).toBe(1926);
  });

  it('throws on an unknown era', () => {
    // @ts-expect-error testing runtime guard with an invalid era name
    expect(() => japaneseEraToGregorian('genroku', 1)).toThrow(RangeError);
  });

  it('throws on a non-positive era year', () => {
    expect(() => japaneseEraToGregorian('reiwa', 0)).toThrow(RangeError);
  });
});
