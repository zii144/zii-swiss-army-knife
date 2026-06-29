import { describe, it, expect } from 'vitest';
import {
  encodeImage,
  decodeImage,
  convertImage,
  compressImage,
  detectImageFormat,
  type RasterImage,
} from '../src/image';

function solid(width: number, height: number, rgba: [number, number, number, number]): RasterImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = rgba[0];
    data[i * 4 + 1] = rgba[1];
    data[i * 4 + 2] = rgba[2];
    data[i * 4 + 3] = rgba[3];
  }
  return { data, width, height };
}

describe('image ops', () => {
  it('encodes RGBA → PNG and decodes back to the same dimensions', async () => {
    const png = await encodeImage(solid(12, 9, [255, 0, 0, 255]), 'png');
    expect(detectImageFormat(png)).toBe('png');
    const decoded = await decodeImage(png);
    expect(decoded.width).toBe(12);
    expect(decoded.height).toBe(9);
  });

  it('converts PNG → JPEG (format detected from magic bytes)', async () => {
    const png = await encodeImage(solid(16, 16, [0, 128, 255, 255]), 'png');
    const jpeg = await convertImage(png, { to: 'jpeg', quality: 80 });
    expect(detectImageFormat(jpeg)).toBe('jpeg');
    const back = await decodeImage(jpeg);
    expect(back.width).toBe(16);
    expect(back.height).toBe(16);
  });

  it('converts PNG → WebP', async () => {
    const png = await encodeImage(solid(8, 8, [10, 20, 30, 255]), 'png');
    const webp = await convertImage(png, { to: 'webp', quality: 70 });
    expect(detectImageFormat(webp)).toBe('webp');
  });

  it('compress routes lossless PNG through JPEG and shrinks a photographic-ish image', async () => {
    // A noisy image compresses better as JPEG than as PNG.
    const w = 64;
    const h = 64;
    const data = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < w * h; i += 1) {
      data[i * 4] = (i * 37) % 256;
      data[i * 4 + 1] = (i * 91) % 256;
      data[i * 4 + 2] = (i * 13) % 256;
      data[i * 4 + 3] = 255;
    }
    const png = await encodeImage({ data, width: w, height: h }, 'png');
    const compressed = await compressImage(png, { quality: 40 });
    expect(detectImageFormat(compressed)).toBe('jpeg');
    expect(compressed.byteLength).toBeLessThan(png.byteLength);
  });

  it('rejects unrecognised input bytes', async () => {
    await expect(decodeImage(new Uint8Array([1, 2, 3, 4]))).rejects.toThrow(/Unsupported/);
  });
});
