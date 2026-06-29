import { describe, it, expect } from 'vitest';
import { toSimplified, toTraditional, toTraditionalTaiwan } from '../src/index';

describe('OpenCC 繁簡 conversion (full dictionary)', () => {
  it('converts multi-character phrases, not just single chars', () => {
    expect(toTraditional('简体到繁体的转换')).toBe('簡體到繁體的轉換');
    expect(toSimplified('簡體到繁體的轉換')).toBe('简体到繁体的转换');
  });

  it('round-trips a longer sentence through traditional and back', () => {
    const simp = '我们正在开发一个开源软件项目';
    expect(toSimplified(toTraditional(simp))).toBe(simp);
  });

  it('applies Taiwan vocabulary in toTraditionalTaiwan (軟體/記憶體/滑鼠/程式)', () => {
    expect(toTraditionalTaiwan('软件')).toBe('軟體');
    expect(toTraditionalTaiwan('内存')).toBe('記憶體');
    expect(toTraditionalTaiwan('鼠标')).toBe('滑鼠');
    expect(toTraditionalTaiwan('程序')).toBe('程式');
  });

  it('standard toTraditional keeps mainland-style 軟件 (no idiom remap)', () => {
    // The non-Taiwan mapping does not swap vocabulary, only glyphs.
    expect(toTraditional('软件')).toBe('軟件');
  });

  it('leaves Latin and punctuation untouched', () => {
    expect(toTraditional('hello, 世界!')).toBe('hello, 世界!');
  });
});
