import { describe, it, expect } from 'vitest';
import { createRegistry } from '@zii/registry';
import type { ToolMeta, ToolRegistry } from '@zii/registry';
import { registerHelloTool } from '@zii/hello-tool';
import { filterTools, formatToolCount, marketLabel, SELECTABLE_MARKETS } from '../src/lib/tools';

const meta = (id: string, name: string, markets: ToolMeta['markets']): ToolMeta => ({
  id,
  name,
  category: 'calc',
  markets,
  offline: true,
});
const noop = () => Promise.resolve({ default: 1 });

function seeded(): ToolRegistry {
  const r = createRegistry();
  r.register(meta('zed-tool', 'Zed Tool', ['global']), noop);
  r.register(meta('alpha-tool', 'Alpha Tool', ['tw']), noop);
  r.register(meta('jp-tool', 'JP Tool', ['jp']), noop);
  return r;
}

describe('filterTools', () => {
  it('returns global + market tools, sorted by name', () => {
    const r = seeded();
    const tw = filterTools(r, { market: 'tw', query: '' });
    expect(tw.map((t) => t.name)).toEqual(['Alpha Tool', 'Zed Tool']);
  });

  it('excludes tools from other markets', () => {
    const r = seeded();
    const jp = filterTools(r, { market: 'jp', query: '' });
    expect(jp.map((t) => t.id)).toEqual(['jp-tool', 'zed-tool']);
    expect(jp.map((t) => t.id)).not.toContain('alpha-tool');
  });

  it('filters by query within the selected market', () => {
    const r = seeded();
    const res = filterTools(r, { market: 'tw', query: 'alpha' });
    expect(res.map((t) => t.id)).toEqual(['alpha-tool']);
  });

  it('works with the registered hello tool', () => {
    const r = createRegistry();
    registerHelloTool(r);
    const res = filterTools(r, { market: 'global', query: 'demo' });
    expect(res.map((t) => t.id)).toEqual(['hello']);
  });
});

describe('formatToolCount', () => {
  it('pluralizes correctly', () => {
    expect(formatToolCount(0)).toBe('0 tools');
    expect(formatToolCount(1)).toBe('1 tool');
    expect(formatToolCount(3)).toBe('3 tools');
  });

  it('clamps negative and truncates fractional input', () => {
    expect(formatToolCount(-5)).toBe('0 tools');
    expect(formatToolCount(2.9)).toBe('2 tools');
  });
});

describe('marketLabel', () => {
  it('labels known markets', () => {
    expect(marketLabel('tw')).toBe('Taiwan');
    expect(marketLabel('global')).toBe('Global');
  });

  it('every selectable market has a non-empty label', () => {
    for (const m of SELECTABLE_MARKETS) {
      expect(marketLabel(m).length).toBeGreaterThan(0);
    }
  });
});
