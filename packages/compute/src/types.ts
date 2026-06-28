/**
 * Client WASM Compute Layer (Module **M4**) type surface.
 *
 * The compute layer is an *abstraction*: it describes every heavy client-side
 * operation (PDF / image / audio / video / archive / hashing / barcodes) as a
 * lazily-loadable {@link ComputeOp}. The small ops that run natively (hashing
 * via `crypto.subtle`, encoding helpers) ship resolved handlers; the heavy ops
 * ship descriptors whose loader is wired later by the app-level WASM bundle.
 */

/** Family an operation belongs to (drives UI grouping + feature detection). */
export type ComputeCategory = 'pdf' | 'image' | 'audio' | 'video' | 'archive' | 'hash' | 'barcode';

/** Static, serializable metadata describing a compute operation. */
export interface ComputeOpMeta {
  /** Unique, kebab-case id (e.g. "heic-to-jpg"). */
  id: string;
  category: ComputeCategory;
  /** True if the op runs fully on-device with no network. */
  offline: boolean;
  /** True if the op needs a WebAssembly module to run. */
  needsWasm: boolean;
  /**
   * True if the op must run in a cross-origin-isolated (COOP/COEP) context,
   * e.g. the multi-threaded ffmpeg.wasm video route.
   */
  isolated?: boolean;
}

/** A runnable compute handler: takes input (+ opts) and resolves to a result. */
export type ComputeHandler = (input: unknown, opts?: Record<string, unknown>) => Promise<unknown>;

/**
 * A registered compute operation: its metadata plus a lazy loader that
 * `import()`s (or otherwise produces) the actual handler. Keeping the handler
 * behind `load()` lets bundlers code-split heavy WASM payloads per op.
 */
export interface ComputeOp {
  meta: ComputeOpMeta;
  load: () => Promise<ComputeHandler>;
}
