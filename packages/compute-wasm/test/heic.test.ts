import { describe, it, expect } from 'vitest';
import { heicToJpg } from '../src/heic';
import { decodeImage } from '../src/image';

/**
 * A real 16×16 HEIC image (red), generated with libheif via ImageMagick and
 * embedded as base64 so the golden test needs no binary fixture file.
 */
const RED_16_HEIC_B64 =
  'AAAAHGZ0eXBoZWljAAAAAG1pZjFoZWljbWlhZgAAAaptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAACAAAAEGlkYXQAAAAAABAAEAAAADhpbG9jAQAAAERAAAIAAQAAAAAAAAHOAAEAAAAAAAAANAACAAEAAAAAAAAAAQAAAAAAAAAIAAAAOGlpbmYAAAAAAAIAAAAVaW5mZQIAAAEAAQAAaHZjMQAAAAAVaW5mZQIAAAAAAgAAZ3JpZAAAAADVaXBycAAAALNpcGNvAAAAc2h2Y0MBA3AAAAAAAAAAAAAe8AD8/fj4AAAPAyAAAQAYQAEMAf//A3AAAAMAkAAAAwAAAwAeugJAIQABACdCAQEDcAAAAwCQAAADAAADAB6gIIEFluqumubAgAAAAwCAAAADAIQiAAEABkQBwXPBiQAAABRpc3BlAAAAAAAAABAAAAAQAAAAFGlzcGUAAAAAAAAAQAAAAEAAAAAQcGl4aQAAAAADCAgIAAAAGmlwbWEAAAAAAAAAAgABAoEDAAICAoQAAAAaaXJlZgAAAAAAAAAOZGltZwACAAEAAQAAADxtZGF0AAAAMCgBrxMhZmNA+BD3Z//rvBX/mSE/8zex6c7IR0DA0iCAm0BIk11QCxYQgId2pVbc+A==';

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

describe('heic-to-jpg', () => {
  it('decodes a real HEIC and re-encodes valid JPEG of the right size', async () => {
    const heic = b64ToBytes(RED_16_HEIC_B64);
    const jpeg = await heicToJpg(heic, { quality: 0.9 });
    expect(jpeg[0]).toBe(0xff); // JPEG SOI
    expect(jpeg[1]).toBe(0xd8);
    const decoded = await decodeImage(jpeg);
    expect(decoded.width).toBe(16);
    expect(decoded.height).toBe(16);
    // top-left pixel should be predominantly red
    expect(decoded.data[0]).toBeGreaterThan(150);
    expect(decoded.data[1]).toBeLessThan(120);
  });

  it('can emit PNG as well', async () => {
    const heic = b64ToBytes(RED_16_HEIC_B64);
    const png = await heicToJpg(heic, { format: 'PNG' });
    expect(png[0]).toBe(0x89);
    expect(png[1]).toBe(0x50);
  });
});
