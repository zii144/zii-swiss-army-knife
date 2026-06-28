import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Workspace packages expose their `exports` as raw .ts source, so Vite/esbuild
// transpiles them on the fly. No extra resolve config is needed for ESM TS.
export default defineConfig({
  plugins: [react()],
});
