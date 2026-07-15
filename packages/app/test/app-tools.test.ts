import { describe, it, expect } from 'vitest';
import { createRegistry } from '@zii/registry';
import { registerAppTools, TOOL_VIEWS, APP_TOOL_IDS } from '../src/tools';
import { filterTools } from '../src/lib/tools';
import { CATALOG_IDS, HEAVY_TOOLS } from '../src/lib/catalog';

describe('app tool catalogue', () => {
  it('registers every app tool into the registry', () => {
    const r = createRegistry();
    registerAppTools(r);
    for (const id of APP_TOOL_IDS) {
      expect(r.has(id), `registry should contain ${id}`).toBe(true);
    }
  });

  it('exposes a lazy view for every registered tool id', () => {
    for (const id of APP_TOOL_IDS) {
      expect(TOOL_VIEWS[id], `view for ${id}`).toBeDefined();
    }
  });

  it('surfaces every global tool in the global market list', () => {
    const r = createRegistry();
    registerAppTools(r);
    const ids = filterTools(r, { market: 'global', query: '' }).map((t) => t.id);
    // Market-specific tools (tw/hk/jp) are intentionally hidden from `global`.
    const globalIds = r
      .list('global')
      .map((t) => t.id)
      .filter((id) => APP_TOOL_IDS.includes(id));
    expect(ids).toEqual(expect.arrayContaining(globalIds));
    // Every registered tool shows up when no market scope is applied.
    const allIds = r.list().map((t) => t.id);
    expect(allIds).toEqual(expect.arrayContaining([...APP_TOOL_IDS]));
  });

  it('scopes market packs to their region', () => {
    const r = createRegistry();
    registerAppTools(r);
    const tw = filterTools(r, { market: 'tw', query: '' }).map((t) => t.id);
    expect(tw).toContain('tw-national-id');
    expect(tw).toContain('tw-ubn');
    // A Japan-only tool must not leak into the Taiwan list.
    expect(tw).not.toContain('jp-mynumber');
    // Global tools remain visible under any market.
    expect(tw).toContain('image-convert');
    expect(tw).toContain('tw-mobile');

    // The US market surfaces its own packs and hides other regions'.
    const us = filterTools(r, { market: 'en-us', query: '' }).map((t) => t.id);
    expect(us).toEqual(expect.arrayContaining(['us-ssn', 'us-zip', 'us-routing', 'us-ein', 'us-phone']));
    expect(us).not.toContain('tw-national-id');
    expect(us).not.toContain('jp-postal');
    expect(us).not.toContain('uk-postcode');
    expect(us).toContain('image-convert');

    // The UK market surfaces its own packs only.
    const uk = filterTools(r, { market: 'en-gb', query: '' }).map((t) => t.id);
    expect(uk).toEqual(expect.arrayContaining(['uk-postcode', 'uk-nino', 'uk-sort-code']));
    expect(uk).not.toContain('us-ssn');
    expect(uk).toContain('image-convert');

    const ca = filterTools(r, { market: 'en-ca', query: '' }).map((t) => t.id);
    expect(ca).toEqual(
      expect.arrayContaining(['ca-sin', 'ca-takehome', 'ca-postal', 'ca-gst-hst']),
    );
    expect(ca).not.toContain('au-tfn');
    expect(ca).toContain('image-convert');

    const au = filterTools(r, { market: 'en-au', query: '' }).map((t) => t.id);
    expect(au).toEqual(
      expect.arrayContaining(['au-tfn', 'au-takehome', 'au-abn', 'au-gst']),
    );
    expect(au).not.toContain('ca-sin');
    expect(au).toContain('image-convert');

    const ko = filterTools(r, { market: 'ko', query: '' }).map((t) => t.id);
    expect(ko).toEqual(
      expect.arrayContaining(['ko-takehome', 'ko-brn', 'ko-vat', 'ko-postal']),
    );
    expect(ko).not.toContain('de-takehome');
    expect(ko).toContain('image-convert');

    const de = filterTools(r, { market: 'de', query: '' }).map((t) => t.id);
    expect(de).toEqual(
      expect.arrayContaining(['de-takehome', 'de-iban', 'de-vat', 'de-plz']),
    );
    expect(de).not.toContain('fr-brut-net');
    expect(de).toContain('image-convert');

    const fr = filterTools(r, { market: 'fr', query: '' }).map((t) => t.id);
    expect(fr).toEqual(
      expect.arrayContaining(['fr-brut-net', 'fr-siren-siret', 'fr-tva', 'fr-code-postal']),
    );
    expect(fr).not.toContain('ko-takehome');
    expect(fr).toContain('image-convert');

    const es = filterTools(r, { market: 'es', query: '' }).map((t) => t.id);
    expect(es).toEqual(
      expect.arrayContaining(['es-takehome', 'es-dni', 'es-iva', 'es-postal']),
    );
    expect(es).not.toContain('it-takehome');
    expect(es).toContain('image-convert');

    const it = filterTools(r, { market: 'it', query: '' }).map((t) => t.id);
    expect(it).toEqual(
      expect.arrayContaining(['it-takehome', 'it-codice-fiscale', 'it-iva', 'it-cap']),
    );
    expect(it).not.toContain('nl-bsn');
    expect(it).toContain('image-convert');

    const nl = filterTools(r, { market: 'nl', query: '' }).map((t) => t.id);
    expect(nl).toEqual(
      expect.arrayContaining(['nl-takehome', 'nl-bsn', 'nl-btw', 'nl-postcode']),
    );
    expect(nl).not.toContain('sg-nric');
    expect(nl).toContain('image-convert');

    const sg = filterTools(r, { market: 'en-sg', query: '' }).map((t) => t.id);
    expect(sg).toEqual(
      expect.arrayContaining(['sg-takehome', 'sg-nric', 'sg-gst', 'sg-postal']),
    );
    expect(sg).not.toContain('in-pan');
    expect(sg).toContain('image-convert');

    const india = filterTools(r, { market: 'en-in', query: '' }).map((t) => t.id);
    expect(india).toEqual(
      expect.arrayContaining(['in-takehome', 'in-pan', 'in-gst', 'in-pincode']),
    );
    expect(india).not.toContain('es-dni');
    expect(india).toContain('image-convert');

    const pt = filterTools(r, { market: 'pt', query: '' }).map((t) => t.id);
    expect(pt).toEqual(
      expect.arrayContaining(['pt-takehome', 'pt-nif', 'pt-iva', 'pt-postal']),
    );
    expect(pt).not.toContain('br-cpf');
    expect(pt).toContain('image-convert');

    const br = filterTools(r, { market: 'br', query: '' }).map((t) => t.id);
    expect(br).toEqual(
      expect.arrayContaining(['br-takehome', 'br-cpf', 'br-fgts', 'br-cep']),
    );
    expect(br).not.toContain('mx-rfc');
    expect(br).toContain('image-convert');

    const mx = filterTools(r, { market: 'mx', query: '' }).map((t) => t.id);
    expect(mx).toEqual(
      expect.arrayContaining(['mx-takehome', 'mx-rfc', 'mx-iva', 'mx-clabe']),
    );
    expect(mx).not.toContain('pl-pesel');
    expect(mx).toContain('image-convert');

    const pl = filterTools(r, { market: 'pl', query: '' }).map((t) => t.id);
    expect(pl).toEqual(
      expect.arrayContaining(['pl-takehome', 'pl-pesel', 'pl-vat', 'pl-postal']),
    );
    expect(pl).not.toContain('nz-ird');
    expect(pl).toContain('image-convert');

    const nz = filterTools(r, { market: 'en-nz', query: '' }).map((t) => t.id);
    expect(nz).toEqual(
      expect.arrayContaining(['nz-takehome', 'nz-ird', 'nz-gst', 'nz-postal']),
    );
    expect(nz).not.toContain('pt-nif');
    expect(nz).toContain('image-convert');

    // Global market must not surface region-only packs (incl. rescope SIN/TFN).
    const global = filterTools(r, { market: 'global', query: '' }).map((t) => t.id);
    expect(global).not.toContain('ca-sin');
    expect(global).not.toContain('au-tfn');
    expect(global).not.toContain('ko-takehome');
    expect(global).not.toContain('de-takehome');
    expect(global).not.toContain('fr-brut-net');
    expect(global).not.toContain('es-takehome');
    expect(global).not.toContain('it-takehome');
    expect(global).not.toContain('nl-takehome');
    expect(global).not.toContain('sg-takehome');
    expect(global).not.toContain('in-takehome');
    expect(global).not.toContain('pt-takehome');
    expect(global).not.toContain('br-takehome');
    expect(global).not.toContain('mx-takehome');
    expect(global).not.toContain('pl-takehome');
    expect(global).not.toContain('nz-takehome');
  });

  it('only lists real catalogue ids as heavy tools', () => {
    const ids = new Set(CATALOG_IDS);
    for (const id of HEAVY_TOOLS) {
      expect(ids.has(id), `HEAVY_TOOLS id "${id}" is not in the catalogue`).toBe(true);
    }
  });

  it('finds a tool by keyword search', () => {
    const r = createRegistry();
    registerAppTools(r);
    const ids = filterTools(r, { market: 'global', query: 'webp' }).map((t) => t.id);
    expect(ids).toContain('image-convert');
  });
});
