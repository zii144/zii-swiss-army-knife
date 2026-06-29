import { describe, it, expect } from 'vitest';
import { testRegex } from '../src/index';

describe('testRegex', () => {
  it('finds all global matches with positions', () => {
    const r = testRegex('\\d+', 'a12b345c6');
    expect(r.valid).toBe(true);
    expect(r.matches.map((m) => m.match)).toEqual(['12', '345', '6']);
    expect(r.matches[0]?.index).toBe(1);
  });

  it('captures positional and named groups', () => {
    const r = testRegex('(?<y>\\d{4})-(?<m>\\d{2})', '2026-06 and 2025-12');
    expect(r.matches).toHaveLength(2);
    expect(r.matches[0]?.groups).toEqual(['2026', '06']);
    expect(r.matches[0]?.named).toEqual({ y: '2026', m: '06' });
  });

  it('reports invalid patterns without throwing', () => {
    const r = testRegex('(', 'x');
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
    expect(r.matches).toEqual([]);
  });

  it('does not hang on a zero-width match', () => {
    const r = testRegex('a*', 'aabaa');
    expect(r.valid).toBe(true);
    expect(r.matches.length).toBeGreaterThan(0);
  });

  it('honours provided flags (case-insensitive)', () => {
    const r = testRegex('zii', 'ZII zii Zii', 'i');
    expect(r.matches).toHaveLength(3);
  });
});
