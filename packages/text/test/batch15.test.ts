import { describe, it, expect } from 'vitest';
import { truncateText, padText } from '../src/pad';
import { removeZeroWidth, findZeroWidth } from '../src/invisible';
import { stripMarkdown } from '../src/markdown';
import { atbash } from '../src/cipher';

describe('pad', () => {
  it('truncates and pads', () => {
    expect(truncateText('hello world', 8)).toBe('hello w…');
    expect(padText('42', 5, 'right', '0')).toBe('00042');
  });
});

describe('invisible', () => {
  it('removes zero-width chars', () => {
    expect(removeZeroWidth('a\u200Bb')).toBe('ab');
    expect(findZeroWidth('a\u200Bb')).toEqual(['U+200B']);
  });
});

describe('stripMarkdown', () => {
  it('strips headings and bold', () => {
    expect(stripMarkdown('# Title\n\n**bold** text')).toBe('Title\n\nbold text');
  });
});

describe('atbash', () => {
  it('is self-inverse', () => {
    expect(atbash(atbash('Hello'))).toBe('Hello');
  });
});
