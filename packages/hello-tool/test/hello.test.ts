import { describe, it, expect } from 'vitest';
import { createRegistry } from '@zii/registry';
import { registerHelloTool } from '../src/index';

describe('hello-tool (M1 smoke test)', () => {
  it('registers into the registry', () => {
    const r = createRegistry();
    registerHelloTool(r);
    expect(r.has('hello')).toBe(true);
    // a global tool shows up in any market
    expect(r.list('tw').map((t) => t.id)).toContain('hello');
    expect(r.list('jp').map((t) => t.id)).toContain('hello');
  });

  it('lazily loads and runs the implementation', async () => {
    const r = createRegistry();
    registerHelloTool(r);
    const impl = (await r.load('hello')) as (name?: string) => string;
    expect(impl()).toBe('Hello, world!');
    expect(impl('Zii')).toBe('Hello, Zii!');
  });
});
