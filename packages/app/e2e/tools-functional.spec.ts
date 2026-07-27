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

// ---------------------------------------------------------------------------
// Breadth pass.
//
// The smoke sweep proves all 318 tools mount; these prove a representative
// slice actually computes. Every expected value below is derived independently
// — from a standard (RFC 4648 base32, MOD-97, American Soundex), a definition
// (1 kg / 0.45359237, 1 MiB / 1e6), or a textbook case (kitten→sitting = 3) —
// never by reading back what the app happened to print. A test that is only
// ever reconciled against the app's own output cannot detect the app being
// wrong, which is the entire point of the exercise.
//
// `Select` is a custom listbox rather than a native <select>, so these drive
// text and number inputs and rely on each tool's default units. Where a tool
// already ships useful defaults, the input is still changed so the assertion
// covers reactivity rather than just the first render.
// ---------------------------------------------------------------------------

/**
 * Pick an option from the app's `Select`, which is a custom listbox rather than
 * a native <select> — so `selectOption` does not apply. Scoped to the tool body
 * because the app shell has its own market and language selects.
 */
async function chooseOption(
  page: import('@playwright/test').Page,
  label: string,
): Promise<void> {
  await page.locator('.tool__body .ui-select__trigger').first().click();
  await page.locator('[role="option"]').filter({ hasText: label }).first().click();
}

/** Fill the nth non-readonly number input on a tool screen. */
async function fillNumbers(
  page: import('@playwright/test').Page,
  values: readonly string[],
): Promise<void> {
  const inputs = page.locator('.tool__body input[type="number"]');
  for (const [i, v] of values.entries()) await inputs.nth(i).fill(v);
}

test.describe('text', () => {
  test('text-count: counts characters, words and lines', async ({ page }) => {
    await page.goto('/en/tools/text-count');
    await page.locator('.tool__body textarea').first().fill('hello world\nsecond line');
    const stat = (label: string) =>
      page.locator('.tool__stat').filter({ hasText: label }).locator('.tool__stat-value');
    await expect(stat('Characters')).toHaveText('23');
    await expect(stat('Words')).toHaveText('4');
    await expect(stat('Lines')).toHaveText('2');
  });

  test('line-dedupe: drops repeated lines, keeping first order', async ({ page }) => {
    await page.goto('/en/tools/line-dedupe');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('a\nb\na\nc\nb');
    await page.locator('.tool__body button').first().click();
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('a\nb\nc');
  });

  test('sort-lines: sorts ascending', async ({ page }) => {
    await page.goto('/en/tools/sort-lines');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('banana\napple\ncherry');
    // Scoped to the tool body: the left-hand nav also has a "Sort lines" button.
    await page.locator('.tool__actions button').first().click();
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue(
      'apple\nbanana\ncherry',
    );
  });

  test('caesar-cipher: shifts by three', async ({ page }) => {
    await page.goto('/en/tools/caesar-cipher');
    // Default shift is 3; "Attack at dawn" -> "Dwwdfn dw gdzq".
    await page.locator('.tool__body textarea:not([readonly])').first().fill('Attack at dawn');
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('Dwwdfn dw gdzq');
  });

  test('remove-diacritics: folds accents to ASCII', async ({ page }) => {
    await page.goto('/en/tools/remove-diacritics');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('Café Málaga');
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('Cafe Malaga');
  });

  test('morse-code: encodes to International Morse', async ({ page }) => {
    await page.goto('/en/tools/morse-code');
    // Letters separated by a space, words by " / ".
    await page.locator('.tool__body textarea:not([readonly])').first().fill('SOS SOS');
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue(
      '... --- ... / ... --- ...',
    );
  });
});

