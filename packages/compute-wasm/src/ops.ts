/**
 * Real WASM op handlers, keyed by the same op ids that `@zii/compute` declares
 * as descriptors. {@link createComputeRegistryWithWasm} returns a registry where
 * every heavy op actually runs (PDF/image/HEIC/QR/archive) plus the native hash
 * ops — the production compute layer for the app and the backend worker.
 */
import {
  ComputeRegistry,
  NATIVE_OPS,
  WASM_OPS,
  type ComputeHandler,
  type ComputeOp,
} from '@zii/compute';
import { mergePdfs, splitPdf, compressPdf } from './pdf';
import { convertImage, compressImage, type ImageFormat } from './image';
import { heicToJpg } from './heic';
import { generateQr, scanQr } from './qr';
import { createZip, extractZip, type ZipEntries } from './archive';
import { convertVideo } from './video';

function asBytes(input: unknown, op: string): Uint8Array {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  throw new Error(`${op}: expected Uint8Array (or ArrayBuffer) input`);
}

function asBytesArray(input: unknown, op: string): Uint8Array[] {
  if (!Array.isArray(input)) throw new Error(`${op}: expected an array of Uint8Array inputs`);
  return input.map((b, i) => asBytes(b, `${op}[${i}]`));
}

function opt<T>(opts: Record<string, unknown> | undefined, key: string): T | undefined {
  return opts?.[key] as T | undefined;
}

/** Real handlers for each heavy op id. */
const HANDLERS: Record<string, ComputeHandler> = {
  'pdf-merge': (input) => mergePdfs(asBytesArray(input, 'pdf-merge')),
  'pdf-split': (input, opts) =>
    splitPdf(asBytes(input, 'pdf-split'), { pages: opt<number[]>(opts, 'pages') }),
  'pdf-compress': (input) => compressPdf(asBytes(input, 'pdf-compress')),
  'image-convert': (input, opts) => {
    const to = opt<ImageFormat>(opts, 'to');
    if (!to) throw new Error('image-convert: opts.to (target format) is required');
    return convertImage(asBytes(input, 'image-convert'), {
      to,
      from: opt<ImageFormat>(opts, 'from'),
      quality: opt<number>(opts, 'quality'),
    });
  },
  'image-compress': (input, opts) =>
    compressImage(asBytes(input, 'image-compress'), {
      format: opt<ImageFormat>(opts, 'format'),
      quality: opt<number>(opts, 'quality'),
    }),
  'heic-to-jpg': (input, opts) =>
    heicToJpg(asBytes(input, 'heic-to-jpg'), {
      format: opt<'JPEG' | 'PNG'>(opts, 'format'),
      quality: opt<number>(opts, 'quality'),
    }),
  'qr-generate': (input, opts) => {
    if (typeof input !== 'string') throw new Error('qr-generate: expected a string input');
    return generateQr(input, { format: opt<'QRCode'>(opts, 'format') });
  },
  'qr-scan': (input) => scanQr(asBytes(input, 'qr-scan')),
  'archive-zip': (input, opts) =>
    Promise.resolve(
      createZip(input as ZipEntries, { level: opt<CreateZipLevel>(opts, 'level') }),
    ),
  'archive-unzip': (input) => Promise.resolve(extractZip(asBytes(input, 'archive-unzip'))),
  'video-convert': (input, opts) => {
    const to = opt<string>(opts, 'to');
    if (!to) throw new Error('video-convert: opts.to (target container) is required');
    return convertVideo(asBytes(input, 'video-convert'), {
      to,
      inputName: opt<string>(opts, 'inputName'),
      args: opt<string[]>(opts, 'args'),
    });
  },
};

type CreateZipLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Build a real op from a `@zii/compute` descriptor, reusing its frozen meta. */
function realOp(descriptor: ComputeOp): ComputeOp {
  const handler = HANDLERS[descriptor.meta.id];
  if (!handler) return descriptor; // no real impl yet → keep the throwing descriptor
  return { meta: descriptor.meta, load: () => Promise.resolve(handler) };
}

/** Every heavy op, now backed by a real handler. */
export const REAL_WASM_OPS: readonly ComputeOp[] = WASM_OPS.map(realOp);

/** Native ops (hashing) + real heavy ops. */
export const ALL_REAL_OPS: readonly ComputeOp[] = [...NATIVE_OPS, ...REAL_WASM_OPS];

/**
 * A {@link ComputeRegistry} where every op actually runs. Use this as the
 * app/back-end compute layer instead of `createDefaultComputeRegistry()` (which
 * ships throwing descriptors for environments without this bundle).
 */
export function createComputeRegistryWithWasm(): ComputeRegistry {
  const registry = new ComputeRegistry();
  for (const op of ALL_REAL_OPS) registry.register(op);
  return registry;
}

/** The set of op ids this bundle implements for real. */
export const IMPLEMENTED_OP_IDS: readonly string[] = Object.keys(HANDLERS);
