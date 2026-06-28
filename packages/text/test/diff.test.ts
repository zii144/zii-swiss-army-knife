import { describe, it, expect } from 'vitest';
import { lineDiff } from '../src/index';

describe('lineDiff', () => {
  it('identifies an added line (golden anchor)', () => {
    const diff = lineDiff('a\nb', 'a\nb\nc');
    expect(diff).toEqual([
      { type: 'equal', line: 'a' },
      { type: 'equal', line: 'b' },
      { type: 'add', line: 'c' },
    ]);
    expect(diff.some((d) => d.type === 'add' && d.line === 'c')).toBe(true);
  });

  it('identifies a removed line', () => {
    const diff = lineDiff('a\nb\nc', 'a\nc');
    expect(diff).toEqual([
      { type: 'equal', line: 'a' },
      { type: 'remove', line: 'b' },
      { type: 'equal', line: 'c' },
    ]);
  });

  it('identifies a changed line as remove + add', () => {
    const diff = lineDiff('hello', 'world');
    expect(diff).toEqual([
      { type: 'remove', line: 'hello' },
      { type: 'add', line: 'world' },
    ]);
  });

  it('marks identical input as all equal', () => {
    const diff = lineDiff('x\ny', 'x\ny');
    expect(diff.every((d) => d.type === 'equal')).toBe(true);
    expect(diff).toHaveLength(2);
  });

  it('reconstructs b from the equal+add lines', () => {
    const a = 'one\ntwo\nthree';
    const b = 'one\ntwo-changed\nthree\nfour';
    const reconstructed = lineDiff(a, b)
      .filter((d) => d.type !== 'remove')
      .map((d) => d.line)
      .join('\n');
    expect(reconstructed).toBe(b);
  });
});
