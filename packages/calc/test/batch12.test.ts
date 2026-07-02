import { describe, it, expect } from 'vitest';
import { convert } from '../src/units';
import { unixToIso, isoToUnix, parseUnixTimestamp } from '../src/timestamp';

describe('pressure convert', () => {
  it('converts bar to psi', () => {
    expect(convert(1, 'bar', 'psi')).toBeCloseTo(14.5038, 3);
  });
});

describe('timestamp', () => {
  it('converts unix ms to ISO', () => {
    expect(unixToIso(0, 'ms')).toBe('1970-01-01T00:00:00.000Z');
  });

  it('converts ISO to unix', () => {
    expect(isoToUnix('1970-01-01T00:00:00.000Z', 's')).toBe(0);
  });

  it('parses seconds', () => {
    expect(parseUnixTimestamp('1700000000', 's')).toBe(1700000000);
  });
});
