import { describe, it, expect } from 'vitest';
import { createRegistry } from '../src/index';
import type { ToolMeta } from '../src/index';

const meta = (id: string, markets: ToolMeta['markets'] = ['global']): ToolMeta => ({
  id,
  name: id,
  category: 'calc',
  markets,
  offline: true,
});

const noopLoader = () => Promise.resolve({ default: 1 });

describe('ToolRegistry', () => {
  it('registers and retrieves a tool', () => {
    const r = createRegistry();
    r.register(meta('percentage'), noopLoader);
    expect(r.has('percentage')).toBe(true);
    expect(r.get('percentage')?.category).toBe('calc');
  });

  it('rejects duplicate ids', () => {
    const r = createRegistry();
    r.register(meta('dup'), noopLoader);
    expect(() => r.register(meta('dup'), noopLoader)).toThrow(/already registered/);
  });

  it('enforces kebab-case ids', () => {
    const r = createRegistry();
    expect(() => r.register(meta('NotKebab'), noopLoader)).toThrow(/kebab-case/);
  });

  it('filters tools by market (global tools always included)', () => {
    const r = createRegistry();
    r.register(meta('global-tool', ['global']), noopLoader);
    r.register(meta('tw-only', ['tw']), noopLoader);
    expect(r.list('jp').map((t) => t.id)).toContain('global-tool');
    expect(r.list('jp').map((t) => t.id)).not.toContain('tw-only');
    expect(r.list('tw').map((t) => t.id).sort()).toEqual(['global-tool', 'tw-only']);
  });

  it('searches by id, name, and keyword', () => {
    const r = createRegistry();
    r.register({ ...meta('qr-code'), keywords: ['barcode'] }, noopLoader);
    expect(r.search('barcode').map((t) => t.id)).toContain('qr-code');
    expect(r.search('qr').map((t) => t.id)).toContain('qr-code');
    expect(r.search('').map((t) => t.id)).toContain('qr-code');
  });

  it('lazily loads a tool implementation', async () => {
    const r = createRegistry();
    r.register(meta('answer'), () => Promise.resolve({ default: 42 }));
    expect(await r.load('answer')).toBe(42);
  });

  it('throws when loading an unknown tool', async () => {
    const r = createRegistry();
    await expect(r.load('nope')).rejects.toThrow(/Unknown tool/);
  });
});
