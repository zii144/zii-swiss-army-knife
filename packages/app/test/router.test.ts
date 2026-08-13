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
      expect(parsePath('/en/privacy').view).toBe('privacy');
      expect(parsePath('/ja/terms').view).toBe('terms');
      expect(parsePath('/de/legal').view).toBe('legal');
      expect(parsePath('/zh-TW/about').view).toBe('about');
    });
  });

  it('builds legal paths without a /tools prefix', () => {
    expect(buildPath('en', 'privacy')).toBe('/en/privacy');
    expect(buildPath('de', 'legal')).toBe('/de/legal');
  });

  it('includes legal routes in prerender generation', () => {
    const views = allRoutes(['pdf-merge'], ['pdf']).map((route) => route.view);
    expect(views).toContain('privacy');
    expect(views).toContain('terms');
    expect(views).toContain('about');
    expect(views).toContain('legal');
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

  it('does not claim server-side non-retention on network tools', () => {
    const meta = buildHead('https://zii.tools', 'en', 'tool', 'ocr');
    const app = meta.jsonLd.find(
      (node) => (node as { '@type'?: string })['@type'] === 'SoftwareApplication',
    ) as { featureList?: string[] };
    expect(app.featureList).toContain('May download a model or use an optional conversion worker');
    expect(app.featureList).not.toContain('No server-side data retention');
  });

  it('keeps the on-device retention claim for offline tools', () => {
    const meta = buildHead('https://zii.tools', 'en', 'tool', 'pdf-merge');
    const app = meta.jsonLd.find(
      (node) => (node as { '@type'?: string })['@type'] === 'SoftwareApplication',
    ) as { featureList?: string[] };
    expect(app.featureList).toContain('No server-side data retention');
  });

  it('indexes legal pages with a WebPage node', () => {
    const meta = buildHead('https://zii.tools', 'en', 'privacy', null);
    expect(meta.robots).toBe(ROBOTS_INDEX);
    expect(meta.canonical).toBe('https://zii.tools/en/privacy');
    expect(meta.jsonLd.some((node) => (node as { '@type'?: string })['@type'] === 'WebPage')).toBe(
      true,
    );
  });
});
