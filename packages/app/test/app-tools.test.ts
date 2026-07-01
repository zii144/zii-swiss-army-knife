import { describe, it, expect } from 'vitest';
import { createRegistry } from '@zii/registry';
import { registerAppTools, TOOL_VIEWS, APP_TOOL_IDS } from '../src/tools';
import { filterTools } from '../src/lib/tools';

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
  });

  it('finds a tool by keyword search', () => {
    const r = createRegistry();
    registerAppTools(r);
    const ids = filterTools(r, { market: 'global', query: 'webp' }).map((t) => t.id);
    expect(ids).toContain('image-convert');
  });
});
