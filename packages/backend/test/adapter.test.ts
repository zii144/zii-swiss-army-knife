import { describe, it, expect } from 'vitest';
import { transitEtaAdapter } from '../src/index';
import type { NormalizedEta } from '../src/index';

describe('transitEtaAdapter.normalize', () => {
  it('normalizes a well-formed payload', () => {
    const raw = {
      stops: [
        { stopId: 'S1', stopName: 'Central', eta: 3 },
        { stopId: 'S2', stopName: 'Admiralty', eta: 7 },
      ],
    };
    const out = transitEtaAdapter.normalize(raw) as NormalizedEta;
    expect(out).toEqual({
      source: 'sample-transit-eta',
      stops: [
        { id: 'S1', name: 'Central', etaMinutes: 3 },
        { id: 'S2', name: 'Admiralty', etaMinutes: 7 },
      ],
    });
  });

  it('coerces a numeric-string eta and defaults a missing name to the id', () => {
    const raw = { stops: [{ stopId: 'S3', eta: '12' }] };
    const out = transitEtaAdapter.normalize(raw) as NormalizedEta;
    expect(out.stops).toEqual([{ id: 'S3', name: 'S3', etaMinutes: 12 }]);
  });

  it('maps an unknown/garbage eta to null', () => {
    const raw = { stops: [{ stopId: 'S4', stopName: 'X', eta: 'soon' }, { stopId: 'S5' }] };
    const out = transitEtaAdapter.normalize(raw) as NormalizedEta;
    expect(out.stops).toEqual([
      { id: 'S4', name: 'X', etaMinutes: null },
      { id: 'S5', name: 'S5', etaMinutes: null },
    ]);
  });

  it('skips entries without a usable id', () => {
    const raw = { stops: [{ stopName: 'no id' }, { stopId: 'S6', eta: 1 }] };
    const out = transitEtaAdapter.normalize(raw) as NormalizedEta;
    expect(out.stops).toEqual([{ id: 'S6', name: 'S6', etaMinutes: 1 }]);
  });

  it('returns an empty stop list for non-object / shapeless input', () => {
    expect((transitEtaAdapter.normalize(null) as NormalizedEta).stops).toEqual([]);
    expect((transitEtaAdapter.normalize('nope') as NormalizedEta).stops).toEqual([]);
    expect((transitEtaAdapter.normalize({ stops: 'x' }) as NormalizedEta).stops).toEqual([]);
  });

  it('exposes a stable source identifier', () => {
    expect(transitEtaAdapter.source).toBe('sample-transit-eta');
  });
});
