import { describe, it, expect } from 'vitest';
import { hmacSha256Hex } from '../src/hmac';

describe('hmacSha256Hex', () => {
  it('computes a known HMAC-SHA256 test vector', async () => {
    // RFC 4231 test case 1: key = 0x0b * 20, data = "Hi There"
    const key = new Uint8Array(20).fill(0x0b);
    const data = 'Hi There';
    expect(await hmacSha256Hex(key, data)).toBe(
      'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7',
    );
  });
});
