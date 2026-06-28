import { describe, it, expect } from 'vitest';
import { countText } from '../src/index';

describe('countText', () => {
  it('counts han characters (golden anchor)', () => {
    expect(countText('你好 world').byScript.han).toBe(2);
  });

  it('counts chars, charsNoSpaces, lines, and words', () => {
    const c = countText('hello world\nfoo bar');
    expect(c.chars).toBe(19);
    expect(c.charsNoSpaces).toBe(16);
    expect(c.lines).toBe(2);
    expect(c.words).toBe(4);
  });

  it('returns zeros for an empty string', () => {
    const c = countText('');
    expect(c.chars).toBe(0);
    expect(c.charsNoSpaces).toBe(0);
    expect(c.lines).toBe(0);
    expect(c.words).toBe(0);
  });

  it('breaks down a mixed-script string', () => {
    const c = countText('漢字ひらがなカタカナabc123!');
    expect(c.byScript.han).toBe(2);
    expect(c.byScript.hiragana).toBe(4);
    expect(c.byScript.katakana).toBe(4);
    expect(c.byScript.latin).toBe(3);
    expect(c.byScript.digit).toBe(3);
    expect(c.byScript.punct).toBe(1);
    expect(c.byScript.other).toBe(0);
  });

  it('counts emoji and unknown scripts as other (one char each)', () => {
    const c = countText('😀é');
    expect(c.chars).toBe(2);
    expect(c.byScript.other).toBe(2);
  });
});
