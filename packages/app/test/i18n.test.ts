import { describe, it, expect } from 'vitest';
import { DICTIONARY, LANGS, LANG_LABELS, useT } from '../src/lib/i18n';

describe('i18n', () => {
  it('translates for each supported language', () => {
    expect(useT('en')('title')).toBe(DICTIONARY.en.title);
    expect(useT('zh-TW')('searchPlaceholder')).toBe(DICTIONARY['zh-TW'].searchPlaceholder);
  });

  it('exposes a label for every language', () => {
    for (const l of LANGS) {
      expect(LANG_LABELS[l].length).toBeGreaterThan(0);
    }
  });

  it('keeps dictionaries key-aligned across languages', () => {
    const enKeys = Object.keys(DICTIONARY.en).sort();
    const twKeys = Object.keys(DICTIONARY['zh-TW']).sort();
    expect(twKeys).toEqual(enKeys);
  });
});
