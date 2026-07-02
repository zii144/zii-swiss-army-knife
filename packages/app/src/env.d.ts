// Ambient declarations for non-TS asset imports handled by Vite.
declare module '*.css';

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
