import { LocalePackSchema } from './schema';
import type { LocalePack, Market } from './schema';

/**
 * Market fallback chains. Example from the plan: en-CA → en-GB → en (en-us as base English).
 * CJK markets have no fallback (their packs are authoritative).
 */
export const FALLBACK: Readonly<Record<Market, readonly Market[]>> = {
  'en-ca': ['en-gb', 'en-us'],
  'en-au': ['en-gb', 'en-us'],
  'en-gb': ['en-us'],
  'en-us': [],
  tw: [],
  hk: [],
  jp: [],
  ko: [],
  de: [],
  fr: [],
  global: [],
};

export interface FetchResponse {
  json(): Promise<unknown>;
}

/** Injected fetch provider (keeps the store offline-first and testable). */
export type FetchLike = (url: string) => Promise<FetchResponse>;

/**
 * Holds locale packs (multiple markets × multiple effective dates) and resolves
 * the effective pack for a market on a given date, following the fallback chain.
 */
export class LocaleStore {
  readonly #packs: LocalePack[] = [];

  /** Validate and add a pack. Throws on invalid input. */
  add(pack: unknown): LocalePack {
    const parsed = LocalePackSchema.parse(pack);
    this.#packs.push(parsed);
    return parsed;
  }

  addMany(packs: readonly unknown[]): void {
    for (const p of packs) this.add(p);
  }

  /** All packs for a market, newest effectiveDate first. */
  versions(market: Market): LocalePack[] {
    return this.#packs
      .filter((p) => p.market === market)
      .sort((a, b) => (a.effectiveDate < b.effectiveDate ? 1 : -1));
  }

  /**
   * Effective pack for `market` as of `on` (the latest pack whose effectiveDate
   * is on or before `on`), following the fallback chain if the market has none.
   */
  resolve(market: Market, on: Date = new Date()): LocalePack | undefined {
    const chain: Market[] = [market, ...FALLBACK[market]];
    for (const m of chain) {
      const candidates = this.#packs
        .filter((p) => p.market === m && new Date(p.effectiveDate).getTime() <= on.getTime())
        .sort((a, b) => (a.effectiveDate < b.effectiveDate ? 1 : -1));
      const [latest] = candidates;
      if (latest !== undefined) return latest;
    }
    return undefined;
  }

  /** Hot-update: fetch a pack JSON from a URL, validate, and add it. */
  async loadFromUrl(fetchFn: FetchLike, url: string): Promise<LocalePack> {
    const res = await fetchFn(url);
    return this.add(await res.json());
  }
}

export function createLocaleStore(): LocaleStore {
  return new LocaleStore();
}
