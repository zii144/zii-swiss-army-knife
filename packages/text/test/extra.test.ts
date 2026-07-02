import { describe, it, expect } from 'vitest';
import { slugify } from '../src/slug';
import { dedupeLines, sortLines, normalizeText, reverseText } from '../src/lines';
import { loremIpsum } from '../src/lorem';
import { toRoman, fromRoman } from '../src/roman';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });
});

describe('dedupeLines', () => {
  it('removes duplicate lines', () => {
    expect(dedupeLines('a\nb\na')).toBe('a\nb');
  });
});

describe('sortLines', () => {
  it('sorts ascending', () => {
    expect(sortLines('b\na', 'asc')).toBe('a\nb');
  });
});

describe('normalizeText', () => {
  it('trims and collapses blank lines', () => {
    expect(normalizeText('  hi  \n\n\n  there ')).toBe('hi\n\nthere');
  });
});

describe('reverseText', () => {
  it('reverses characters', () => {
    expect(reverseText('abc')).toBe('cba');
  });
});

describe('loremIpsum', () => {
  it('generates paragraphs', () => {
    const t = loremIpsum(2, 10);
    expect(t.split('\n\n').length).toBe(2);
  });
});

describe('roman', () => {
  it('round-trips', () => {
    expect(toRoman(2024)).toBe('MMXXIV');
    expect(fromRoman('MMXXIV')).toBe(2024);
  });
});
