import { describe, it, expect } from 'vitest';
import { ComputeRegistry, createComputeRegistry } from '../src/index';
import type { ComputeHandler, ComputeOp } from '../src/index';

const echoOp = (id: string): ComputeOp => ({
  meta: { id, category: 'hash', offline: true, needsWasm: false },
  load: () => Promise.resolve<ComputeHandler>((input) => Promise.resolve(input)),
});

describe('ComputeRegistry', () => {
  it('registers and retrieves an op', () => {
    const r = createComputeRegistry();
    r.register(echoOp('echo'));
    expect(r.has('echo')).toBe(true);
    expect(r.get('echo')?.meta.category).toBe('hash');
  });

  it('rejects duplicate ids', () => {
    const r = createComputeRegistry();
    r.register(echoOp('dup'));
    expect(() => r.register(echoOp('dup'))).toThrow(/already registered/);
  });

  it('enforces kebab-case ids', () => {
    const r = createComputeRegistry();
    expect(() => r.register(echoOp('NotKebab'))).toThrow(/kebab-case/);
  });

  it('filters ops by category', () => {
    const r = new ComputeRegistry();
    r.register(echoOp('h'));
    r.register({
      meta: { id: 'i', category: 'image', offline: true, needsWasm: true },
      load: () => Promise.resolve<ComputeHandler>(() => Promise.resolve(null)),
    });
    expect(r.list('hash').map((o) => o.meta.id)).toEqual(['h']);
    expect(r.list('image').map((o) => o.meta.id)).toEqual(['i']);
    expect(r.list().map((o) => o.meta.id).sort()).toEqual(['h', 'i']);
  });

  it('runs an op via its lazily-loaded handler', async () => {
    const r = createComputeRegistry();
    r.register({
      meta: { id: 'double', category: 'hash', offline: true, needsWasm: false },
      load: () =>
        Promise.resolve<ComputeHandler>((input) => Promise.resolve((input as number) * 2)),
    });
    expect(await r.run('double', 21)).toBe(42);
  });

  it('rejects run() of an unknown op', async () => {
    const r = createComputeRegistry();
    await expect(r.run('nope', null)).rejects.toThrow(/Unknown compute op/);
  });

  it('loads the handler at most once (caching) across repeated run()s', async () => {
    const r = createComputeRegistry();
    let loadCount = 0;
    r.register({
      meta: { id: 'counted', category: 'hash', offline: true, needsWasm: false },
      load: () => {
        loadCount += 1;
        return Promise.resolve<ComputeHandler>((input) => Promise.resolve(input));
      },
    });
    await r.run('counted', 'a');
    await r.run('counted', 'b');
    await r.run('counted', 'c');
    expect(loadCount).toBe(1);
  });

  it('allows retry after a failed load (cache not poisoned)', async () => {
    const r = createComputeRegistry();
    let attempts = 0;
    r.register({
      meta: { id: 'flaky', category: 'hash', offline: true, needsWasm: false },
      load: () => {
        attempts += 1;
        if (attempts === 1) return Promise.reject(new Error('boom'));
        return Promise.resolve<ComputeHandler>(() => Promise.resolve('ok'));
      },
    });
    await expect(r.run('flaky', null)).rejects.toThrow(/boom/);
    expect(await r.run('flaky', null)).toBe('ok');
    expect(attempts).toBe(2);
  });
});
