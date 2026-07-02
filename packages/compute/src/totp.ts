const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function subtle(): SubtleCrypto {
  const c = globalThis.crypto;
  if (c?.subtle === undefined) throw new Error('Web Crypto unavailable');
  return c.subtle;
}

async function hmacSha1Bytes(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await subtle().importKey('raw', key as BufferSource, { name: 'HMAC', hash: 'SHA-1' }, false, [
    'sign',
  ]);
  const sig = await subtle().sign('HMAC', cryptoKey, data as BufferSource);
  return new Uint8Array(sig);
}

/** Decode base32 (RFC 4648, no padding required). */
export function base32Decode(input: string): Uint8Array {
  const clean = input.replace(/=+$/, '').replace(/\s+/g, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new RangeError(`Invalid base32 character: ${ch}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Uint8Array.from(out);
}

/** Encode bytes as base32 (RFC 4648, no padding). */
export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

/** Encode UTF-8 text to base32. */
export function base32EncodeText(text: string): string {
  return base32Encode(new TextEncoder().encode(text));
}

/** Decode base32 to UTF-8 text. */
export function base32DecodeText(input: string): string {
  return new TextDecoder().decode(base32Decode(input));
}

function counterBytes(counter: number): Uint8Array {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(4, counter >>> 0, false);
  return new Uint8Array(buf);
}

/** Generate a 6-digit TOTP code (RFC 6238 / SHA-1). */
export async function totpCode(
  secretBase32: string,
  opts: { time?: number; step?: number; digits?: number } = {},
): Promise<string> {
  const step = opts.step ?? 30;
  const digits = opts.digits ?? 6;
  const time = opts.time ?? Date.now();
  const counter = Math.floor(time / 1000 / step);
  const key = base32Decode(secretBase32);
  const mac = await hmacSha1Bytes(key, counterBytes(counter));
  const offset = (mac[mac.length - 1] ?? 0) & 0x0f;
  const binary =
    ((mac[offset] ?? 0) << 24) |
    ((mac[offset + 1] ?? 0) << 16) |
    ((mac[offset + 2] ?? 0) << 8) |
    (mac[offset + 3] ?? 0);
  const otp = binary & 0x7fffffff;
  const mod = 10 ** digits;
  return String(otp % mod).padStart(digits, '0');
}
