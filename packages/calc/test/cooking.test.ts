import { describe, it, expect } from 'vitest';
import { convertCooking, US_CUP_ML } from '../src/index';

describe('convertCooking', () => {
  it('water: 1 cup ≈ 236.59 g (density 1.0)', () => {
    expect(convertCooking(1, 'water', 'cup', 'gram')).toBeCloseTo(US_CUP_ML, 6);
    expect(convertCooking(1, 'water', 'cup', 'ml')).toBeCloseTo(236.5882365, 6);
  });
  it('flour: 1 cup ≈ 125 g (density 0.529)', () => {
    expect(convertCooking(1, 'flour', 'cup', 'gram')).toBeCloseTo(125.16, 1);
  });
  it('sugar: 1 cup ≈ 200 g (density 0.845)', () => {
    expect(convertCooking(1, 'sugar', 'cup', 'gram')).toBeCloseTo(199.92, 1);
  });
  it('round-trips gram -> ml -> gram for sugar', () => {
    const ml = convertCooking(100, 'sugar', 'gram', 'ml');
    expect(convertCooking(ml, 'sugar', 'ml', 'gram')).toBeCloseTo(100, 9);
  });
  it('identity conversions', () => {
    expect(convertCooking(250, 'water', 'ml', 'ml')).toBe(250);
    expect(convertCooking(2, 'flour', 'cup', 'cup')).toBeCloseTo(2, 9);
  });
});
