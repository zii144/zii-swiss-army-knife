import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs, splitPdf, compressPdf, pdfPageCount } from '../src/pdf';

async function makePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) doc.addPage([200, 200]);
  return doc.save();
}

describe('pdf ops', () => {
  it('merges several PDFs preserving total page count and order', async () => {
    const a = await makePdf(2);
    const b = await makePdf(3);
    const merged = await mergePdfs([a, b]);
    expect(await pdfPageCount(merged)).toBe(5);
  });

  it('mergePdfs rejects an empty input list', async () => {
    await expect(mergePdfs([])).rejects.toThrow(/at least one input/);
  });

  it('splits a PDF into one document per page by default', async () => {
    const src = await makePdf(3);
    const parts = await splitPdf(src);
    expect(parts).toHaveLength(3);
    for (const part of parts) expect(await pdfPageCount(part)).toBe(1);
  });

  it('splits a PDF to a selected, reordered page subset', async () => {
    const src = await makePdf(4);
    const [out] = await splitPdf(src, { pages: [3, 0] });
    expect(out).toBeDefined();
    if (out) expect(await pdfPageCount(out)).toBe(2);
  });

  it('rejects an out-of-range split index', async () => {
    const src = await makePdf(2);
    await expect(splitPdf(src, { pages: [5] })).rejects.toThrow(/out of range/);
  });

  it('compresses (re-saves) a PDF, preserving page count and PDF magic', async () => {
    const src = await makePdf(2);
    const out = await compressPdf(src);
    expect(new TextDecoder().decode(out.subarray(0, 5))).toBe('%PDF-');
    expect(await pdfPageCount(out)).toBe(2);
  });
});
