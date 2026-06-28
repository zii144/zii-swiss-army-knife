import { describe, it, expect } from 'vitest';
import { sha256Hex, sha1Hex, digestHex } from '../src/index';

// Well-known NIST test vectors for the input "abc".
const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const SHA1_ABC = 'a9993e364706816aba3e25717850c26c9cd0d89d';

describe('hash helpers', () => {
  it('computes the SHA-256 of "abc" (string input)', async () => {
    expect(await sha256Hex('abc')).toBe(SHA256_ABC);
  });

  it('computes the SHA-1 of "abc" (string input)', async () => {
    expect(await sha1Hex('abc')).toBe(SHA1_ABC);
  });

  it('accepts Uint8Array input', async () => {
    const bytes = new TextEncoder().encode('abc');
    expect(await sha256Hex(bytes)).toBe(SHA256_ABC);
  });

  it('hashes the empty string', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });

  it('exposes a generic digestHex for both algorithms', async () => {
    expect(await digestHex('SHA-256', 'abc')).toBe(SHA256_ABC);
    expect(await digestHex('SHA-1', 'abc')).toBe(SHA1_ABC);
  });
});
