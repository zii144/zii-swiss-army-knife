/**
 * Browser compute wrappers — the same engines the real @zii/compute-wasm uses,
 * called directly for this standalone demo. In the browser the jSquash and
 * zxing-wasm codecs self-load their .wasm (Vite emits jSquash's as local
 * assets), so no Node bootstrap is needed here.
 */
import { PDFDocument } from 'pdf-lib';
import pngDecode from '@jsquash/png/decode.js';
import pngEncode from '@jsquash/png/encode.js';
import jpegDecode from '@jsquash/jpeg/decode.js';
import jpegEncode from '@jsquash/jpeg/encode.js';
import webpDecode from '@jsquash/webp/decode.js';
import webpEncode from '@jsquash/webp/encode.js';
import { writeBarcode } from 'zxing-wasm/writer';

/* ---------- PDF ---------- */

export async function mergePdfs(inputs: Uint8Array[]): Promise<Uint8Array> {
  if (inputs.length === 0) throw new Error('Add at least one PDF.');
  const out = await PDFDocument.create();
  for (const bytes of inputs) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  return out.save();
}

/* ---------- Image ---------- */

export type ImageFormat = 'png' | 'jpeg' | 'webp';

function detectFormat(bytes: Uint8Array): ImageFormat | undefined {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpeg';
  if (bytes[0] === 0x52 && bytes[8] === 0x57) return 'webp';
  return undefined;
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function convertImage(
  bytes: Uint8Array,
  to: ImageFormat,
  quality = 80,
): Promise<Uint8Array> {
  const from = detectFormat(bytes);
  const buf = asArrayBuffer(bytes);
  const image =
    from === 'png'
      ? await pngDecode(buf)
      : from === 'jpeg'
        ? await jpegDecode(buf)
        : from === 'webp'
          ? await webpDecode(buf)
          : undefined;
  if (!image) throw new Error('Unsupported image (expected PNG, JPEG or WebP).');

  const encoded =
    to === 'png'
      ? await pngEncode(image)
      : to === 'jpeg'
        ? await jpegEncode(image, { quality })
        : await webpEncode(image, { quality });
  return new Uint8Array(encoded);
}

/* ---------- QR ---------- */

export async function generateQr(text: string): Promise<Uint8Array> {
  const result = await writeBarcode(text, { format: 'QRCode' });
  if (result.error) throw new Error(result.error);
  if (!result.image) throw new Error('QR encoder returned no image.');
  return new Uint8Array(await result.image.arrayBuffer());
}
