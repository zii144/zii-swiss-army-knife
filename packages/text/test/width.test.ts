import { describe, it, expect } from 'vitest';
import { toHalfWidth, toFullWidth, nfkcNormalize } from '../src/index';

describe('toHalfWidth', () => {
  it('converts full-width letters and digits (golden anchor)', () => {
    expect(toHalfWidth('ＡＢＣ１２３')).toBe('ABC123');
  });

  it('converts the ideographic space to a regular space', () => {
    expect(toHalfWidth('Ａ　Ｂ')).toBe('A B');
  });

  it('leaves non-full-width characters untouched', () => {
    expect(toHalfWidth('你好abc')).toBe('你好abc');
  });

  it('converts full-width punctuation', () => {
    expect(toHalfWidth('！？（）')).toBe('!?()');
  });
});

describe('toFullWidth', () => {
  it('converts ASCII letters (golden anchor)', () => {
    expect(toFullWidth('AB')).toBe('ＡＢ');
  });

  it('converts the regular space to an ideographic space', () => {
    expect(toFullWidth('A B')).toBe('Ａ　Ｂ');
  });

  it('round-trips with toHalfWidth', () => {
    expect(toHalfWidth(toFullWidth('Hello, World! 123'))).toBe('Hello, World! 123');
  });
});

describe('nfkcNormalize', () => {
  it('normalizes full-width digits to ASCII', () => {
    expect(nfkcNormalize('１２３')).toBe('123');
  });

  it('composes combining sequences', () => {
    expect(nfkcNormalize('é')).toBe('é');
  });
});
