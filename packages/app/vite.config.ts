import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Workspace packages expose their `exports` as raw .ts source, so Vite/esbuild
// transpiles them on the fly. No extra resolve config is needed for ESM TS.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `heic-convert`'s main entry is Node-only (pngjs + Node streams) and
      // crashes in the browser. Its `browser` build re-encodes via <canvas>.
      // Alias it here so the app bundles the browser build; the Node-side
      // heic tests in @zii/compute-wasm still use the default entry.
      'heic-convert': 'heic-convert/browser',
    },
  },
  // Keep Vitest scoped to unit tests under test/ so it never tries to run the
  // Playwright specs in e2e/ (which import @playwright/test, not vitest).
  test: {
    include: ['test/**/*.{test,spec}.ts'],
  },
  build: {
    // Modern baseline keeps the transpiled output lean.
    target: 'es2022',
    // Emit a manifest so the bundle-budget check can sum the initial payload.
    manifest: true,
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        // Keep React in its own long-cached chunk so app-code changes don't
        // bust the framework cache, and the initial payload is split cleanly.
        manualChunks(id) {
          if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
