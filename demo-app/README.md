# Zii demo app (Vite + React)

A standalone, runnable demo of three Zii tools — **Merge PDF**, **Convert image**
(PNG/JPEG/WebP), and **QR code generator** — built with Vite + React +
TypeScript. It uses the same on-device engines as the real product
(`pdf-lib`, jSquash, `zxing-wasm`); everything runs in the browser, nothing is
uploaded.

This is self-contained and **not** part of the pnpm workspace, so it installs
and runs on its own.

## Run it

```bash
cd demo-app
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Build

```bash
npm run build      # tsc typecheck + vite production build → dist/
npm run preview    # serve the production build locally
```

## Notes

- PDF merge (`pdf-lib`) and image convert (jSquash — Vite emits its `.wasm` as
  local assets) run **fully offline**.
- QR generation (`zxing-wasm`) loads its `.wasm` at runtime; the first
  generation needs network unless you self-host that asset.
- The production app lives in `../packages/app` (`@zii/app`) and is wired to
  `@zii/compute-wasm`; this folder is just a quick way to see and click the
  tools without the monorepo.
