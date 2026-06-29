/**
 * ZIP create / extract, powered by fflate (MIT). Pure JS, no WASM, identical in
 * browser and Node.
 */
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';

/** A single file entry: path → bytes (or a UTF-8 string). */
export type ZipEntries = Record<string, Uint8Array | string>;

/** Deflate level: 0 (store) .. 9 (max compression). */
export type DeflateLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Options for {@link createZip}. */
export interface CreateZipOptions {
  /** Deflate level 0 (store) .. 9 (max). Defaults to 6. */
  level?: DeflateLevel;
}

/** Build a ZIP archive from a map of path → contents. */
export function createZip(entries: ZipEntries, opts: CreateZipOptions = {}): Uint8Array {
  const level: DeflateLevel = opts.level ?? 6;
  const normalised: Record<string, [Uint8Array, { level: DeflateLevel }]> = {};
  for (const [path, value] of Object.entries(entries)) {
    const bytes = typeof value === 'string' ? strToU8(value) : value;
    normalised[path] = [bytes, { level }];
  }
  return zipSync(normalised);
}

/** Extract a ZIP archive to a map of path → bytes. */
export function extractZip(zip: Uint8Array): Record<string, Uint8Array> {
  return unzipSync(zip);
}

/** Extract a ZIP and decode every entry as UTF-8 text (convenience for tests/UIs). */
export function extractZipText(zip: Uint8Array): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, bytes] of Object.entries(unzipSync(zip))) {
    out[path] = strFromU8(bytes);
  }
  return out;
}
