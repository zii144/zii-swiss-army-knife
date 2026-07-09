import { test, expect } from '@playwright/test';

// The /tools route is a browsable category hub (not a 170-tool wall), with a
// drill-down per category and search as the flat fast-path.

test('tools route shows the category hub', async ({ page }) => {
  await page.goto('/en/tools');
  await expect(page.locator('.cathub')).toBeVisible();
  expect(await page.locator('.catcard').count()).toBeGreaterThanOrEqual(10);
});

test('clicking a category card drills into that category', async ({ page }) => {
  await page.goto('/en/tools');
  await page.locator('.catcard').first().click();
  await expect(page).toHaveURL(/\/tools\/category\//);
  await expect(page.locator('.cathub')).toHaveCount(0);
  await expect(page.locator('.catgroup')).toBeVisible();
  await expect(page.locator('.catgroup .app__item').first()).toBeVisible();
});

test('searching bypasses the hub for flat results', async ({ page }) => {
  await page.goto('/en/tools');
  await page.locator('.app__search').fill('pdf');
  await expect(page.locator('.cathub')).toHaveCount(0);
  await expect(page.locator('.app__item').first()).toBeVisible();
});

test('a large category page is split into scannable sub-sections', async ({ page }) => {
  await page.goto('/en/tools/category/dev');
  await expect(page.locator('.catgroup__title')).toHaveText('Developer');
  expect(await page.locator('.subgroup__title').count()).toBeGreaterThanOrEqual(3);
  await expect(page.getByText('JSON & data formats')).toBeVisible();
  await expect(page.getByText('Encoding & escaping')).toBeVisible();
});

test('View all from home lands at the top of /tools', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.locator('.hero__viewall').click();
  await expect(page).toHaveURL(/\/en\/tools$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
});
