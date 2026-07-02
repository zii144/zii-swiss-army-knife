import { describe, it, expect } from 'vitest';
import { validateTwArc, generateTwArc } from '../src/index';

describe('validateTwArc', () => {
  it('accepts generated ARC numbers', () => {
    for (let seed = 0; seed < 50; seed++) {
      const id = generateTwArc(seed);
      expect(id).toMatch(/^[A-Z][89]\d{8}$/);
      expect(validateTwArc(id)).toBe(true);
    }
  });

  it('rejects National-ID gender digits', () => {
    expect(validateTwArc('A123456789')).toBe(false);
  });
});

describe('generateTwArc', () => {
  it('is deterministic for a given seed', () => {
    expect(generateTwArc(11)).toBe(generateTwArc(11));
  });
});
