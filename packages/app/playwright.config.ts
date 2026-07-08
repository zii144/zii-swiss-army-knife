import { defineConfig, devices } from '@playwright/test';

// Headless E2E for the Zii PWA. A dedicated Vite dev server on port 4321 keeps
// this independent of any editor preview on 5173. Service workers are blocked
// so tests never hit the app-shell cache (which otherwise serves stale bundles).
const PORT = 4321;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Generous: heavy tools (WASM PDF/image/OCR, CJK) lazy-compile on first hit.
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    serviceWorkers: 'block',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Run against the real production build: prerendered HTML + pre-bundled
  // chunks that load instantly (the dev server would lazy-compile heavy WASM
  // tools for 20s+ on first hit). This also exercises prerender + hydration.
  webServer: {
    command: `pnpm build && pnpm exec vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
