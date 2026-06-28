import { ComputeRegistry } from './registry';
import { sha1Hex, sha256Hex } from './hash';
import type { ComputeHandler, ComputeOp, ComputeOpMeta } from './types';

/**
 * Build a {@link ComputeOp} for a heavy WASM op. Its loader resolves
 * immediately to a handler that throws a clear, actionable error — the wiring
 * is present so the app-level `@zii/compute-wasm` bundle can later swap in the
 * real implementation, but nothing heavy is bundled here.
 */
function wasmDescriptor(meta: ComputeOpMeta): ComputeOp {
  return {
    meta,
    load: () =>
      Promise.resolve<ComputeHandler>(() => {
        return Promise.reject(
          new Error(`${meta.id} requires the @zii/compute-wasm bundle (browser runtime)`),
        );
      }),
  };
}

/** Native, no-WASM hashing op backed by `crypto.subtle`. */
function hashOp(id: string, hex: (data: Uint8Array | string) => Promise<string>): ComputeOp {
  return {
    meta: { id, category: 'hash', offline: true, needsWasm: false },
    load: () =>
      Promise.resolve<ComputeHandler>((input) => {
        if (typeof input !== 'string' && !(input instanceof Uint8Array)) {
          return Promise.reject(new Error(`${id} expects a string or Uint8Array input`));
        }
        return hex(input);
      }),
  };
}

/** Native ops that run on-device today with zero WASM. */
export const NATIVE_OPS: readonly ComputeOp[] = [
  hashOp('sha-256', sha256Hex),
  hashOp('sha-1', sha1Hex),
];

/**
 * Heavy ops described (but not bundled). Each loader yields a handler that
 * throws until the app wires the real WASM implementation.
 */
export const WASM_OPS: readonly ComputeOp[] = [
  wasmDescriptor({ id: 'pdf-merge', category: 'pdf', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'pdf-compress', category: 'pdf', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'image-convert', category: 'image', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'heic-to-jpg', category: 'image', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'image-compress', category: 'image', offline: true, needsWasm: true }),
  wasmDescriptor({
    id: 'video-convert',
    category: 'video',
    offline: true,
    needsWasm: true,
    isolated: true,
  }),
  wasmDescriptor({ id: 'qr-generate', category: 'barcode', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'qr-scan', category: 'barcode', offline: true, needsWasm: true }),
  wasmDescriptor({ id: 'archive-zip', category: 'archive', offline: true, needsWasm: true }),
];

/** All ops (native + WASM descriptors) the layer knows about. */
export const ALL_OPS: readonly ComputeOp[] = [...NATIVE_OPS, ...WASM_OPS];

/**
 * Create a registry pre-loaded with every native op and every WASM descriptor.
 * Use this as the default compute layer for the app.
 */
export function createDefaultComputeRegistry(): ComputeRegistry {
  const registry = new ComputeRegistry();
  for (const op of ALL_OPS) {
    registry.register(op);
  }
  return registry;
}

/**
 * Static op metadata for UI feature detection — lets a client decide which
 * ops to surface and whether a cross-origin-isolated context is required.
 */
export function capabilities(): ComputeOpMeta[] {
  return ALL_OPS.map((op) => ({ ...op.meta }));
}
