import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Every tool that produces a file goes through DownloadButton, and the image /
// QR tools all show a blob: preview. Both used to mishandle the object URL:
// the download revoked it in the same tick as the click, and previews were
// never revoked on unmount.

/** Drive the QR tool to a generated result — no file picker needed. */
async function generateQr(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/en/tools/qr-generate');
  // The generate button stays disabled until there is a payload to encode.
  await page.locator('.tool__field textarea, .tool__field input[type="text"]').first().fill('zii');
  const generate = page.locator('.tool__actions button');
  await expect(generate).toBeEnabled();
  await generate.click();
  await expect(page.locator('img.tool__preview--qr')).toBeVisible();
}

test('the download button delivers real bytes', async ({ page }) => {
  await generateQr(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download/i }).click(),
  ]);

  expect(download.suggestedFilename()).toBe('qr.png');

  const path = await download.path();
  expect(path, 'download did not complete — the object URL was revoked too early').toBeTruthy();

  const bytes = new Uint8Array(await readFile(path!));
  expect(bytes.byteLength).toBeGreaterThan(100);
  // PNG magic number: the file the browser saved is the file we generated.
  expect([...bytes.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
});

test('the object URL outlives the click that starts the download', async ({ page }) => {
  await generateQr(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download/i }).click(),
  ]);
  await download.path();

  // Immediately after the click the URL must still resolve — revoking in the
  // same tick is what cancelled the download in some engines.
  const stillLive = await page.evaluate(async () => {
    const blob = new Blob(['probe'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'probe.txt';
    document.body.appendChild(a);
    a.remove();
    try {
      const res = await fetch(url);
      return res.ok;
    } finally {
      URL.revokeObjectURL(url);
    }
  });
  expect(stillLive).toBe(true);
});

test('a preview object URL is released when the tool unmounts', async ({ page }) => {
  await generateQr(page);

  const previewUrl = await page.locator('img.tool__preview--qr').getAttribute('src');
  expect(previewUrl).toMatch(/^blob:/);

  // While mounted the URL resolves.
  expect(
    await page.evaluate(
      (u) =>
        fetch(u).then(
          (r) => r.ok,
          () => false,
        ),
      previewUrl!,
    ),
  ).toBe(true);

  // Client-side navigation unmounts the tool view.
  await page.locator('.app__nav-links').getByText('Tools', { exact: true }).click();
  await expect(page).toHaveURL(/\/en\/tools$/);
  await expect(page.locator('img.tool__preview--qr')).toHaveCount(0);

  const stillResolves = await page.evaluate(
    (u) =>
      fetch(u).then(
        (r) => r.ok,
        () => false,
      ),
    previewUrl!,
  );
  expect(stillResolves, 'preview blob URL leaked past unmount').toBe(false);
});
