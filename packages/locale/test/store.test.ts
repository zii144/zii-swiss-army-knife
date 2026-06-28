import { describe, it, expect } from 'vitest';
import { createLocaleStore } from '../src/index';

const pack = (market: string, effectiveDate: string, year: number) => ({
  market,
  year,
  effectiveDate,
  dateFormat: 'yyyy-MM-dd',
  currency: 'USD',
  units: 'imperial',
});

describe('LocaleStore', () => {
  it('resolves the effective version by date', () => {
    const s = createLocaleStore();
    s.add(pack('en-us', '2025-01-01', 2025));
    s.add(pack('en-us', '2026-01-01', 2026));
    expect(s.resolve('en-us', new Date('2025-06-01'))?.year).toBe(2025);
    expect(s.resolve('en-us', new Date('2026-06-01'))?.year).toBe(2026);
  });

  it('never returns a future-dated pack', () => {
    const s = createLocaleStore();
    s.add(pack('en-us', '2026-01-01', 2026));
    expect(s.resolve('en-us', new Date('2025-06-01'))).toBeUndefined();
  });

  it('follows the fallback chain en-ca -> en-gb -> en-us', () => {
    const s = createLocaleStore();
    s.add(pack('en-us', '2026-01-01', 2026));
    s.add(pack('en-gb', '2026-01-01', 2026));
    // no en-ca pack -> falls back to en-gb
    expect(s.resolve('en-ca', new Date('2026-06-01'))?.market).toBe('en-gb');
  });

  it('lists versions newest-first', () => {
    const s = createLocaleStore();
    s.add(pack('jp', '2025-01-01', 2025));
    s.add(pack('jp', '2026-01-01', 2026));
    expect(s.versions('jp').map((p) => p.year)).toEqual([2026, 2025]);
  });

  it('hot-loads a pack from an injected fetch provider', async () => {
    const s = createLocaleStore();
    const fakeFetch = () => Promise.resolve({ json: () => Promise.resolve(pack('jp', '2026-01-01', 2026)) });
    const loaded = await s.loadFromUrl(fakeFetch, 'https://cdn.example/jp.json');
    expect(loaded.market).toBe('jp');
    expect(s.resolve('jp', new Date('2026-06-01'))?.market).toBe('jp');
  });
});
