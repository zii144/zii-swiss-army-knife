import { describe, it, expect } from 'vitest';
import { createZip, extractZip, extractZipText } from '../src/archive';

describe('archive (zip) ops', () => {
  it('round-trips files through zip → unzip', () => {
    const zip = createZip({ 'a.txt': 'hello', 'dir/b.txt': 'world' });
    const out = extractZipText(zip);
    expect(out['a.txt']).toBe('hello');
    expect(out['dir/b.txt']).toBe('world');
  });

  it('preserves raw bytes exactly', () => {
    const bytes = new Uint8Array([0, 1, 2, 253, 254, 255]);
    const zip = createZip({ 'blob.bin': bytes });
    const out = extractZip(zip);
    expect(Array.from(out['blob.bin'] ?? [])).toEqual([0, 1, 2, 253, 254, 255]);
  });

  it('produces a valid ZIP local-file-header signature (PK\\x03\\x04)', () => {
    const zip = createZip({ 'x.txt': 'x' });
    expect(zip[0]).toBe(0x50);
    expect(zip[1]).toBe(0x4b);
    expect(zip[2]).toBe(0x03);
    expect(zip[3]).toBe(0x04);
  });
});
