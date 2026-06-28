# @zii/compute

The **Client WASM Compute Layer** abstraction (Module **M4**) for the Zii utility suite.

Heavy, privacy-first operations (PDF / image / audio / video / archive / hashing / barcodes) all
run **on the client**. This package is the *abstraction*: it describes every operation as a
lazily-loadable [`ComputeOp`](./src/types.ts) and ships the small ops that run **natively today**
(hashing via the Web Crypto API). The heavy WASM payloads are **not** bundled here — they are loaded
on demand at the app layer via a future `@zii/compute-wasm` bundle. This keeps `@zii/compute` at
**zero third-party runtime dependencies** and code-split per op.

```ts
import { createDefaultComputeRegistry, sha256Hex, capabilities } from '@zii/compute';

// Native, no-WASM hashing (Node 22+ and browsers):
await sha256Hex('abc'); // "ba7816bf...20015ad"

const compute = createDefaultComputeRegistry();
await compute.run('sha-256', new TextEncoder().encode('abc')); // native handler

// Heavy ops are wired but not yet bundled — they throw a clear, actionable error:
await compute.run('pdf-merge', files);
// Error: pdf-merge requires the @zii/compute-wasm bundle (browser runtime)

// UI feature detection:
capabilities(); // op metas incl. needsWasm + isolated flags
```

## Ops

| id              | category | needsWasm | notes                                  |
| --------------- | -------- | --------- | -------------------------------------- |
| `sha-256`       | hash     | false     | native, `crypto.subtle`                |
| `sha-1`         | hash     | false     | native, `crypto.subtle`                |
| `pdf-merge`     | pdf      | true      | descriptor (app-wired WASM)            |
| `pdf-compress`  | pdf      | true      | descriptor                            |
| `image-convert` | image    | true      | descriptor                            |
| `heic-to-jpg`   | image    | true      | descriptor                            |
| `image-compress`| image    | true      | descriptor                            |
| `video-convert` | video    | true      | descriptor, **`isolated`** (COOP/COEP) |
| `qr-generate`   | barcode  | true      | descriptor                            |
| `qr-scan`       | barcode  | true      | descriptor                            |
| `archive-zip`   | archive  | true      | descriptor                            |

`isolated: true` (video / ffmpeg) means the op requires a **cross-origin-isolated** context
(`Cross-Origin-Opener-Policy` + `Cross-Origin-Embedder-Policy`) for multi-threaded `SharedArrayBuffer`.

## API

- `createComputeRegistry()` / `new ComputeRegistry()`
- `ComputeRegistry#register(op)` — throws on duplicate / non-kebab-case id
- `ComputeRegistry#has(id)`, `#get(id)`, `#list(category?)`
- `ComputeRegistry#run(id, input, opts?)` — lazily loads (cached) then invokes the handler
- `createDefaultComputeRegistry()` — registry pre-loaded with all native ops + WASM descriptors
- `capabilities()` — op metadata for UI feature detection
- `sha256Hex(data)`, `sha1Hex(data)`, `digestHex(algorithm, data)`

## License note (intended WASM backends)

When the heavy ops are wired at the app layer, only **permissively / weak-copyleft** licensed
WASM backends are to be used, so the suite can stay distributable:

- **PDF**: `pdf-lib` (MIT), `pdf.js` (Apache-2.0), **PDFium** (BSD-3 / Apache-2.0). **No MuPDF (AGPL).**
- **Image**: jSquash (Apache-2.0 codecs) and/or `wasm-vips` (LGPL).
- **Video**: an **LGPL** `ffmpeg.wasm` build only (run cross-origin-isolated).
- **Barcode**: ZXing (`zxing-wasm`, Apache-2.0).

No AGPL dependencies (notably **no MuPDF**) are permitted in the shipped bundle.

## Scripts

`pnpm build` (tsc) · `pnpm typecheck` · `pnpm test` (vitest) · `pnpm lint` (eslint)
