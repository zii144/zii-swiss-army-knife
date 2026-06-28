import { describe, it, expect } from 'vitest';
import { TTLCache } from '../src/index';

/** A controllable clock for deterministic expiry tests (no real timers). */
function fakeClock(start = 0): { now: () => number; advance: (ms: number) => void } {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

describe('TTLCache', () => {
  it('stores and retrieves a live value', () => {
    const clock = fakeClock();
    const cache = new TTLCache<number>(clock.now);
    cache.set('a', 42, 1000);
    expect(cache.get('a')).toBe(42);
  });

  it('returns undefined for a missing key', () => {
    const cache = new TTLCache<string>(fakeClock().now);
    expect(cache.get('nope')).toBeUndefined();
  });

  it('returns undefined once an entry has expired (injected clock)', () => {
    const clock = fakeClock();
    const cache = new TTLCache<string>(clock.now);
    cache.set('k', 'v', 1000);
    clock.advance(999);
    expect(cache.get('k')).toBe('v'); // still live just before TTL
    clock.advance(1); // now at exactly TTL → expired
    expect(cache.get('k')).toBeUndefined();
  });

  it('treats the expiry boundary as expired (>= expiresAt)', () => {
    const clock = fakeClock();
    const cache = new TTLCache<string>(clock.now);
    cache.set('k', 'v', 500);
    clock.advance(500);
    expect(cache.get('k')).toBeUndefined();
  });

  it('has() reflects expiry', () => {
    const clock = fakeClock();
    const cache = new TTLCache<number>(clock.now);
    cache.set('x', 1, 100);
    expect(cache.has('x')).toBe(true);
    clock.advance(100);
    expect(cache.has('x')).toBe(false);
  });

  it('overwrites with a fresh TTL on re-set', () => {
    const clock = fakeClock();
    const cache = new TTLCache<number>(clock.now);
    cache.set('x', 1, 100);
    clock.advance(80);
    cache.set('x', 2, 100); // resets expiry from now
    clock.advance(80);
    expect(cache.get('x')).toBe(2);
  });

  it('delete() removes an entry', () => {
    const cache = new TTLCache<number>(fakeClock().now);
    cache.set('x', 1, 1000);
    expect(cache.delete('x')).toBe(true);
    expect(cache.get('x')).toBeUndefined();
    expect(cache.delete('x')).toBe(false);
  });

  it('size counts only live entries and prunes expired ones', () => {
    const clock = fakeClock();
    const cache = new TTLCache<number>(clock.now);
    cache.set('a', 1, 100);
    cache.set('b', 2, 300);
    expect(cache.size).toBe(2);
    clock.advance(150); // 'a' expired, 'b' live
    expect(cache.size).toBe(1);
  });

  it('clear() empties the cache', () => {
    const cache = new TTLCache<number>(fakeClock().now);
    cache.set('a', 1, 1000);
    cache.set('b', 2, 1000);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
