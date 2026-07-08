import { test, expect, type ConsoleMessage } from '@playwright/test';
import { CATALOG } from '../src/lib/catalog';

// Console noise that isn't a tool defect: dev-server / network / devtools chatter.
const IGNORED_CONSOLE = [
  'favicon',
  'manifest',
  'service worker',
  'serviceworker',
  'failed to load resource',
  'net::',
  'download the react devtools',
  '[vite]',
  '[hmr]',
];

function isRealConsoleError(msg: ConsoleMessage): boolean {
  if (msg.type() !== 'error') return false;
  const text = msg.text().toLowerCase();
  return !IGNORED_CONSOLE.some((frag) => text.includes(frag));
}

// Every catalogue tool must load, mount its screen, expose a control, and not
// throw — proving the engine→registry→UI path is wired for all of them.
for (const tool of CATALOG) {
  test(`tool loads: ${tool.id} (${tool.name.en})`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (isRealConsoleError(msg)) consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(`/en/tools/${tool.id}`);

    // The screen mounted (title comes from the tool's own ToolPage header).
    const title = page.locator('.tool__title');
    await expect(title).toBeVisible();
    await expect(title).not.toHaveText('');

    // Not the "interface isn't built yet" fallback.
    await expect(page.getByText("interface isn't built yet")).toHaveCount(0);

    // The tool body renders at least one interactive control.
    const controls = page.locator(
      '.tool__body input, .tool__body textarea, .tool__body select, .tool__body button, .tool__body .ui-select',
    );
    expect(await controls.count(), `${tool.id} renders no interactive control`).toBeGreaterThan(0);

    // No uncaught exceptions or real console errors during mount.
    expect(pageErrors, `${tool.id} threw: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `${tool.id} logged errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });
}
