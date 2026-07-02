import { describe, it, expect } from 'vitest';
import { base32EncodeText, base32DecodeText } from '../src/totp';

describe('base32', () => {
  it('round-trips text', () => {
    expect(base32DecodeText(base32EncodeText('Hello!'))).toBe('Hello!');
  });
});
