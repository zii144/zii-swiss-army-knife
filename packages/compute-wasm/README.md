# @zii/compute-wasm

Real client-side WASM/JS compute handlers that fulfil the `@zii/compute` op
descriptors. This is the "app-level bundle" referenced by M4: `@zii/compute`
ships light, throwing descriptors; this package swaps in working implementations.

All ops run **on-device, offline** — in the browser (codecs self-load) and
headless in Node (the test runtime and the `@zii/backend` conversion worker),
where this package feeds each codec its `.wasm` bytes from `node_modules`.

## Ops

| id              | engine                         | notes                                            |
| --------------- | ------------------------------ | ------------------------------------------------ |
| `pdf-merge`     | pdf-lib (MIT)                  | merge N PDFs in order                            |
| `pdf-split`     | pdf-lib                        | explode per page, or keep a reordered subset     |
| `pdf-compress`  | pdf-lib                        | structural re-save (object streams, strip meta)  |
| `image-convert` | jSquash (Apache-2.0)           | PNG/JPEG/WebP ⇄, format auto-detected            |
| `image-compress`| jSquash                        | re-encode at quality; PNG routed to JPEG         |
| `heic-to-jpg`   | heic-convert (ISC) + libheif   | HEIC/HEIF → JPEG or PNG                           |
| `qr-generate`   | zxing-wasm (MIT)               | QR/barcode → PNG or SVG                           |
| `qr-scan`       | zxing-wasm                     | decode QR/barcodes from an image                 |
| `archive-zip`   | fflate (MIT)                   | build a ZIP from path → bytes                     |
| `archive-unzip` | fflate                         | extract a ZIP                                     |
| `video-convert` | ffmpeg.wasm (MIT, LGPL build)  | **browser-only**, cross-origin-isolated route    |

`video-convert` requires a COOP/COEP (`crossOriginIsolated`) browser context
with `SharedArrayBuffer`. In Node or a non-isolated page it throws an actionable
error directing callers to the server-side `@zii/backend` conversion worker.

## Usage

```ts
import { createComputeRegistryWithWasm } from '@zii/compute-wasm';

const compute = createComputeRegistryWithWasm();
const merged = await compute.run('pdf-merge', [pdfA, pdfB]); // Uint8Array
const png = await compute.run('qr-generate', 'https://zii.app');
const codes = await compute.run('qr-scan', png); // [{ text, format }]
```

Or call the typed helpers directly: `mergePdfs`, `convertImage`, `heicToJpg`,
`generateQr`, `scanQr`, `createZip`, …

## Licensing

License-clean per the platform guardrail: MIT / Apache-2.0 / ISC, plus libheif
(LGPL-3.0, dynamically linked via `heic-convert`). No AGPL, no GPL-only, no
MuPDF. The repo's `check:licenses` gate enforces this.
