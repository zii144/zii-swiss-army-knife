import { describe, it, expect } from 'vitest';
import {
  capabilities,
  createDefaultComputeRegistry,
  ALL_OPS,
  NATIVE_OPS,
  WASM_OPS,
} from '../src/index';

const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

describe('default compute registry', () => {
  it('runs the native sha-256 op end-to-end', async () => {
    const r = createDefaultComputeRegistry();
    const out = await r.run('sha-256', new TextEncoder().encode('abc'));
    expect(out).toBe(SHA256_ABC);
  });

  it('runs the native sha-1 op end-to-end', async () => {
    const r = createDefaultComputeRegistry();
    const out = await r.run('sha-1', 'abc');
    expect(out).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });

  it('lists the image ops by category', () => {
    const r = createDefaultComputeRegistry();
    const ids = r.list('image').map((o) => o.meta.id).sort();
    expect(ids).toEqual(['heic-to-jpg', 'image-compress', 'image-convert']);
  });

  it('rejects native hash ops given the wrong input type', async () => {
    const r = createDefaultComputeRegistry();
    await expect(r.run('sha-256', 123)).rejects.toThrow(/string or Uint8Array/);
  });

  it('rejects a heavy op with the descriptive WASM-bundle error', async () => {
    const r = createDefaultComputeRegistry();
    await expect(r.run('pdf-merge', null)).rejects.toThrow(
      /pdf-merge requires the @zii\/compute-wasm bundle/,
    );
    await expect(r.run('video-convert', null)).rejects.toThrow(
      /video-convert requires the @zii\/compute-wasm bundle/,
    );
  });
});

describe('capabilities()', () => {
  it('includes every op (native + heavy)', () => {
    const caps = capabilities();
    expect(caps).toHaveLength(ALL_OPS.length);
    expect(caps.length).toBe(NATIVE_OPS.length + WASM_OPS.length);
  });

  it('marks heavy ops with needsWasm:true', () => {
    const caps = capabilities();
    const heavyIds = [
      'pdf-merge',
      'pdf-compress',
      'image-convert',
      'heic-to-jpg',
      'image-compress',
      'video-convert',
      'qr-generate',
      'qr-scan',
      'archive-zip',
    ];
    for (const id of heavyIds) {
      const meta = caps.find((m) => m.id === id);
      expect(meta, `meta for ${id}`).toBeDefined();
      expect(meta?.needsWasm).toBe(true);
    }
  });

  it('marks native hash ops with needsWasm:false', () => {
    const caps = capabilities();
    expect(caps.find((m) => m.id === 'sha-256')?.needsWasm).toBe(false);
    expect(caps.find((m) => m.id === 'sha-1')?.needsWasm).toBe(false);
  });

  it('marks the video op as isolated:true (COOP/COEP ffmpeg route)', () => {
    const caps = capabilities();
    expect(caps.find((m) => m.id === 'video-convert')?.isolated).toBe(true);
  });

  it('does not mark non-video ops as isolated', () => {
    const caps = capabilities();
    const isolated = caps.filter((m) => m.isolated === true).map((m) => m.id);
    expect(isolated).toEqual(['video-convert']);
  });

  it('returns copies (mutating a returned meta does not affect later calls)', () => {
    const first = capabilities();
    const target = first.find((m) => m.id === 'sha-256');
    expect(target).toBeDefined();
    if (target) target.needsWasm = true;
    expect(capabilities().find((m) => m.id === 'sha-256')?.needsWasm).toBe(false);
  });
});
