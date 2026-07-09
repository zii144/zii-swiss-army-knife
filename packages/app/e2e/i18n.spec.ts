import { test, expect } from '@playwright/test';

// Every UI language must route, render, and switch — with the right <html lang>,
// localized nav, and no runtime errors (incl. CJK/accented rendering).
const LOCALES = [
  { code: 'en', tools: 'Tools', label: 'English' },
  { code: 'zh-TW', tools: '工具', label: '繁體中文（台灣）' },
  { code: 'zh-HK', tools: '工具', label: '繁體中文（香港）' },
  { code: 'ja', tools: 'ツール', label: '日本語' },
  { code: 'ko', tools: '도구', label: '한국어' },
  { code: 'es', tools: 'Herramientas', label: 'Español' },
  { code: 'fr', tools: 'Outils', label: 'Français' },
  { code: 'de', tools: 'Werkzeuge', label: 'Deutsch' },
];

const ignore = /favicon|manifest|service ?worker|net::|\[vite\]|\[hmr\]|failed to load resource/i;

for (const l of LOCALES) {
  test(`locale ${l.code}: routes, localized nav, no errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error' && !ignore.test(m.text())) errors.push(m.text());
    });

    await page.goto(`/${l.code}`);
    await expect(page.locator('html')).toHaveAttribute('lang', l.code);
    await expect(
      page.locator('.app__nav-links').getByText(l.tools, { exact: true }),
    ).toBeVisible();

    await page.goto(`/${l.code}/tools`);
    await expect(page.locator('.cathub')).toBeVisible();

    expect(errors, `${l.code} errors: ${errors.join(' | ')}`).toEqual([]);
  });
}

test('Japanese tool names render (not English fallback)', async ({ page }) => {
  await page.goto('/ja/tools/category/convert');
  await expect(page.getByText('面積変換')).toBeVisible(); // area-convert
  await expect(page.getByText('温度変換')).toBeVisible(); // temperature-convert
});

test('language switcher changes locale and content', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('.ui-select--pill .ui-select__trigger').click();
  await page.getByRole('option', { name: '日本語' }).click();

  await expect(page).toHaveURL(/\/ja(\/|$)/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('.app__nav-links').getByText('ツール', { exact: true })).toBeVisible();
});
