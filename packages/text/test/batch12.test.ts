import { describe, it, expect } from 'vitest';
import { trimLines, removeEmptyLines, numberLines } from '../src/lines';
import { wrapText } from '../src/wrap';
import { morseEncode, morseDecode } from '../src/morse';
import { textToBinary, binaryToText } from '../src/cipher';
import { levenshtein } from '../src/distance';
import { stripHtml } from '../src/html';

describe('line helpers', () => {
  it('trims and removes empty lines', () => {
    expect(trimLines('  a  \n b ')).toBe('a\nb');
    expect(removeEmptyLines('a\n\n b\n  \nc')).toBe('a\n b\nc');
  });

  it('numbers lines', () => {
    expect(numberLines('a\nb', 1, '. ')).toBe('1. a\n2. b');
  });
});

describe('wrapText', () => {
  it('wraps at width', () => {
    expect(wrapText('one two three four', 7)).toBe('one two\nthree\nfour');
  });
});

describe('morse', () => {
  it('round-trips SOS', () => {
    expect(morseDecode(morseEncode('SOS'))).toBe('SOS');
  });
});

describe('binary', () => {
  it('round-trips ASCII', () => {
    const bin = textToBinary('Hi');
    expect(binaryToText(bin)).toBe('Hi');
  });
});

describe('levenshtein', () => {
  it('counts edits', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
});

describe('stripHtml', () => {
  it('removes tags', () => {
    expect(stripHtml('<p>Hi <b>there</b></p>')).toBe('Hi\nthere');
  });
});
