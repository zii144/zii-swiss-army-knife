import { describe, expect, it } from 'vitest';
import { HOLIDAYS_ISO_2026 } from '../src/lib/holidays-2026';
import { ID_COMMON } from '../src/tools/idStrings';

describe('holiday tables', () => {
  it('exports ISO dates for 2026', () => {
    expect(HOLIDAYS_ISO_2026.length).toBeGreaterThan(20);
    expect(HOLIDAYS_ISO_2026.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
    expect(HOLIDAYS_ISO_2026).toContain('2026-01-01');
  });
});

describe('ID generate labels', () => {
  it('marks generated values as test samples in every UI language', () => {
    expect(ID_COMMON.en.generate.toLowerCase()).toContain('test');
    expect(ID_COMMON['zh-TW'].generate).toContain('測試');
    expect(ID_COMMON.ja.generate).toContain('テスト');
    expect(ID_COMMON.de.generate.toLowerCase()).toContain('test');
  });
});
