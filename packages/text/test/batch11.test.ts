import { describe, it, expect } from 'vitest';
import { extractEmails, extractUrls } from '../src/extract';
import { rot13, jsonEscapeString, jsonUnescapeString } from '../src/cipher';
import { wordFrequency } from '../src/freq';
import { findReplace, shuffleLines } from '../src/lines';
import { nanoid } from '../src/nanoid';

describe('extract', () => {
  it('finds emails and urls', () => {
    expect(extractEmails('Contact ann@example.com')).toEqual(['ann@example.com']);
    expect(extractUrls('See https://zii.app now')).toEqual(['https://zii.app']);
  });
});

describe('rot13', () => {
  it('is self-inverse', () => {
    expect(rot13(rot13('Hello'))).toBe('Hello');
  });
});

describe('json escape', () => {
  it('round-trips quotes and newlines', () => {
    const s = 'line\n"quote"';
    expect(jsonUnescapeString(jsonEscapeString(s))).toBe(s);
  });
});

describe('wordFrequency', () => {
  it('counts words', () => {
    expect(wordFrequency('a a b', 10)).toEqual([
      { word: 'a', count: 2 },
      { word: 'b', count: 1 },
    ]);
  });
});

describe('findReplace', () => {
  it('replaces literally and by regex', () => {
    expect(findReplace('foo bar', 'bar', 'baz', false)).toBe('foo baz');
    expect(findReplace('a1 b2', '\\d', 'X', true)).toBe('aX bX');
  });
});

describe('shuffleLines', () => {
  it('preserves line count', () => {
    expect(shuffleLines('a\nb\nc').split('\n').sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('nanoid', () => {
  it('generates requested length', () => {
    expect(nanoid(12)).toHaveLength(12);
  });
});
