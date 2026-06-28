/**
 * TTLCache — a tiny in-memory cache with per-entry time-to-live.
 *
 * The clock is injectable so expiry is unit-testable without real timers:
 * pass a `now()` function returning epoch milliseconds. Expired entries are
 * treated as absent (and pruned lazily on access).
 */

/** A monotonic-ish clock returning epoch milliseconds. */
export type Clock = () => number;

interface Entry<T> {
  value: T;
  /** Epoch ms at/after which the entry is considered expired. */
  expiresAt: number;
}

export class TTLCache<T> {
  readonly #store = new Map<string, Entry<T>>();
  readonly #now: Clock;

  /** @param now Injectable clock; defaults to `Date.now` for production use. */
  constructor(now: Clock = () => Date.now()) {
    this.#now = now;
  }

  /** Store `value` under `key`, expiring `ttlMs` from the current clock time. */
  set(key: string, value: T, ttlMs: number): void {
    this.#store.set(key, { value, expiresAt: this.#now() + ttlMs });
  }

  /** Get the live value for `key`, or undefined if missing or expired. */
  get(key: string): T | undefined {
    const entry = this.#store.get(key);
    if (entry === undefined) {
      return undefined;
    }
    if (this.#now() >= entry.expiresAt) {
      this.#store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /** True if `key` has a live (non-expired) entry. */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /** Remove `key`; returns whether it was present. */
  delete(key: string): boolean {
    return this.#store.delete(key);
  }

  /** Drop every entry. */
  clear(): void {
    this.#store.clear();
  }

  /** Count of live (non-expired) entries; prunes expired ones as a side effect. */
  get size(): number {
    let live = 0;
    for (const [key, entry] of this.#store) {
      if (this.#now() >= entry.expiresAt) {
        this.#store.delete(key);
      } else {
        live += 1;
      }
    }
    return live;
  }
}
