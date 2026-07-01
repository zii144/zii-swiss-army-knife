/// <reference path="./heic-convert.d.ts" />
/**
 * HEIC/HEIF → JPEG (or PNG), powered by `heic-convert` (ISC), which wraps
 * libheif (LGPL, dynamically linked — allowed by the licence guardrail).
 * Runs on-device in the browser and headless in Node.
 */
import heicConvert from 'heic-convert';

/** Options for {@link heicToJpg}. */
export interface HeicToJpgOptions {
  /** Output format. Defaults to JPEG. */
  format?: 'JPEG' | 'PNG';
  /** JPEG quality 0..1 (ignored for PNG). Defaults to 0.85. */
  quality?: number;
}

/** Decode a HEIC/HEIF image and re-encode it as JPEG (default) or PNG. */
export async function heicToJpg(
  bytes: Uint8Array,
  opts: HeicToJpgOptions = {},
): Promise<Uint8Array> {
  const format = opts.format ?? 'JPEG';
  const out = await heicConvert({
    buffer: bytes,
    format,
    quality: opts.quality ?? 0.85,
  });
  return out instanceof Uint8Array ? out : new Uint8Array(out);
}
