import { describe, it, expect } from 'vitest';
import { convertHandler, describeConversion, retainedCount } from '../src/index';

/** A trivial worker that XORs every byte with 0xff (deterministic, reversible). */
function invertBytes(bytes: Uint8Array): Promise<Uint8Array> {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) {
    out[i] = (bytes[i] ?? 0) ^ 0xff;
  }
  return Promise.resolve(out);
}

describe('convertHandler', () => {
  it('streams bytes through the worker and returns the result', async () => {
    const input = new Uint8Array([0, 1, 2, 255]);
    const result = await convertHandler({ bytes: input, from: 'docx', to: 'pdf' }, invertBytes);
    expect(Array.from(result)).toEqual([255, 254, 253, 0]);
  });

  it('rejects a no-op conversion (from === to)', async () => {
    await expect(
      convertHandler({ bytes: new Uint8Array(), from: 'pdf', to: 'pdf' }, invertBytes),
    ).rejects.toThrow(/Nothing to convert/);
  });

  it('rejects a worker that does not return bytes', async () => {
    const badWorker = () => Promise.resolve('oops' as unknown as Uint8Array);
    await expect(
      convertHandler({ bytes: new Uint8Array([1]), from: 'a', to: 'b' }, badWorker),
    ).rejects.toThrow(/Uint8Array/);
  });

  it('retains nothing across many calls (no-retention invariant)', async () => {
    expect(retainedCount()).toBe(0);
    for (let i = 0; i < 50; i += 1) {
      const bytes = new Uint8Array([i, i + 1, i + 2]);
      await convertHandler({ bytes, from: 'in', to: 'out' }, invertBytes);
    }
    expect(retainedCount()).toBe(0);
  });
});

describe('describeConversion', () => {
  it('produces a kebab-case op descriptor mirroring @zii/compute meta', () => {
    const meta = describeConversion('DOCX', 'PDF');
    expect(meta.id).toBe('docx-to-pdf');
    expect(meta.category).toBe('pdf');
    expect(meta.offline).toBe(false);
    expect(meta.needsWasm).toBe(false);
  });
});
