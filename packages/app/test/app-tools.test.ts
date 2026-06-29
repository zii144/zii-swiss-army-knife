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

  it('surfaces the tools in the global market list', () => {
    const r = createRegistry();
    registerAppTools(r);
    const ids = filterTools(r, { market: 'global', query: '' }).map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining([...APP_TOOL_IDS]));
  });

  it('finds a tool by keyword search', () => {
    const r = createRegistry();
    registerAppTools(r);
    const ids = filterTools(r, { market: 'global', query: 'webp' }).map((t) => t.id);
    expect(ids).toContain('image-convert');
  });
});
