import { describe, it, expect } from 'vitest';
import { convert } from '../src/units';

describe('power convert', () => {
  it('converts hp to watts', () => {
    expect(convert(1, 'hp', 'W')).toBeCloseTo(745.7, 0);
  });
});

describe('frequency convert', () => {
  it('converts MHz to Hz', () => {
    expect(convert(1, 'MHz', 'Hz')).toBe(1_000_000);
  });
});

describe('mass convert', () => {
  it('converts kg to lb', () => {
    expect(convert(1, 'kg', 'lb')).toBeCloseTo(2.20462, 4);
  });
});
