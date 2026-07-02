/**
 * PDF merge / split / compress, powered by `pdf-lib` (MIT). Pure JS, no WASM,
 * runs identically in the browser and in Node.
 */
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';

/** Merge several PDFs (in order) into a single document. */
export async function mergePdfs(inputs: Uint8Array[]): Promise<Uint8Array> {
  if (inputs.length === 0) throw new Error('mergePdfs: at least one input PDF is required');
  const out = await PDFDocument.create();
  for (const bytes of inputs) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  return out.save();
}

/** Options for {@link splitPdf}. */
export interface SplitPdfOptions {
  /**
   * Zero-based page indices (or ranges) to keep, in order. When omitted, the
   * PDF is exploded into one document per page.
   */
  pages?: number[];
}

/**
 * Split a PDF. With `pages`, returns a single PDF containing exactly those
 * pages in the given order. Without `pages`, returns one single-page PDF per
 * source page.
 */
export async function splitPdf(input: Uint8Array, opts: SplitPdfOptions = {}): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(input);
  const total = src.getPageCount();

  if (opts.pages && opts.pages.length > 0) {
    for (const idx of opts.pages) {
      if (!Number.isInteger(idx) || idx < 0 || idx >= total) {
        throw new Error(`splitPdf: page index ${idx} out of range (0..${total - 1})`);
      }
    }
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, opts.pages);
    for (const page of copied) out.addPage(page);
    return [await out.save()];
  }

  const results: Uint8Array[] = [];
  for (let i = 0; i < total; i += 1) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    if (page) out.addPage(page);
    results.push(await out.save());
  }
  return results;
}

/**
 * Structurally compress a PDF: re-save with cross-reference object streams and
 * without the original metadata. This shrinks structural overhead and dedupes
 * objects; it does **not** recompress embedded images (that needs the image
 * pipeline). Returns the re-saved bytes.
 */
export async function compressPdf(input: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(input, { updateMetadata: false });
  return doc.save({ useObjectStreams: true });
}

/** Count the pages in a PDF (handy for UIs and tests). */
export async function pdfPageCount(input: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(input);
  return doc.getPageCount();
}

export type RasterImageFormat = 'jpeg' | 'png';

function sniffRasterFormat(bytes: Uint8Array): RasterImageFormat | undefined {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e) return 'png';
  return undefined;
}

/** Build a single-page PDF from one JPEG or PNG image. */
export async function imagesToPdf(
  images: readonly Uint8Array[],
  opts: { format?: RasterImageFormat } = {},
): Promise<Uint8Array> {
  if (images.length === 0) throw new Error('imagesToPdf: at least one image is required');
  const doc = await PDFDocument.create();
  for (const bytes of images) {
    const fmt = opts.format ?? sniffRasterFormat(bytes);
    if (fmt === undefined) throw new Error('imagesToPdf: expected JPEG or PNG input');
    const embedded =
      fmt === 'jpeg' ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);
    const { width, height } = embedded.scale(1);
    const page = doc.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }
  return doc.save();
}

/** True when pdf.js can render to a DOM canvas (browser only). */
export function canRenderPdfToImages(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

export interface PdfToImagesOptions {
  /** Output raster format (default png). */
  format?: 'png' | 'jpeg';
  /** Viewport scale factor (default 2). */
  scale?: number;
  /** JPEG quality 0–1 when format is jpeg (default 0.92). */
  quality?: number;
}

/**
 * Rasterize each PDF page to PNG or JPEG using pdf.js. Requires a browser with
 * canvas support; throws with guidance in Node or other headless environments.
 */
export async function pdfToImages(
  input: Uint8Array,
  opts: PdfToImagesOptions = {},
): Promise<Uint8Array[]> {
  if (!canRenderPdfToImages()) {
    throw new Error(
      'pdfToImages requires a browser with canvas support. Use imagesToPdf or server-side rendering in Node.',
    );
  }
  const format = opts.format ?? 'png';
  const scale = opts.scale ?? 2;
  const quality = opts.quality ?? 0.92;
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  const loading = pdfjs.getDocument({ data: input.slice() });
  const doc = await loading.promise;
  const out: Uint8Array[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('pdfToImages: could not acquire 2D canvas context');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('pdfToImages: canvas.toBlob failed'))),
        format === 'jpeg' ? 'image/jpeg' : 'image/png',
        format === 'jpeg' ? quality : undefined,
      );
    });
    out.push(new Uint8Array(await blob.arrayBuffer()));
  }
  return out;
}

/** Rotate every page by `deg` degrees (added to any existing rotation). */
export async function rotatePdf(input: Uint8Array, deg: number): Promise<Uint8Array> {
  const doc = await PDFDocument.load(input);
  for (const page of doc.getPages()) {
    const current = page.getRotation().angle;
    page.setRotation(degrees(((current + deg) % 360 + 360) % 360));
  }
  return doc.save();
}

/** Options for {@link watermarkPdf}. */
export interface WatermarkOptions {
  text: string;
  opacity?: number;
  size?: number;
}

/** Stamp a diagonal text watermark across every page. */
export async function watermarkPdf(input: Uint8Array, opts: WatermarkOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.load(input);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = opts.size ?? 48;
  const opacity = opts.opacity ?? 0.2;
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const tw = font.widthOfTextAtSize(opts.text, size);
    page.drawText(opts.text, {
      x: width / 2 - tw / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  }
  return doc.save();
}

/**
 * Reorder / delete pages: build a new PDF containing exactly the given
 * zero-based page indices, in the given order.
 */
export async function organizePdf(input: Uint8Array, order: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(input);
  const total = src.getPageCount();
  const idx = order.filter((i) => Number.isInteger(i) && i >= 0 && i < total);
  if (idx.length === 0) throw new Error('organizePdf: no valid page indices');
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, idx);
  for (const page of copied) out.addPage(page);
  return out.save();
}

/** Add "n / total" page numbers to the bottom-centre of every page. */
export async function addPageNumbers(input: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(input);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const label = `${i + 1} / ${pages.length}`;
    const size = 10;
    const tw = font.widthOfTextAtSize(label, size);
    page.drawText(label, { x: width / 2 - tw / 2, y: 24, size, font, color: rgb(0.35, 0.35, 0.35) });
  });
  return doc.save();
}
