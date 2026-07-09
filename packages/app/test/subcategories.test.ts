import { describe, expect, it } from 'vitest';
import { CATALOG } from '../src/lib/catalog';
import { LANGS } from '../src/lib/i18n';
import { SUBCATEGORIES, subGroupsFor, subLabel } from '../src/lib/subcategories';

describe('subcategories', () => {
  const catalogIds = new Set(CATALOG.map((t) => t.id));

  for (const [category, groups] of Object.entries(SUBCATEGORIES)) {
    const catIds = CATALOG.filter((t) => t.category === category).map((t) => t.id);

    describe(category, () => {
      it('references only real tools in this category', () => {
        for (const g of groups!) {
          for (const id of g.tools) {
            expect(catalogIds.has(id), `${id} not in catalogue`).toBe(true);
            const tool = CATALOG.find((t) => t.id === id);
            expect(tool?.category, `${id} is not in "${category}"`).toBe(category);
          }
        }
      });

      it('has no duplicate tool across its sub-groups', () => {
        const seen = new Set<string>();
        for (const g of groups!) {
          for (const id of g.tools) {
            expect(seen.has(id), `${id} listed twice`).toBe(false);
            seen.add(id);
          }
        }
      });

      it('covers every tool in the category (no uncurated "More" bucket)', () => {
        const resolved = subGroupsFor(category, catIds);
        expect(resolved.some((g) => g.key === 'more')).toBe(false);
        const total = resolved.reduce((n, g) => n + g.tools.length, 0);
        expect(total).toBe(catIds.length);
      });
    });
  }

  it('localizes every sub-group label into all supported languages', () => {
    for (const [category, groups] of Object.entries(SUBCATEGORIES)) {
      for (const g of groups!) {
        for (const lang of LANGS) {
          const text = subLabel(g.label, lang);
          expect(text.length, `${category}/${g.key} empty in ${lang}`).toBeGreaterThan(0);
          expect(g.label[lang], `${category}/${g.key} missing ${lang}`).toBeDefined();
        }
      }
    }
  });

  it('localizes the trailing "More" bucket into all supported languages', () => {
    // Force a leftover so subGroupsFor emits the "more" group.
    const groups = subGroupsFor('generator', ['qr-generate', 'not-a-real-tool']);
    const more = groups.find((g) => g.key === 'more');
    expect(more).toBeDefined();
    for (const lang of LANGS) {
      expect(more!.label[lang], `More missing ${lang}`).toBeDefined();
      expect(subLabel(more!.label, lang).length).toBeGreaterThan(0);
    }
  });

  it('returns no sub-groups for an un-subcategorized category', () => {
    expect(subGroupsFor('pdf', ['pdf-merge'])).toEqual([]);
  });
});
