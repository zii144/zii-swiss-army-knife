import { describe, expect, it } from 'vitest';
import { CATALOG, localizedName } from '../src/lib/catalog';
import { NAME_OVERRIDES } from '../src/lib/tool-names-extra';

// Format names and bare algorithm identifiers stay English in every language.
const INTENTIONAL_EN = new Set([
  'json-csv',
  'json-yaml',
  'xml-json',
  'csv-excel',
  'heic-convert',
  'rot13',
  'rot47',
  'soundex',
  'quoted-printable',
]);

describe('tool-name overrides', () => {
  const ids = new Set(CATALOG.map((t) => t.id));

  it('only reference real tool ids', () => {
    for (const [lang, map] of Object.entries(NAME_OVERRIDES)) {
      for (const id of Object.keys(map!)) {
        expect(ids.has(id), `${lang}:${id} not in catalogue`).toBe(true);
      }
    }
  });

  it('actually override localizedName', () => {
    expect(localizedName('area-convert', 'ja')).toBe('面積変換');
    expect(localizedName('ca-sin', 'zh-HK')).toBe('加拿大社會保險號碼（SIN）');
    // Untouched languages still fall back to English.
    expect(localizedName('area-convert', 'en')).toBe('Area converter');
  });

  it('give Japanese a display name for every tool except the intentional-English set', () => {
    const stillEnglish = CATALOG.filter((t) => {
      const ja = (t.name as Record<string, string>).ja ?? NAME_OVERRIDES.ja?.[t.id];
      return !ja;
    }).map((t) => t.id);
    // Every remaining English name must be a deliberate one.
    for (const id of stillEnglish) {
      expect(INTENTIONAL_EN.has(id), `${id} still falls back to English`).toBe(true);
    }
  });
});
