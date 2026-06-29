import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone demo app. The jSquash image codecs ship their .wasm as assets that
// Vite emits locally (offline-capable); zxing-wasm loads its wasm at runtime.
export default defineConfig({
  plugins: [react()],
});
