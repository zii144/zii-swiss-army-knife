import { describe, it, expect } from 'vitest';
import { base32Encode, base32EncodeText, base32DecodeText } from '../src/totp';

describe('base32', () => {
  it('round-trips text', () => {
    expect(base32DecodeText(base32EncodeText('Hello!'))).toBe('Hello!');
  });

  // RFC 4648 §10. A round-trip alone passes with or without padding — the
  // decoder strips "=" — so the exact encoding has to be pinned separately.
  it.each([
    ['', ''],
    ['f', 'MY======'],
    ['fo', 'MZXQ===='],
    ['foo', 'MZXW6==='],
    ['foob', 'MZXW6YQ='],
    ['fooba', 'MZXW6YTB'],
    ['foobar', 'MZXW6YTBOI======'],
  ])('encodes %j to the padded RFC 4648 vector', (input, expected) => {
    expect(base32EncodeText(input)).toBe(expected);
  });

  it('pads output to a multiple of 8 characters', () => {
    for (const s of ['', 'a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg']) {
      expect(base32EncodeText(s).length % 8).toBe(0);
    }
  });

  it('decodes padded input back to the original bytes', () => {
    for (const s of ['f', 'fo', 'foo', 'foob', 'fooba', 'foobar']) {
      expect(base32DecodeText(base32EncodeText(s))).toBe(s);
    }
  });

  // The byte-level encoder backs otpauth secrets, which are conventionally
  // written unpadded. Keep it that way — only the text wrapper pads.
  it('leaves the raw byte encoder unpadded for otpauth secrets', () => {
    expect(base32Encode(new TextEncoder().encode('foobar'))).toBe('MZXW6YTBOI');
    expect(base32Encode(new TextEncoder().encode('f'))).toBe('MY');
  });
});
