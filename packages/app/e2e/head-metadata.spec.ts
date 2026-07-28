import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// The prerendered HTML and the SPA both write the document head. These tests
// run against the real production build, so they cover the seam between them —
// the place where stale tags survive a client-side route change.

interface HeadState {
  ldCount: number;
  ldTypes: string[];
  canonical: string | null;
  title: string;
}

async function readHead(page: Page): Promise<HeadState> {
  return page.evaluate(() => {
    const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
    const types = scripts.flatMap((s) => {
      const parsed: unknown = JSON.parse(s.textContent ?? 'null');
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list.map((o) => String((o as Record<string, unknown>)?.['@type'] ?? '?'));
    });
    return {
      ldCount: scripts.length,
      ldTypes: types,
      canonical: document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null,
      title: document.title,
    };
  });
}

test('a prerendered page settles on exactly one JSON-LD block', async ({ page }) => {
  await page.goto('/en/tools/pdf-merge');
  await expect(page).toHaveTitle(/Merge PDF/);

  const head = await readHead(page);
  expect(head.ldCount, `JSON-LD blocks: ${head.ldTypes.join(', ')}`).toBe(1);
  expect(head.ldTypes).toContain('SoftwareApplication');
});

test('client-side navigation replaces structured data instead of stacking it', async ({ page }) => {
  await page.goto('/en');
  expect((await readHead(page)).ldTypes).toContain('WebApplication');

  // SPA navigation — no document reload, so anything the previous route left in
  // the head stays unless it is explicitly replaced.
  await page.locator('.app__nav-links').getByText('Tools', { exact: true }).click();
  await expect(page).toHaveURL(/\/en\/tools$/);

  const head = await readHead(page);
  expect(head.ldCount, `JSON-LD blocks: ${head.ldTypes.join(', ')}`).toBe(1);
  expect(head.ldTypes).toContain('CollectionPage');
  // The home page's WebApplication node must not have survived the navigation.
  expect(head.ldTypes).not.toContain('WebApplication');
  expect(head.canonical).toMatch(/\/en\/tools$/);
});

test('every locale keeps a single JSON-LD block', async ({ page }) => {
  for (const locale of ['ja', 'de', 'zh-TW']) {
    await page.goto(`/${locale}/tools/category/pdf`);
    const head = await readHead(page);
    expect(head.ldCount, `${locale}: ${head.ldTypes.join(', ')}`).toBe(1);
  }
});
