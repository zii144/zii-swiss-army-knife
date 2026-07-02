import { describe, it, expect } from 'vitest';
import { convert } from '../src/units';
import { formatDuration, parseDuration } from '../src/duration';

describe('energy convert', () => {
  it('converts kWh to J', () => {
    expect(convert(1, 'kWh', 'J')).toBe(3_600_000);
  });
});

describe('duration', () => {
  it('formats and parses', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
    expect(parseDuration('1:01:01')).toBe(3661);
    expect(parseDuration('90')).toBe(90);
  });
});
