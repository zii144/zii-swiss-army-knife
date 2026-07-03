import { describe, it, expect } from 'vitest';
import { gcd, lcm } from '../src/math';

describe('gcd/lcm', () => {
  it('computes gcd and lcm', () => {
    expect(gcd(48, 18)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
  });
});
