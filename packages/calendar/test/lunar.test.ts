import { describe, it, expect } from 'vitest';
import {
  gregorianToLunar,
  lunarToGregorian,
  rokuyo,
  solarTermsInYear,
  solarTermOn,
} from '../src/lunar';

const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));

describe('Chinese lunar conversion', () => {
  it('maps Lunar New Year 2026 (丙午 horse) to 2026-02-17', () => {
    const l = gregorianToLunar(utc(2026, 2, 17));
    expect(l).toMatchObject({ year: 2026, month: 1, day: 1, isLeapMonth: false });
    expect(l.ganZhiYear).toBe('丙午');
    expect(l.zodiac).toBe('马'); // shengxiao (simplified glyph from the source data)
  });

  it('round-trips lunar 2026/1/1 back to the Gregorian date', () => {
    const g = lunarToGregorian(2026, 1, 1);
    expect(g.getUTCFullYear()).toBe(2026);
    expect(g.getUTCMonth() + 1).toBe(2);
    expect(g.getUTCDate()).toBe(17);
  });

  it('handles the 2025 leap 6th month (乙巳年閏六月)', () => {
    const leap = gregorianToLunar(utc(2025, 8, 1));
    expect(leap.month).toBe(6);
    expect(leap.isLeapMonth).toBe(true);
    const g = lunarToGregorian(2025, 6, 1, true);
    expect(g.getUTCFullYear()).toBe(2025);
    expect(g.getUTCMonth() + 1).toBe(7);
    expect(g.getUTCDate()).toBe(25);
  });

  it('rejects out-of-range lunar fields', () => {
    expect(() => lunarToGregorian(2026, 13, 1)).toThrow(/month/);
    expect(() => lunarToGregorian(2026, 1, 31)).toThrow(/day/);
  });
});

describe('六曜 (rokuyō)', () => {
  it('lunar 1/1 is always 先勝', () => {
    expect(rokuyo(utc(2026, 2, 17)).kanji).toBe('先勝');
  });

  it('is computed as (lunarMonth + lunarDay) mod 6', () => {
    const l = gregorianToLunar(utc(2026, 6, 1));
    const expectedIndex = (l.month + l.day) % 6;
    expect(rokuyo(utc(2026, 6, 1)).index).toBe(expectedIndex);
  });
});

describe('二十四節気 (24 solar terms)', () => {
  it('returns exactly 24 terms in canonical order for 2026', () => {
    const terms = solarTermsInYear(2026);
    expect(terms).toHaveLength(24);
    expect(terms[0]?.zh).toBe('小寒');
    expect(terms[23]?.zh).toBe('冬至');
    // strictly ascending dates
    for (let i = 1; i < terms.length; i += 1) {
      expect(terms[i]!.date.getTime()).toBeGreaterThan(terms[i - 1]!.date.getTime());
    }
  });

  it('matches known 2026 anchor dates', () => {
    const byZh = new Map(solarTermsInYear(2026).map((t) => [t.zh, t.date]));
    const iso = (d?: Date) =>
      d ? `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}` : '';
    expect(iso(byZh.get('立春'))).toBe('2026-2-4');
    expect(iso(byZh.get('春分'))).toBe('2026-3-20');
    expect(iso(byZh.get('夏至'))).toBe('2026-6-21');
    expect(iso(byZh.get('秋分'))).toBe('2026-9-23');
    expect(iso(byZh.get('冬至'))).toBe('2026-12-22');
  });

  it('uses the Japanese kanji 啓蟄 for 驚蟄', () => {
    const t = solarTermsInYear(2026).find((x) => x.zh === '驚蟄');
    expect(t?.ja).toBe('啓蟄');
  });

  it('solarTermOn finds 立春 on its exact day and nothing on a non-term day', () => {
    expect(solarTermOn(utc(2026, 2, 4))?.zh).toBe('立春');
    expect(solarTermOn(utc(2026, 2, 5))).toBeUndefined();
  });
});
