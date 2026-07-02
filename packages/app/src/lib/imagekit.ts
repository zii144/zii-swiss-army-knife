// Browser-only image helpers built on Canvas — resize, crop, re-encode. No
// external dependency; runs entirely on-device. (Not unit-tested headlessly
// because it needs the DOM Canvas API; the ops are thin wrappers.)

export interface RasterResult {
  bytes: Uint8Array;
  width: number;
  height: number;
}

async function toBitmap(bytes: Uint8Array): Promise<ImageBitmap> {
  const blob = new Blob([bytes as unknown as BlobPart]);
  return createImageBitmap(blob);
}

async function canvasToBytes(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Uint8Array> {
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), type, quality),
  );
  return new Uint8Array(await blob.arrayBuffer());
}

function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  ctx.imageSmoothingQuality = 'high';
  return { canvas, ctx };
}

/** Resize to an exact width/height. */
export async function resizeImage(
  bytes: Uint8Array,
  width: number,
  height: number,
  type = 'image/png',
  quality?: number,
): Promise<RasterResult> {
  const bmp = await toBitmap(bytes);
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return { bytes: await canvasToBytes(canvas, type, quality), width: canvas.width, height: canvas.height };
}

/** Resize keeping aspect ratio, fitting within maxW × maxH. */
export async function resizeContain(
  bytes: Uint8Array,
  maxW: number,
  maxH: number,
  type = 'image/png',
  quality?: number,
): Promise<RasterResult> {
  const bmp = await toBitmap(bytes);
  const scale = Math.min(maxW / bmp.width, maxH / bmp.height, 1);
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  return { bytes: await canvasToBytes(canvas, type, quality), width: w, height: h };
}

/** Crop a rectangle out of the source. */
export async function cropImage(
  bytes: Uint8Array,
  x: number,
  y: number,
  w: number,
  h: number,
  type = 'image/png',
  quality?: number,
): Promise<RasterResult> {
  const bmp = await toBitmap(bytes);
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.drawImage(bmp, x, y, w, h, 0, 0, w, h);
  return { bytes: await canvasToBytes(canvas, type, quality), width: canvas.width, height: canvas.height };
}

/** Square center-crop then resize to size × size (for favicons/avatars). */
export async function squareThumb(
  bytes: Uint8Array,
  size: number,
  type = 'image/png',
): Promise<Uint8Array> {
  const bmp = await toBitmap(bytes);
  const side = Math.min(bmp.width, bmp.height);
  const sx = (bmp.width - side) / 2;
  const sy = (bmp.height - side) / 2;
  const { canvas, ctx } = makeCanvas(size, size);
  ctx.drawImage(bmp, sx, sy, side, side, 0, 0, size, size);
  return canvasToBytes(canvas, type);
}

/** Re-encode (drops metadata such as EXIF/GPS). */
export async function reencode(
  bytes: Uint8Array,
  type = 'image/jpeg',
  quality = 0.92,
): Promise<RasterResult> {
  const bmp = await toBitmap(bytes);
  const { canvas, ctx } = makeCanvas(bmp.width, bmp.height);
  ctx.drawImage(bmp, 0, 0);
  return { bytes: await canvasToBytes(canvas, type, quality), width: bmp.width, height: bmp.height };
}

/** Natural pixel dimensions of an encoded image. */
export async function imageSize(bytes: Uint8Array): Promise<{ width: number; height: number }> {
  const bmp = await toBitmap(bytes);
  return { width: bmp.width, height: bmp.height };
}
