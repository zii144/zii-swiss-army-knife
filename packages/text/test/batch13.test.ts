import { describe, it, expect } from 'vitest';
import { repeatText } from '../src/repeat';
import { isPalindrome } from '../src/palindrome';
import { removeDiacritics } from '../src/diacritics';
import { joinLines, splitToLines, grepLines, indentLines } from '../src/lines';
import { caesarCipher, textToHex, hexToText } from '../src/cipher';

describe('repeatText', () => {
  it('repeats with separator', () => {
    expect(repeatText('ab', 3, '-')).toBe('ab-ab-ab');
  });
});

describe('isPalindrome', () => {
  it('ignores case and punctuation', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    expect(isPalindrome('hello')).toBe(false);
  });
});

describe('removeDiacritics', () => {
  it('strips accents', () => {
    expect(removeDiacritics('café')).toBe('cafe');
  });
});

describe('line helpers batch13', () => {
  it('joins and splits', () => {
    expect(joinLines('a\nb', ', ')).toBe('a, b');
    expect(splitToLines('a|b', '|')).toBe('a\nb');
  });

  it('greps lines', () => {
    expect(grepLines('cat\ndog\ncats', 'cat')).toBe('cat\ncats');
  });

  it('indents and unindents', () => {
    expect(indentLines('hi', 2)).toBe('  hi');
    expect(indentLines('  hi', -2)).toBe('hi');
  });
});

describe('caesarCipher', () => {
  it('round-trips with decode', () => {
    const enc = caesarCipher('Hello', 3);
    expect(caesarCipher(enc, 3, true)).toBe('Hello');
  });
});

describe('hex', () => {
  it('round-trips', () => {
    expect(hexToText(textToHex('Hi', ' '))).toBe('Hi');
  });
});
