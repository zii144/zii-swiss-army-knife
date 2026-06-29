/**
 * Image convert / compress, powered by jSquash (Apache-2.0) WASM codecs.
 * Supports PNG, JPEG and WebP, fully on-device. Works in the browser (codecs
 * self-load) and headless in Node (we feed the codecs their wasm bytes).
 */
import pngDecode, { init as pngDecInit } from '@jsquash/png/decode.js';
import pngEncode, { init as pngEncInit } from '@jsquash/png/encode.js';
import jpegDecode, { init as jpegDecInit } from '@jsquash/jpeg/decode.js';
import jpegEncode, { init as jpegEncInit } from '@jsquash/jpeg/encode.js';
import webpDecode, { init as webpDecInit } from '@jsquash/webp/decode.js';
import webpEncode, { init as webpEncInit } from '@jsquash/webp/encode.js';
import { isNode, readPackageFile, toArrayBuffer } from './wasm-env';

/** Raster formats this module can read and write. */
export type ImageFormat = 'png' | 'jpeg' | 'webp';

/** A decoded raster image (matches the DOM `ImageData` shape). */
export interface RasterImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

let inited: Promise<void> | undefined;

/** Initialise every codec once. In Node we supply the wasm bytes explicitly. */
async function ensureCodecs(): Promise<void> {
  if (inited) return inited;
  inited = (async () => {
    if (!isNode()) return; // browser bundles self-load on first use
    const pngWasm = await readPackageFile('@jsquash/png', 'codec/pkg/squoosh_png_bg.wasm');
    const pngModule = await WebAssembly.compile(toArrayBuffer(pngWasm));
    await pngDecInit(pngModule);
    await pngEncInit(pngModule);
    await jpegDecInit({
      wasmBinary: await readPackageFile('@jsquash/jpeg', 'codec/dec/mozjpeg_dec.wasm'),
    });
    await jpegEncInit({
      wasmBinary: await readPackageFile('@jsquash/jpeg', 'codec/enc/mozjpeg_enc.wasm'),
    });
    await webpDecInit({
      wasmBinary: await readPackageFile('@jsquash/webp', 'codec/dec/webp_dec.wasm'),
    });
    await webpEncInit({
      wasmBinary: await readPackageFile('@jsquash/webp', 'codec/enc/webp_enc.wasm'),
    });
  })();
  return inited;
}

/** Sniff a raster format from the file's magic bytes. */
export function detectImageFormat(bytes: Uint8Array): ImageFormat | undefined {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e) return 'png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return 'jpeg';
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return 'webp';
  return undefined;
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

/** Decode any supported raster image to raw RGBA pixels. */
export async function decodeImage(bytes: Uint8Array, format?: ImageFormat): Promise<RasterImage> {
  await ensureCodecs();
  const fmt = format ?? detectImageFormat(bytes);
  const buf = asArrayBuffer(bytes);
  if (fmt === 'png') return pngDecode(buf);
  if (fmt === 'jpeg') return jpegDecode(buf);
  if (fmt === 'webp') return webpDecode(buf);
  throw new Error('Unsupported or unrecognised image format (expected png, jpeg or webp)');
}

/** Encode raw RGBA pixels to the target format. `quality` is 1..100 (lossy only). */
export async function encodeImage(
  image: RasterImage,
  format: ImageFormat,
  quality = 75,
): Promise<Uint8Array> {
  await ensureCodecs();
  // jSquash types the input as the DOM `ImageData` (which carries an extra
  // `colorSpace`); our RasterImage is the structural subset the codecs use.
  const imageData = image as unknown as ImageData;
  if (format === 'png') return new Uint8Array(await pngEncode(imageData));
  if (format === 'jpeg') return new Uint8Array(await jpegEncode(imageData, { quality }));
  if (format === 'webp') return new Uint8Array(await webpEncode(imageData, { quality }));
  throw new Error('Unsupported target image format (expected png, jpeg or webp)');
}

/** Options for {@link convertImage}. */
export interface ConvertImageOptions {
  /** Source format; auto-detected from magic bytes when omitted. */
  from?: ImageFormat;
  /** Target format (required). */
  to: ImageFormat;
  /** Lossy quality 1..100 (jpeg/webp). */
  quality?: number;
}

/** Convert an encoded image from one format to another. */
export async function convertImage(
  bytes: Uint8Array,
  opts: ConvertImageOptions,
): Promise<Uint8Array> {
  const decoded = await decodeImage(bytes, opts.from);
  return encodeImage(decoded, opts.to, opts.quality);
}

/** Re-encode an image at a (typically lower) quality to shrink it. */
export async function compressImage(
  bytes: Uint8Array,
  opts: { format?: ImageFormat; quality?: number } = {},
): Promise<Uint8Array> {
  const fmt = opts.format ?? detectImageFormat(bytes) ?? 'jpeg';
  const target: ImageFormat = fmt === 'png' ? 'jpeg' : fmt; // png is lossless; route to jpeg to shrink
  const decoded = await decodeImage(bytes);
  return encodeImage(decoded, target, opts.quality ?? 60);
}
