import { describe, it, expect } from 'vitest';
import { generateQr, generateQrSvg, scanQr } from '../src/qr';

describe('qr / barcode ops', () => {
  it('round-trips: generate a QR PNG then scan the same text back', async () => {
    const text = 'https://zii.example/tools?id=HELLO-ZII';
    const png = await generateQr(text);
    expect(png[0]).toBe(0x89); // PNG magic
    expect(png[1]).toBe(0x50);
    const scanned = await scanQr(png);
    expect(scanned.map((r) => r.text)).toContain(text);
    expect(scanned[0]?.format).toMatch(/QR/i);
  });

  it('generates an SVG QR for crisp vector rendering', async () => {
    const svg = await generateQrSvg('ZII');
    expect(svg).toContain('<svg');
  });

  it('scans an empty image to an empty result (no false positives)', async () => {
    // 1x1 transparent PNG
    const onePx = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
      0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
      0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0x00,
      0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
    const scanned = await scanQr(onePx);
    expect(scanned).toHaveLength(0);
  });
});
