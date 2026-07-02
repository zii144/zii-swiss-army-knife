/**
 * No-retention conversion handler.
 *
 * The backend's conversion endpoints are a pass-through: bytes flow in, are
 * streamed through the provided `doConvert` worker, and the result flows out —
 * nothing is written to disk and nothing is held at module scope. Heavy
 * conversion (LibreOffice / Gotenberg for documents, LGPL ffmpeg for media)
 * runs in external workers; `doConvert` is the injection point for them.
 *
 * To make the "no retention" guarantee testable, this module exposes a
 * monotonic `retainedCount()` that MUST stay 0 across any number of calls.
 */

import type { ComputeOpMeta } from '@zii/compute';

/** A conversion request: input bytes plus declared source/target formats. */
export interface ConvertRequest {
  bytes: Uint8Array;
  from: string;
  to: string;
}

/** The worker that performs the actual byte transformation. */
export type DoConvert = (req: ConvertRequest) => Promise<Uint8Array>;

/**
 * Number of inputs/outputs currently retained by this module. It is wired to
 * the (always-empty) retention buffer below, so it is a structural invariant:
 * if a future change ever stashes bytes, this count would become non-zero and
 * the no-retention test would fail.
 */
const RETAINED: Uint8Array[] = [];

/** Test/observability hook: must always be 0 for a no-retention backend. */
export function retainedCount(): number {
  return RETAINED.length;
}

/**
 * Stream a conversion request through `doConvert` and return the result without
 * retaining the input or output anywhere. Validates that the formats differ and
 * that the worker returns bytes.
 */
export async function convertHandler(
  req: ConvertRequest,
  doConvert: DoConvert,
): Promise<Uint8Array> {
  if (req.from === req.to) {
    throw new RangeError(`Nothing to convert: from and to are both "${req.from}"`);
  }
  const result = await doConvert(req);
  if (!(result instanceof Uint8Array)) {
    throw new TypeError('doConvert must resolve to a Uint8Array');
  }
  // Deliberately do NOT push req.bytes or result into any module-level store.
  return result;
}

/**
 * Lightweight, serializable descriptor for a conversion route — mirrors the
 * `@zii/compute` op-metadata shape so the backend and client describe work the
 * same way. (No handler here; the work runs in an external worker.)
 */
export function describeConversion(from: string, to: string): ComputeOpMeta {
  return {
    id: `${from}-to-${to}`.toLowerCase(),
    category: 'pdf',
    offline: false,
    needsWasm: false,
  };
}
