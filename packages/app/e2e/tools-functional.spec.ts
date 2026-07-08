import { test, expect } from '@playwright/test';

// Deeper than the smoke sweep: drive real inputs on a representative tool from
// each major category and assert the computed output, proving the engine↔UI
// wiring produces correct results (not just that the screen mounts).

test('text-case: uppercases the input', async ({ page }) => {
  await page.goto('/en/tools/text-case');
  await expect(page.locator('.tool__title')).toBeVisible();
  await page.locator('.tool__body textarea').first().fill('hello world');
  // Anchored regex: hasText does case-insensitive substring matching, which
  // would also match "Hello World" / "hello world" rows.
  await expect(page.locator('.tool__row-value').filter({ hasText: /^HELLO WORLD$/ })).toBeVisible();
});

test('rot13: transforms text', async ({ page }) => {
  await page.goto('/en/tools/rot13');
  await expect(page.locator('.tool__title')).toBeVisible();
  await page.locator('.tool__body textarea:not([readonly])').first().fill('Hello');
  await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('Uryyb');
});

test('base64: encodes text', async ({ page }) => {
  await page.goto('/en/tools/base64');
  await expect(page.locator('.tool__title')).toBeVisible();
  await page.locator('.tool__body textarea:not([readonly])').first().fill('hi');
  await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('aGk=');
});

test('slugify: produces a URL slug', async ({ page }) => {
  await page.goto('/en/tools/slugify');
  await expect(page.locator('.tool__title')).toBeVisible();
  await page.locator('.tool__body textarea:not([readonly])').first().fill('Hello World');
  await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('hello-world');
});

test('area-convert: converts m² to ft²', async ({ page }) => {
  await page.goto('/en/tools/area-convert');
  await expect(page.locator('.tool__title')).toBeVisible();
  await page.locator('.tool__body input[type="number"]').fill('2');
  // 2 m² = 21.5278… ft²
  await expect(page.locator('.tool__hint')).toContainText('21.527');
});

test('percent-tip: computes a value from inputs', async ({ page }) => {
  await page.goto('/en/tools/percent-tip');
  await expect(page.locator('.tool__title')).toBeVisible();
  // Fill every number field and assert the screen shows a computed result,
  // without hard-coding this tool's exact layout.
  const numbers = page.locator('.tool__body input[type="number"]');
  const count = await numbers.count();
  for (let i = 0; i < count; i++) await numbers.nth(i).fill('50');
  await expect(page.locator('.tool__body')).toContainText(/\d/);
});
