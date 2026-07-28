import { describe, expect, it } from 'vitest';
import { typeaheadIndex } from '../src/components/ui/Select';

// The app has no DOM-testing stack (see test/error-boundary.test.ts), so the
// Select's option-matching is exercised as the pure function it is. The ARIA
// wiring around it is covered by e2e/select-a11y.spec.ts.
const LANGS = ['English', 'Español', 'Français', 'Deutsch', '日本語', '한국어'];

describe('typeaheadIndex', () => {
  it('jumps to the first option starting with the typed character', () => {
    expect(typeaheadIndex(LANGS, 'f', 0)).toBe(2);
    expect(typeaheadIndex(LANGS, 'd', 0)).toBe(3);
  });

  it('is case-insensitive', () => {
    expect(typeaheadIndex(LANGS, 'E', 5)).toBe(0);
    expect(typeaheadIndex(LANGS, 'e', 5)).toBe(0);
  });

  it('narrows as the search string grows, re-testing the current option', () => {
    const opts = ['Sydney', 'Seoul', 'Sapporo'];
    // "s" from index 0 advances to the next S-option...
    expect(typeaheadIndex(opts, 's', 0)).toBe(1);
    // ...but "se" is a growing search, so it matches Seoul from where we are.
    expect(typeaheadIndex(opts, 'se', 1)).toBe(1);
    expect(typeaheadIndex(opts, 'sa', 1)).toBe(2);
  });

  it('cycles through options sharing an initial when the same key repeats', () => {
    const opts = ['Alpha', 'Beta', 'Anchor', 'Apex'];
    expect(typeaheadIndex(opts, 'a', 0)).toBe(2);
    expect(typeaheadIndex(opts, 'aa', 2)).toBe(3);
    // Past the last A-option it wraps back to the first.
    expect(typeaheadIndex(opts, 'aaa', 3)).toBe(0);
  });

  it('wraps around the end of the list', () => {
    expect(typeaheadIndex(LANGS, 'e', 4)).toBe(0);
  });

  it('reports no match rather than moving the selection', () => {
    expect(typeaheadIndex(LANGS, 'z', 0)).toBe(-1);
    expect(typeaheadIndex(LANGS, 'xy', 0)).toBe(-1);
  });

  it('matches non-Latin labels', () => {
    expect(typeaheadIndex(LANGS, '日', 0)).toBe(4);
    expect(typeaheadIndex(LANGS, '한', 0)).toBe(5);
  });

  it('handles empty input and empty option lists', () => {
    expect(typeaheadIndex(LANGS, '', 0)).toBe(-1);
    expect(typeaheadIndex([], 'a', 0)).toBe(-1);
  });

  it('stays in range when the active index is the last option', () => {
    const idx = typeaheadIndex(LANGS, 'e', LANGS.length - 1);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(LANGS.length);
  });
});
