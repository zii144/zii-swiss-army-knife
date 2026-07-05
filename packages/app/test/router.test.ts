import { describe, expect, it } from 'vitest';
import { allRoutes, buildPath, parsePath } from '../src/lib/router';

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
});
