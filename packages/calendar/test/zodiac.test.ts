import { describe, it, expect } from 'vitest';
import { chineseZodiac, ZODIAC_ANIMALS } from '../src/index';

describe('chineseZodiac', () => {
  it('2026 === horse (golden anchor)', () => {
    expect(chineseZodiac(2026)).toBe('horse');
  });

  it('2020 === rat (baseline)', () => {
    expect(chineseZodiac(2020)).toBe('rat');
  });

  it('advances correctly across the cycle', () => {
    expect(chineseZodiac(2021)).toBe('ox');
    expect(chineseZodiac(2022)).toBe('tiger');
    expect(chineseZodiac(2031)).toBe('pig');
    expect(chineseZodiac(2032)).toBe('rat'); // wraps after 12
  });

  it('handles years before the baseline (negative modulo)', () => {
    expect(chineseZodiac(2008)).toBe('rat'); // 2008 = 2020 - 12
    expect(chineseZodiac(2019)).toBe('pig');
  });

  it('always returns one of the 12 known animals', () => {
    for (let y = 1900; y <= 2100; y += 1) {
      expect(ZODIAC_ANIMALS).toContain(chineseZodiac(y));
    }
  });
});
