import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  createComputeRegistryWithWasm,
  IMPLEMENTED_OP_IDS,
  REAL_WASM_OPS,
} from '../src/ops';

const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

describe('createComputeRegistryWithWasm', () => {
  it('still runs the native sha-256 op', async () => {
    const r = createComputeRegistryWithWasm();
    expect(await r.run('sha-256', new TextEncoder().encode('abc'))).toBe(SHA256_ABC);
  });

  it('runs the real pdf-merge op end-to-end through the registry', async () => {
    const a = await (await PDFDocument.create()).save();
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    const b = await doc.save();
    const r = createComputeRegistryWithWasm();
    const merged = (await r.run('pdf-merge', [a, b])) as Uint8Array;
    expect(new TextDecoder().decode(merged.subarray(0, 5))).toBe('%PDF-');
  });

  it('runs the real qr round-trip through the registry', async () => {
    const r = createComputeRegistryWithWasm();
    const png = (await r.run('qr-generate', 'ZII-REG')) as Uint8Array;
    const scanned = (await r.run('qr-scan', png)) as { text: string }[];
    expect(scanned.map((s) => s.text)).toContain('ZII-REG');
  });

  it('runs the real archive zip/unzip ops through the registry', async () => {
    const r = createComputeRegistryWithWasm();
    const zip = (await r.run('archive-zip', { 'a.txt': 'hi' })) as Uint8Array;
    const out = (await r.run('archive-unzip', zip)) as Record<string, Uint8Array>;
    expect(new TextDecoder().decode(out['a.txt'])).toBe('hi');
  });

  it('implements every heavy op id that @zii/compute declares', () => {
    const declared = REAL_WASM_OPS.map((o) => o.meta.id).sort();
    expect([...IMPLEMENTED_OP_IDS].sort()).toEqual(declared);
  });

  it('video-convert fails loudly with server-fallback guidance in Node', async () => {
    const r = createComputeRegistryWithWasm();
    await expect(r.run('video-convert', new Uint8Array([0]), { to: 'mp4' })).rejects.toThrow(
      /cross-origin-isolated|@zii\/backend conversion worker/,
    );
  });

  it('rejects bad input types with a clear message', async () => {
    const r = createComputeRegistryWithWasm();
    await expect(r.run('pdf-merge', 'not-an-array')).rejects.toThrow(/array of Uint8Array/);
  });
});
