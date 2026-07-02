/**
 * Native hashing helpers built on the Web Crypto API (`globalThis.crypto.subtle`),
 * available in Node 22+ and all modern browsers. No WASM, no third-party deps.
 */

/** Web Crypto digest algorithm names supported by these helpers. */
export type DigestAlgorithm = 'SHA-256' | 'SHA-1' | 'SHA-384' | 'SHA-512';

const encoder = new TextEncoder();

function toBytes(data: Uint8Array | string): Uint8Array {
  return typeof data === 'string' ? encoder.encode(data) : data;
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    // noUncheckedIndexedAccess: bytes[i] is `number | undefined`; the loop
    // bound guarantees it's defined, but coalesce to keep the type checker happy.
    const byte = bytes[i] ?? 0;
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

function subtle(): SubtleCrypto {
  const c = globalThis.crypto;
  if (c?.subtle === undefined) {
    throw new Error('Web Crypto (crypto.subtle) is not available in this runtime');
  }
  return c.subtle;
}

/** Hash `data` with `algorithm` and return the digest as a lowercase hex string. */
export async function digestHex(
  algorithm: DigestAlgorithm,
  data: Uint8Array | string,
): Promise<string> {
  const bytes = toBytes(data);
  // Pass a fresh ArrayBuffer slice so a possible SharedArrayBuffer/view offset
  // never leaks into the digest call.
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const result = await subtle().digest(algorithm, buffer);
  return toHex(result);
}

/** SHA-256 of `data` as a lowercase hex string. */
export function sha256Hex(data: Uint8Array | string): Promise<string> {
  return digestHex('SHA-256', data);
}

/** SHA-1 of `data` as a lowercase hex string. */
export function sha1Hex(data: Uint8Array | string): Promise<string> {
  return digestHex('SHA-1', data);
}

/** SHA-384 of `data` as a lowercase hex string. */
export function sha384Hex(data: Uint8Array | string): Promise<string> {
  return digestHex('SHA-384', data);
}

/** SHA-512 of `data` as a lowercase hex string. */
export function sha512Hex(data: Uint8Array | string): Promise<string> {
  return digestHex('SHA-512', data);
}
