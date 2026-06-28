/**
 * GovDataAdapter — the proxy/cache adapter pattern for public-sector open data.
 *
 * The backend never holds credentials and never retains payloads; an adapter is
 * a pure transform that normalizes a third-party (often messy) shape into a
 * uniform internal one. Pair it with {@link TTLCache} at the call site to cache
 * normalized results for a short window. Gov *auth* flows are never proxied —
 * the client deep-links to the official site instead.
 */

/** A pure normalizer from a raw upstream payload to a uniform shape. */
export interface GovDataAdapter {
  /** Human-readable upstream identifier (e.g. "tw-transit-eta"). */
  source: string;
  /** Transform an opaque upstream payload into a normalized shape. */
  normalize(raw: unknown): unknown;
}

/** Uniform transit-ETA shape produced by the sample adapter. */
export interface NormalizedEta {
  source: string;
  stops: NormalizedStop[];
}

export interface NormalizedStop {
  id: string;
  name: string;
  /** Minutes until the next arrival, or null when unknown. */
  etaMinutes: number | null;
}

/** Type guard for a plain (non-null, non-array) object. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Coerce a possibly-numeric/string ETA into minutes, or null. */
function toEtaMinutes(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Sample adapter: normalizes a fake upstream transit-ETA payload of the shape
 * `{ stops: [{ stopId, stopName, eta }, ...] }` into {@link NormalizedEta}.
 * Tolerant of missing fields and odd types — invalid stops are skipped.
 */
export const transitEtaAdapter: GovDataAdapter = {
  source: 'sample-transit-eta',
  normalize(raw: unknown): NormalizedEta {
    const stops: NormalizedStop[] = [];
    if (isRecord(raw) && Array.isArray(raw.stops)) {
      for (const item of raw.stops) {
        if (!isRecord(item)) {
          continue;
        }
        const id = typeof item.stopId === 'string' ? item.stopId : undefined;
        if (id === undefined) {
          continue; // an entry without an id is unusable
        }
        const name = typeof item.stopName === 'string' ? item.stopName : id;
        stops.push({ id, name, etaMinutes: toEtaMinutes(item.eta) });
      }
    }
    return { source: this.source, stops };
  },
};
