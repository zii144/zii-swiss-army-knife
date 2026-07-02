import { describe, it, expect } from 'vitest';
import { sha256Hex, sha1Hex, sha512Hex, digestHex, md5Hex } from '../src/index';

// Well-known NIST test vectors for the input "abc".
const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const SHA1_ABC = 'a9993e364706816aba3e25717850c26c9cd0d89d';
const SHA512_ABC =
  'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f';
const MD5_ABC = '900150983cd24fb0d6963f7d28e17f72';

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

  it('computes SHA-512 of "abc"', async () => {
    expect(await sha512Hex('abc')).toBe(SHA512_ABC);
  });

  it('computes MD5 of "abc"', () => {
    expect(md5Hex('abc')).toBe(MD5_ABC);
  });
});
