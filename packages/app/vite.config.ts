import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Workspace packages expose their `exports` as raw .ts source, so Vite/esbuild
// transpiles them on the fly. No extra resolve config is needed for ESM TS.
export default defineConfig({
  plugins: [react()],
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
