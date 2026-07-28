import { test, expect } from '@playwright/test';

// Document structure has to survive the handover from prerendered HTML to the
// SPA. These assertions run after hydration, which is where the h1 and the
// main landmark used to disappear: the prerendered markup had both, the React
// views used <h2> and omitted <main> entirely.

const ROUTES = [
  { path: '/en', name: 'home', h1: 'Every tool you need,' },
  { path: '/en/tools', name: 'tools index', h1: 'Pick a tool' },
  { path: '/en/tools/category/pdf', name: 'category', h1: 'PDF' },
  { path: '/en/tools/pdf-merge', name: 'tool', h1: 'Merge PDF' },
];

for (const route of ROUTES) {
  test(`${route.name} has exactly one h1 and one main landmark`, async ({ page }) => {
    await page.goto(route.path);
    // Wait for the SPA to take over before asserting on structure.
    await expect(page.locator('.app__nav-right')).toBeVisible();

    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s.first()).toContainText(route.h1);
    await expect(page.locator('main')).toHaveCount(1);
  });
}

test('catalog headings descend without skipping a level', async ({ page }) => {
  await page.goto('/en/tools/category/pdf');
  // The catalogue is a lazy chunk; until it resolves <main> holds only the
  // Suspense fallback. A focused category always renders one category group
  // (sub-groups are optional, so they are not a safe wait target).
  await expect(page.locator('main .catgroup__title').first()).toBeVisible();

  const levels = await page.evaluate(() =>
    [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')].map(
      (h) => Number(h.tagName[1]),
    ),
  );

  expect(levels[0], 'first heading in main should be the h1').toBe(1);
  for (let i = 1; i < levels.length; i += 1) {
    expect(
      levels[i]! - levels[i - 1]!,
      `heading ${i} jumps more than one level`,
    ).toBeLessThanOrEqual(1);
  }
});

test('the tool h1 tracks the selected tool across client-side navigation', async ({ page }) => {
  await page.goto('/en/tools/pdf-merge');
  await expect(page.locator('h1')).toHaveText(/Merge PDF/);

  // The in-tool sidebar navigates without a document reload.
  await page.locator('.toolnav').getByText('Split PDF', { exact: true }).click();
  await expect(page).toHaveURL(/pdf-split$/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(/Split PDF/);
});
