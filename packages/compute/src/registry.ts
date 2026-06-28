import type { ComputeCategory, ComputeHandler, ComputeOp } from './types';

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * In-memory registry of {@link ComputeOp}s with category filtering and lazy,
 * cached handler loading. Native ops register a resolved loader; heavy WASM ops
 * register a descriptor whose loader is wired by the app-level bundle.
 */
export class ComputeRegistry {
  readonly #ops = new Map<string, ComputeOp>();
  /** Cache of loaded handlers so each op's `load()` runs at most once. */
  readonly #handlers = new Map<string, Promise<ComputeHandler>>();

  /** Register an op. Throws on duplicate id or non-kebab-case id. */
  register(op: ComputeOp): void {
    const { id } = op.meta;
    if (!KEBAB_CASE.test(id)) {
      throw new Error(`Compute op id "${id}" must be kebab-case`);
    }
    if (this.#ops.has(id)) {
      throw new Error(`Compute op "${id}" is already registered`);
    }
    this.#ops.set(id, op);
  }

  has(id: string): boolean {
    return this.#ops.has(id);
  }

  get(id: string): ComputeOp | undefined {
    return this.#ops.get(id);
  }

  /** All ops, or only those in `category`. */
  list(category?: ComputeCategory): ComputeOp[] {
    const all = [...this.#ops.values()];
    if (category === undefined) return all;
    return all.filter((op) => op.meta.category === category);
  }

  /**
   * Lazily load (once, cached) the handler for `id`, then invoke it with
   * `input`/`opts`. Throws if the op is unknown; if `load()` rejects, the
   * cache entry is cleared so a later call can retry.
   */
  async run(id: string, input: unknown, opts?: Record<string, unknown>): Promise<unknown> {
    const handler = await this.#loadHandler(id);
    return handler(input, opts);
  }

  #loadHandler(id: string): Promise<ComputeHandler> {
    const cached = this.#handlers.get(id);
    if (cached !== undefined) return cached;

    const op = this.#ops.get(id);
    if (op === undefined) {
      return Promise.reject(new Error(`Unknown compute op "${id}"`));
    }

    const loading = op.load().catch((err: unknown) => {
      // Don't poison the cache with a failed load; allow retries.
      this.#handlers.delete(id);
      throw err;
    });
    this.#handlers.set(id, loading);
    return loading;
  }
}

/** Convenience factory for an empty registry. */
export function createComputeRegistry(): ComputeRegistry {
  return new ComputeRegistry();
}
