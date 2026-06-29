/**
 * @zii/compute-wasm — real client-side WASM compute handlers that fulfil the
 * `@zii/compute` op descriptors. License-clean (MIT/Apache/ISC + LGPL libheif,
 * dynamically linked): no AGPL/GPL.
 */
export { mergePdfs, splitPdf, compressPdf, pdfPageCount } from './pdf';
export type { SplitPdfOptions } from './pdf';

export {
  convertImage,
  compressImage,
  decodeImage,
  encodeImage,
  detectImageFormat,
} from './image';
export type { ImageFormat, RasterImage, ConvertImageOptions } from './image';

export { heicToJpg } from './heic';
export type { HeicToJpgOptions } from './heic';

export { generateQr, generateQrSvg, scanQr } from './qr';
export type { GenerateQrOptions, ScannedBarcode } from './qr';

export { createZip, extractZip, extractZipText } from './archive';
export type { ZipEntries, CreateZipOptions } from './archive';

export { convertVideo, canRunFfmpegWasm } from './video';
export type { ConvertVideoOptions } from './video';

export {
  REAL_WASM_OPS,
  ALL_REAL_OPS,
  createComputeRegistryWithWasm,
  IMPLEMENTED_OP_IDS,
} from './ops';
