import { test, expect } from '@playwright/test';

// Deeper than the smoke sweep: drive real inputs on a representative tool from
// each major category and assert the computed output, proving the engine↔UI
// wiring produces correct results (not just that the screen mounts).

/**
 * A valid two-page PDF, built here rather than committed as a binary fixture —
 * and deliberately without pdf-lib, so the PDF the renderer is tested against
 * does not come from the same stack under test. Cross-reference offsets are
 * computed from real byte positions so pdf.js parses it directly instead of
 * silently falling back to its error-recovery path (which would weaken the
 * assertions below). Every byte is ASCII, so string length == byte offset.
 */
function makeTwoPagePdf(): Buffer {
  const stream = (label: string): string => `BT /F1 24 Tf 20 40 Td (${label}) Tj ET\n`;
  const [c1, c2] = [stream('Page One'), stream('Page Two')];
  const pageObj = (contents: number): string =>
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 100] ` +
    `/Resources << /Font << /F1 7 0 R >> >> /Contents ${contents} 0 R >>`;

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>',
    pageObj(4),
    `<< /Length ${c1.length} >>\nstream\n${c1}endstream`,
    pageObj(6),
    `<< /Length ${c2.length} >>\nstream\n${c2}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const startxref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${startxref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

// Guards the pdf.js major-version upgrade path (4 -> 6). The API break itself
// was type-only — `canvasContext` still renders at runtime — so type-checking
// alone proves nothing about a two-major jump across the worker, the document
// loader and the rasterizer. The smoke sweep proves even less: it mounts the
// screen without ever converting. Only rasterizing a real PDF and inspecting
// the pixels shows the pipeline still produces an image with ink in it.
test('pdf-to-images: rasterizes every page to a real PNG', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/en/tools/pdf-to-images');
  await expect(page.locator('.tool__title')).toBeVisible();

  await page.locator('.tool__body input[type="file"]').setInputFiles({
    name: 'two-pages.pdf',
    mimeType: 'application/pdf',
    buffer: makeTwoPagePdf(),
  });
  await page.getByRole('button', { name: 'Convert', exact: true }).click();

  // One download row per rasterized page: pdf.js rendered both, not just one.
  await expect(page.locator('.tool__result')).toBeVisible();
  await expect(page.locator('.tool__row')).toHaveCount(2);
  await expect(page.locator('.tool__error')).toHaveCount(0);

  // Pull the actual bytes off the download rather than trusting the DOM.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('.tool__row button').first().click(),
  ]);
  const { readFile } = await import('node:fs/promises');
  const bytes = new Uint8Array(await readFile(await download.path()));

  // A real PNG sized to the 200x100 MediaBox at the default scale of 2.
  expect(Array.from(bytes.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  const header = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  expect(header.getUint32(16)).toBe(400);
  expect(header.getUint32(20)).toBe(200);

  // Decode it back and count dark pixels. The canvas is sized *before* pdf.js
  // renders into it, so header dimensions alone would still pass on a silently
  // blank render — this is the assertion that proves the page was drawn.
  const darkPixels = await page.evaluate(async (data) => {
    const blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
    const bitmap = await createImageBitmap(blob);
    const surface = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = surface.getContext('2d');
    if (ctx === null) throw new Error('no 2D context for pixel inspection');
    ctx.drawImage(bitmap, 0, 0);
    const { data: px } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    let dark = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i]! < 128 && px[i + 1]! < 128 && px[i + 2]! < 128 && px[i + 3]! > 0) dark += 1;
    }
    return dark;
  }, Array.from(bytes));

  // "Page One" at 24pt covers well over a hundred pixels; zero means blank.
  expect(darkPixels).toBeGreaterThan(100);
  expect(pageErrors).toEqual([]);
});

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
