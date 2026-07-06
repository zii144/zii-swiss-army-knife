import { describe, it, expect } from 'vitest';
import { kanaToRomaji } from '../src/index';

describe('kanaToRomaji — basics', () => {
  it('romanizes gojūon (hiragana & katakana)', () => {
    expect(kanaToRomaji('あいうえお')).toBe('aiueo');
    expect(kanaToRomaji('かきくけこ')).toBe('kakikukeko');
    expect(kanaToRomaji('アイウエオ')).toBe('aiueo');
  });

  it('uses Hepburn spellings for し/ち/つ/ふ/じ', () => {
    expect(kanaToRomaji('しちつふ')).toBe('shichitsufu');
    expect(kanaToRomaji('じぢづ')).toBe('jijizu');
  });

  it('handles dakuten / handakuten', () => {
    expect(kanaToRomaji('がぎぐげご')).toBe('gagigugego');
    expect(kanaToRomaji('ぱぴぷぺぽ')).toBe('papipupepo');
  });
});

describe('kanaToRomaji — yōon (拗音)', () => {
  it('romanizes きゃ/しゃ/ちゃ families', () => {
    expect(kanaToRomaji('きゃきゅきょ')).toBe('kyakyukyo');
    expect(kanaToRomaji('しゃしゅしょ')).toBe('shashusho');
    expect(kanaToRomaji('ちゃちゅちょ')).toBe('chachucho');
    expect(kanaToRomaji('じゃじゅじょ')).toBe('jajujo');
  });
});

describe('kanaToRomaji — sokuon (促音 っ)', () => {
  it('doubles the following consonant', () => {
    expect(kanaToRomaji('がっこう')).toBe('gakkou');
    expect(kanaToRomaji('きっぷ')).toBe('kippu');
    expect(kanaToRomaji('ざっし')).toBe('zasshi');
  });

  it('uses the tch spelling before ち/ちゃ', () => {
    expect(kanaToRomaji('まっちゃ')).toBe('matcha');
    expect(kanaToRomaji('こっち')).toBe('kotchi');
  });
});

describe('kanaToRomaji — ん', () => {
  it('is "n" before consonants', () => {
    expect(kanaToRomaji('こんにちは')).toBe('konnichiha');
    expect(kanaToRomaji('にほん')).toBe('nihon');
  });
  it('is "n\'" before a vowel or y', () => {
    expect(kanaToRomaji('しんゆう')).toBe("shin'yuu");
    expect(kanaToRomaji('きんえん')).toBe("kin'en");
  });
});

describe('kanaToRomaji — long vowels & passthrough', () => {
  it('macronizes the katakana chōonpu ー', () => {
    expect(kanaToRomaji('ラーメン')).toBe('rāmen');
    expect(kanaToRomaji('コーヒー')).toBe('kōhī');
    expect(kanaToRomaji('コンピューター')).toBe('konpyūtā');
  });

  it('keeps hiragana vowel sequences literal', () => {
    expect(kanaToRomaji('とうきょう')).toBe('toukyou');
  });

  it('passes through non-kana unchanged', () => {
    expect(kanaToRomaji('ABC 123!')).toBe('ABC 123!');
    expect(kanaToRomaji('東京タワー')).toBe('東京tawā');
  });

  it('handles empty input', () => {
    expect(kanaToRomaji('')).toBe('');
  });
});
