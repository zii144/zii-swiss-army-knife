/**
 * PDF merge / split / compress, powered by `pdf-lib` (MIT). Pure JS, no WASM,
 * runs identically in the browser and in Node.
 */
import { PDFDocument } from 'pdf-lib';

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
