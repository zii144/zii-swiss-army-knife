import { describe, expect, it } from 'vitest';
import { allRoutes, buildPath, parsePath } from '../src/lib/router';
import { buildHead, ROBOTS_INDEX, ROBOTS_NOINDEX } from '../src/lib/seo';

describe('router', () => {
  it('parses category landing pages separately from tool pages', () => {
    expect(parsePath('/en/tools/category/pdf')).toEqual({
      locale: 'en',
      view: 'category',
      toolId: null,
      categoryId: 'pdf',
    });
    expect(parsePath('/en/tools/pdf-merge')).toMatchObject({
      locale: 'en',
      view: 'tool',
      toolId: 'pdf-merge',
      categoryId: null,
    });
  });

  it('builds canonical category paths', () => {
    expect(buildPath('ja', 'category', 'image')).toBe('/ja/tools/category/image');
  });

  it('includes category routes in prerender route generation', () => {
    expect(allRoutes(['pdf-merge'], ['pdf']).map((route) => route.view)).toContain('category');
  });

  it('never emits a notfound route to the prerenderer or sitemap', () => {
    expect(allRoutes(['pdf-merge'], ['pdf']).map((route) => route.view)).not.toContain('notfound');
  });

  // The host rewrites every unmatched path to index.html, so an unvalidated id
  // would render as a real tool page titled with the raw URL segment.
  describe('unknown paths resolve to notfound', () => {
    const cases: Record<string, string> = {
      'unknown tool id': '/en/tools/buy-cheap-things',
      'reflected markup': '/en/tools/%3Cimg%20src%3Dx%3E',
      'unknown category id': '/en/tools/category/not-a-category',
      'bare category segment': '/en/tools/category',
      'extra path segment after a real tool': '/en/tools/pdf-merge/extra',
      'unknown top-level path': '/en/nope',
      'unknown path without a locale': '/nope',
    };
    for (const [name, path] of Object.entries(cases)) {
      it(name, () => {
        expect(parsePath(path)).toMatchObject({ view: 'notfound', toolId: null, categoryId: null });
      });
    }

    it('keeps the locale prefix so the message stays translated', () => {
      expect(parsePath('/ja/tools/nope').locale).toBe('ja');
    });

    it('still resolves the real routes', () => {
      expect(parsePath('/en').view).toBe('home');
      expect(parsePath('/').view).toBe('home');
      expect(parsePath('/de/').view).toBe('home');
      expect(parsePath('/en/tools').view).toBe('tools');
    });
  });

  it('marks notfound noindex with no canonical or alternates', () => {
    const meta = buildHead('https://zii.tools', 'en', 'notfound', null);
    expect(meta.robots).toBe(ROBOTS_NOINDEX);
    expect(meta.canonical).toBe('');
    expect(meta.alternates).toEqual([]);
    expect(meta.jsonLd).toEqual([]);
  });

  it('keeps real routes indexable with a self-referencing canonical', () => {
    const meta = buildHead('https://zii.tools', 'ja', 'tool', 'pdf-merge');
    expect(meta.robots).toBe(ROBOTS_INDEX);
    expect(meta.canonical).toBe('https://zii.tools/ja/tools/pdf-merge');
  });
});
