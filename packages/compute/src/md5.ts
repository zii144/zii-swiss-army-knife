/**
 * MD5 digest (RFC 1321) as lowercase hex. Pure TypeScript — Web Crypto does
 * not expose MD5, but it is still useful for legacy checksums and file IDs.
 */

const encoder = new TextEncoder();

function toBytes(data: Uint8Array | string): Uint8Array {
  return typeof data === 'string' ? encoder.encode(data) : data;
}

function toHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += (bytes[i] ?? 0).toString(16).padStart(2, '0');
  }
  return hex;
}

/** MD5 of `data` as a lowercase hex string. */
export function md5Hex(data: Uint8Array | string): string {
  const msg = toBytes(data);
  const bitLen = msg.byteLength * 8;

  const padded = new Uint8Array(((msg.byteLength + 8) >> 6) * 64 + 64);
  padded.set(msg);
  padded[msg.byteLength] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.byteLength - 8, bitLen >>> 0, true);
  view.setUint32(padded.byteLength - 4, Math.floor(bitLen / 0x1_0000_0000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i += 1) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x1_0000_0000) >>> 0;
  }

  const rotl = (x: number, c: number): number => ((x << c) | (x >>> (32 - c))) >>> 0;

  for (let offset = 0; offset < padded.byteLength; offset += 64) {
    const M = new Uint32Array(16);
    for (let i = 0; i < 16; i += 1) {
      M[i] = view.getUint32(offset + i * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const tmp = d;
      d = c;
      c = b;
      const sum = (a + f + (K[i] ?? 0) + (M[g] ?? 0)) >>> 0;
      b = (b + rotl(sum, s[i] ?? 0)) >>> 0;
      a = tmp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0, true);
  outView.setUint32(4, b0, true);
  outView.setUint32(8, c0, true);
  outView.setUint32(12, d0, true);
  return toHex(out);
}
