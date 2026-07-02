import { describe, it, expect } from 'vitest';
import {
  convertBase,
  decodeJwt,
  evalExpression,
  explainCron,
  parseColor,
  passwordBits,
  randomPassword,
  rgbToHex,
  rgbToHsl,
  uuidV4,
} from '../src/lib/toolkit';

describe('convertBase', () => {
  it('converts across bases', () => {
    expect(convertBase('255', 10, 16)).toBe('ff');
    expect(convertBase('ff', 16, 2)).toBe('11111111');
    expect(convertBase('11111111', 2, 10)).toBe('255');
    expect(convertBase('-10', 10, 2)).toBe('-1010');
  });
  it('rejects invalid digits', () => {
    expect(() => convertBase('2', 2, 10)).toThrow();
  });
});

describe('password', () => {
  it('respects length and charset', () => {
    const p = randomPassword({ length: 20, lower: true, upper: false, digits: true, symbols: false });
    expect(p).toHaveLength(20);
    expect(/^[a-z2-9]+$/.test(p)).toBe(true);
  });
  it('estimates entropy bits', () => {
    expect(passwordBits({ length: 10, lower: true, upper: true, digits: true, symbols: true })).toBeGreaterThan(50);
  });
});

describe('uuidV4', () => {
  it('has v4 shape', () => {
    expect(uuidV4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe('color', () => {
  it('parses and converts', () => {
    expect(rgbToHex(parseColor('#fff')!)).toBe('#ffffff');
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });
});

describe('decodeJwt', () => {
  it('decodes header and payload', () => {
    // {"alg":"HS256"} . {"sub":"42","name":"Zii"} . sig
    const t =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJaaWkifQ.abc';
    const { header, payload } = decodeJwt(t);
    expect(header).toEqual({ alg: 'HS256' });
    expect(payload).toEqual({ sub: '42', name: 'Zii' });
  });
});

describe('explainCron', () => {
  it('describes common schedules', () => {
    expect(explainCron('0 9 * * 1')).toContain('09:00');
    expect(explainCron('0 9 * * 1')).toContain('Mon');
    expect(explainCron('* * * * *')).toContain('every minute');
    expect(() => explainCron('0 9 * *')).toThrow();
  });
});

describe('evalExpression', () => {
  it('evaluates arithmetic with precedence', () => {
    expect(evalExpression('2 + 3 * 4')).toBe(14);
    expect(evalExpression('(2 + 3) * 4')).toBe(20);
    expect(evalExpression('2 ^ 3 ^ 2')).toBe(512); // right-assoc
    expect(evalExpression('-5 + 3')).toBe(-2);
    expect(evalExpression('10 % 3')).toBe(1);
  });
  it('supports functions and constants', () => {
    expect(evalExpression('sqrt(16)')).toBe(4);
    expect(Math.round(evalExpression('sin(pi / 2)'))).toBe(1);
    expect(evalExpression('log(1000)')).toBeCloseTo(3, 6);
  });
  it('throws on malformed input', () => {
    expect(() => evalExpression('2 +')).toThrow();
    expect(() => evalExpression('foo(2)')).toThrow();
  });
});