test.describe('dev', () => {
  test('hash: computes SHA-256 and SHA-1 of "abc"', async ({ page }) => {
    await page.goto('/en/tools/hash');
    await page.locator('.tool__body textarea').first().fill('abc');
    // The canonical FIPS-180 test vectors for "abc".
    await expect(
      page
        .locator('.tool__row-value')
        .filter({ hasText: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' }),
    ).toBeVisible();
    await expect(
      page
        .locator('.tool__row-value')
        .filter({ hasText: 'a9993e364706816aba3e25717850c26c9cd0d89d' }),
    ).toBeVisible();
  });

  test('hex-text: encodes bytes as spaced hex', async ({ page }) => {
    await page.goto('/en/tools/hex-text');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('Hi!');
    // H=0x48 i=0x69 !=0x21
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('48 69 21');
  });

  test('binary-text: encodes bytes as spaced octets', async ({ page }) => {
    await page.goto('/en/tools/binary-text');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('Hi');
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue(
      '01001000 01101001',
    );
  });

  test('base32-codec: encodes per RFC 4648, padded', async ({ page }) => {
    await page.goto('/en/tools/base32-codec');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('Hello!');
    // 6 bytes -> 10 symbols, padded to 16 per RFC 4648 §6.
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('JBSWY3DPEE======');
  });

  test('base32-codec: decodes padded input back to text', async ({ page }) => {
    await page.goto('/en/tools/base32-codec');
    await chooseOption(page, 'Decode');
    await page.locator('.tool__body textarea:not([readonly])').first().fill('MZXW6YTBOI======');
    await expect(page.locator('.tool__body textarea[readonly]')).toHaveValue('foobar');
  });

  test('levenshtein: counts single-character edits', async ({ page }) => {
    await page.goto('/en/tools/levenshtein');
    const fields = page.locator('.tool__body input[type="text"], .tool__body input:not([type])');
    await fields.nth(0).fill('flaw');
    await fields.nth(1).fill('lawn');
    // flaw -> law -> lawn is 2 edits.
    await expect(page.locator('.tool__hint')).toContainText('2');
  });

  test('color-convert: converts hex to RGB channels', async ({ page }) => {
    await page.goto('/en/tools/color-convert');
    const field = page.locator('.tool__body input').first();
    await field.fill('#ff8800');
    const body = page.locator('.tool__body');
    await expect(body).toContainText('255');
    await expect(body).toContainText('136');
  });
});

test.describe('convert', () => {
  test('temperature-convert: 100 C is 212 F', async ({ page }) => {
    await page.goto('/en/tools/temperature-convert');
    await fillNumbers(page, ['100']); // defaults are C -> F
    await expect(page.locator('.tool__hint')).toContainText('212');
  });

  test('mass-convert: 5 kg is 11.0231 lb', async ({ page }) => {
    await page.goto('/en/tools/mass-convert');
    await fillNumbers(page, ['5']); // defaults are kg -> lb
    // 5 / 0.45359237 = 11.023113…
    await expect(page.locator('.tool__hint')).toContainText('11.023');
  });

  test('data-size: 1 MiB is 1.048576 MB', async ({ page }) => {
    await page.goto('/en/tools/data-size');
    await fillNumbers(page, ['1']); // defaults are MiB -> MB
    await expect(page.locator('.tool__hint')).toContainText('1.048');
  });
});

test.describe('calc', () => {
  test('roman-numeral: 1994 is MCMXCIV', async ({ page }) => {
    await page.goto('/en/tools/roman-numeral');
    await page.locator('.tool__body input').first().fill('1994');
    await page.locator('.tool__actions button').first().click();
    await expect(page.locator('.tool__result')).toContainText('MCMXCIV');
  });

  test('bmi: 80 kg at 180 cm is 24.69', async ({ page }) => {
    await page.goto('/en/tools/bmi');
    await fillNumbers(page, ['80', '180']);
    await expect(page.locator('.tool__stat-value')).toHaveText('24.69');
  });

  test('discount: 30% off 200 leaves 140', async ({ page }) => {
    await page.goto('/en/tools/discount');
    await fillNumbers(page, ['200', '30']);
    await expect(
      page.locator('.tool__stat').filter({ hasText: 'You pay' }).locator('.tool__stat-value'),
    ).toContainText('140');
  });
});

test.describe('generator', () => {
  test('gcd-lcm: gcd(12, 18) = 6 and lcm = 36', async ({ page }) => {
    await page.goto('/en/tools/gcd-lcm');
    await fillNumbers(page, ['12', '18']);
    await expect(page.locator('.tool__hint').filter({ hasText: 'GCD' })).toContainText('6');
    await expect(page.locator('.tool__hint').filter({ hasText: 'LCM' })).toContainText('36');
  });

  test('uuid: generates syntactically valid v4 UUIDs', async ({ page }) => {
    await page.goto('/en/tools/uuid');
    await page.locator('.tool__actions button').first().click();
    const values = page.locator('.tool__row-value');
    await expect(values.first()).toHaveText(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    // Distinct per row, i.e. actually regenerated rather than one value repeated.
    const all = await values.allTextContents();
    expect(new Set(all).size).toBe(all.length);
  });
});

test.describe('id validators', () => {
  test('de-iban: accepts a MOD-97 valid IBAN and rejects a mutated one', async ({ page }) => {
    await page.goto('/en/tools/de-iban');
    const field = page.locator('.tool__body input').first();
    // Verified independently: rearranged + digit-substituted, this IBAN is 1 mod 97.
    await field.fill('DE89 3704 0044 0532 0130 00');
    await expect(page.locator('.tool__result .app__badge')).toContainText('Valid');
    // Flip one digit; MOD-97 must reject it.
    await field.fill('DE89 3704 0044 0532 0130 01');
    await expect(page.locator('.tool__result .app__badge')).toContainText('Invalid');
  });

  test('tw-national-id: accepts a valid ID and rejects a bad check digit', async ({ page }) => {
    await page.goto('/en/tools/tw-national-id');
    const field = page.locator('.tool__body input').first();
    await field.fill('A123456789');
    await expect(page.locator('.tool__result .app__badge')).toContainText('Valid');
    await field.fill('A123456788');
    await expect(page.locator('.tool__result .app__badge')).toContainText('Invalid');
  });
});
