/**
 * Minimal ambient types for `heic-convert` (ships no types of its own).
 * Covers only the small surface this package uses.
 */
declare module 'heic-convert' {
  interface ConvertOptions {
    /** The HEIC/HEIF input file bytes. */
    buffer: ArrayBufferLike | Uint8Array;
    /** Output format. */
    format: 'JPEG' | 'PNG';
    /** JPEG quality in the range 0..1 (ignored for PNG). */
    quality?: number;
  }
  /** Decode a HEIC/HEIF buffer and re-encode it as JPEG or PNG. */
  function convert(options: ConvertOptions): Promise<Uint8Array>;
  export default convert;
}
