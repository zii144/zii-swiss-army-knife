import { describe, it, expect } from 'vitest';
import { convert } from '../src/index';

describe('convert: length', () => {
  it('miles to km (golden anchor)', () => {
    expect(convert(1, 'mi', 'km')).toBe(1.609344);
  });
  it('round-trips m/ft/in/yd', () => {
    expect(convert(1, 'm', 'm')).toBe(1);
    expect(convert(3, 'ft', 'yd')).toBeCloseTo(1, 10);
    expect(convert(12, 'in', 'ft')).toBeCloseTo(1, 10);
    expect(convert(1000, 'm', 'km')).toBe(1);
  });
});

describe('convert: mass', () => {
  it('converts kg/g/lb/oz/st', () => {
    expect(convert(1, 'kg', 'g')).toBe(1000);
    expect(convert(1, 'lb', 'oz')).toBeCloseTo(16, 10);
    expect(convert(1, 'st', 'lb')).toBeCloseTo(14, 10);
  });
});

describe('convert: temperature', () => {
  it('0C and 100C to Fahrenheit (golden anchors)', () => {
    expect(convert(0, 'C', 'F')).toBe(32);
    expect(convert(100, 'C', 'F')).toBe(212);
  });
  it('C/K relationship', () => {
    expect(convert(0, 'C', 'K')).toBeCloseTo(273.15, 10);
    expect(convert(212, 'F', 'C')).toBeCloseTo(100, 10);
  });
});

describe('convert: volume — US vs imperial kept distinct', () => {
  it('1 usGal vs 1 impGal give different litres', () => {
    expect(convert(1, 'usGal', 'l')).toBeCloseTo(3.785411784, 9);
    expect(convert(1, 'impGal', 'l')).toBeCloseTo(4.54609, 9);
    expect(convert(1, 'usGal', 'l')).not.toBe(convert(1, 'impGal', 'l'));
  });
  it('pints and cups', () => {
    expect(convert(1, 'l', 'ml')).toBe(1000);
    expect(convert(1, 'usPint', 'l')).toBeCloseTo(0.473176473, 9);
    expect(convert(1, 'impPint', 'l')).toBeCloseTo(0.56826125, 9);
    expect(convert(1, 'usCup', 'ml')).toBeCloseTo(236.5882365, 7);
  });
});

describe('convert: area', () => {
  it('converts m2/ft2/acre/ha', () => {
    expect(convert(1, 'ha', 'm2')).toBe(10000);
    expect(convert(1, 'acre', 'm2')).toBeCloseTo(4046.8564224, 7);
    expect(convert(1, 'm2', 'ft2')).toBeCloseTo(10.7639104, 6);
  });
});

describe('convert: speed', () => {
  it('converts kmh/mph/ms', () => {
    expect(convert(3.6, 'kmh', 'ms')).toBeCloseTo(1, 10);
    expect(convert(1, 'mph', 'kmh')).toBeCloseTo(1.609344, 9);
  });
});

describe('convert: data — SI vs IEC distinct', () => {
  it('decimal prefixes', () => {
    expect(convert(1, 'KB', 'B')).toBe(1000);
    expect(convert(1, 'MB', 'KB')).toBe(1000);
  });
  it('binary prefixes', () => {
    expect(convert(1, 'KiB', 'B')).toBe(1024);
    expect(convert(1, 'GiB', 'MiB')).toBe(1024);
  });
});

describe('convert: errors', () => {
  it('throws on cross-dimension conversion', () => {
    // 'm' (length) and 'kg' (mass) are both valid units but different dimensions.
    expect(() => convert(1, 'm', 'kg')).toThrow();
  });
  it('throws on unknown unit', () => {
    // @ts-expect-error intentional unknown unit
    expect(() => convert(1, 'furlong', 'm')).toThrow();
  });
});
