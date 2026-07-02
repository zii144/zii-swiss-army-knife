/**
 * HMAC helpers built on the Web Crypto API.
 */

export type HmacAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

const encoder = new TextEncoder();

function subtle(): SubtleCrypto {
  const c = globalThis.crypto;
  if (c?.subtle === undefined) {
    throw new Error('Web Crypto (crypto.subtle) is not available in this runtime');
  }
  return c.subtle;
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += (bytes[i] ?? 0).toString(16).padStart(2, '0');
  }
  return hex;
}

function keyBytes(secret: string | Uint8Array): Uint8Array {
  return typeof secret === 'string' ? encoder.encode(secret) : secret;
}

function dataBytes(data: string | Uint8Array): Uint8Array {
  return typeof data === 'string' ? encoder.encode(data) : data;
}

/** HMAC digest as lowercase hex. */
export async function hmacHex(
  algorithm: HmacAlgorithm,
  secret: string | Uint8Array,
  data: string | Uint8Array,
): Promise<string> {
  const keyMaterial = keyBytes(secret);
  const key = await subtle().importKey(
    'raw',
    keyMaterial.buffer.slice(
      keyMaterial.byteOffset,
      keyMaterial.byteOffset + keyMaterial.byteLength,
    ) as ArrayBuffer,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );
  const msg = dataBytes(data);
  const sig = await subtle().sign(
    'HMAC',
    key,
    msg.buffer.slice(msg.byteOffset, msg.byteOffset + msg.byteLength) as ArrayBuffer,
  );
  return toHex(sig);
}

export function hmacSha256Hex(
  secret: string | Uint8Array,
  data: string | Uint8Array,
): Promise<string> {
  return hmacHex('SHA-256', secret, data);
}

export function hmacSha512Hex(
  secret: string | Uint8Array,
  data: string | Uint8Array,
): Promise<string> {
  return hmacHex('SHA-512', secret, data);
}
