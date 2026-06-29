/**
 * QR / barcode generate + scan, powered by zxing-wasm (MIT). Works in the
 * browser (codec self-loads) and headless in Node (we supply the wasm bytes).
 */
import { writeBarcode, prepareZXingModule as prepareWriter } from 'zxing-wasm/writer';
import { readBarcodes, prepareZXingModule as prepareReader } from 'zxing-wasm/reader';
import { isNode, readPackageFile, toArrayBuffer } from './wasm-env';

let writerReady: Promise<void> | undefined;
let readerReady: Promise<void> | undefined;

async function ensureWriter(): Promise<void> {
  if (writerReady) return writerReady;
  writerReady = (async () => {
    if (!isNode()) return;
    const wasm = await readPackageFile('zxing-wasm', 'dist/writer/zxing_writer.wasm');
    prepareWriter({ overrides: { wasmBinary: toArrayBuffer(wasm) }, fireImmediately: true });
  })();
  return writerReady;
}

async function ensureReader(): Promise<void> {
  if (readerReady) return readerReady;
  readerReady = (async () => {
    if (!isNode()) return;
    const wasm = await readPackageFile('zxing-wasm', 'dist/reader/zxing_reader.wasm');
    prepareReader({ overrides: { wasmBinary: toArrayBuffer(wasm) }, fireImmediately: true });
  })();
  return readerReady;
}

/** Options for {@link generateQr}. */
export interface GenerateQrOptions {
  /** Barcode symbology. Defaults to QR. */
  format?: 'QRCode' | 'DataMatrix' | 'Aztec' | 'PDF417' | 'Code128' | 'EAN13';
}

/** Encode `text` as a barcode and return PNG bytes. */
export async function generateQr(text: string, opts: GenerateQrOptions = {}): Promise<Uint8Array> {
  await ensureWriter();
  const result = await writeBarcode(text, { format: opts.format ?? 'QRCode' });
  if (result.error) throw new Error(`generateQr: ${result.error}`);
  if (!result.image) throw new Error('generateQr: encoder returned no image');
  return new Uint8Array(await result.image.arrayBuffer());
}

/** Encode `text` as a barcode and return a crisp SVG string. */
export async function generateQrSvg(text: string, opts: GenerateQrOptions = {}): Promise<string> {
  await ensureWriter();
  const result = await writeBarcode(text, { format: opts.format ?? 'QRCode' });
  if (result.error) throw new Error(`generateQr: ${result.error}`);
  return result.svg;
}

/** A decoded barcode. */
export interface ScannedBarcode {
  text: string;
  format: string;
}

/** Scan all barcodes in a PNG/JPEG image (provided as bytes). */
export async function scanQr(imageBytes: Uint8Array): Promise<ScannedBarcode[]> {
  await ensureReader();
  const blob = new Blob([toArrayBuffer(imageBytes)]);
  const results = await readBarcodes(blob);
  return results
    .filter((r) => r.format && r.format !== 'None')
    .map((r) => ({ text: r.text, format: r.format }));
}
