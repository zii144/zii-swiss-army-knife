import { describe, it, expect } from 'vitest';
import { textToHex, hexToText, rot47, unicodeEscape, unicodeUnescape } from '../src/cipher';
import { reverseWords, tabsToSpaces, spacesToTabs } from '../src/words';
import { hammingDistance } from '../src/distance';
import { charFrequency } from '../src/freq';
import { affixLines } from '../src/lines';

describe('hex', () => {
  it('round-trips', () => {
    expect(hexToText(textToHex('Hi'))).toBe('Hi');
  });
});

describe('rot47', () => {
  it('is self-inverse', () => {
    expect(rot47(rot47('Hello!'))).toBe('Hello!');
  });
});

describe('unicode escape', () => {
  it('round-trips café', () => {
    expect(unicodeUnescape(unicodeEscape('café'))).toBe('café');
  });
});

describe('words', () => {
  it('reverses words and converts tabs', () => {
    expect(reverseWords('one two three')).toBe('three two one');
    expect(tabsToSpaces('a\tb', 4)).toBe('a    b');
    expect(spacesToTabs('    hi', 4)).toBe('\thi');
  });
});

describe('hammingDistance', () => {
  it('counts diffs', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });
});

describe('charFrequency', () => {
  it('counts chars', () => {
    expect(charFrequency('aab', 10)[0]).toEqual({ word: 'a', count: 2 });
  });
});

describe('affixLines', () => {
  it('adds prefix and suffix', () => {
    expect(affixLines('a\nb', '- ', ' ;')).toBe('- a ;\n- b ;');
  });
});
