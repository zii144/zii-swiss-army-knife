import { describe, it, expect } from 'vitest';
import { base32Decode, totpCode } from '../src/totp';

describe('totpCode', () => {
  it('generates Google Authenticator test vector', async () => {
    // JBSWY3DPEHPK3PXP → Hello! + 0xDEADBEEF, time 1111111111 → 358462
    expect(await totpCode('JBSWY3DPEHPK3PXP', { time: 1_111_111_111_000 })).toBe('358462');
  });

  it('decodes base32', () => {
    const bytes = [...base32Decode('JBSWY3DPEHPK3PXP')];
    expect(bytes.slice(0, 6).map((b) => String.fromCharCode(b)).join('')).toBe('Hello!');
    expect(bytes.slice(6)).toEqual([0xde, 0xad, 0xbe, 0xef]);
  });
});
