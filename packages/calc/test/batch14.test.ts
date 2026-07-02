import { describe, it, expect } from 'vitest';
import { convert } from '../src/units';

describe('angle convert', () => {
  it('converts degrees to radians', () => {
    expect(convert(180, 'deg', 'rad')).toBeCloseTo(Math.PI, 10);
  });

  it('converts gradians', () => {
    expect(convert(200, 'grad', 'deg')).toBeCloseTo(180, 10);
  });
});

describe('volume convert', () => {
  it('converts litres to us gallons', () => {
    expect(convert(3.785411784, 'l', 'usGal')).toBeCloseTo(1, 6);
  });
});
