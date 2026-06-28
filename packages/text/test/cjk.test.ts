import { describe, it, expect } from 'vitest';
import { toSimplified, toTraditional } from '../src/index';

describe('toTraditional', () => {
  it('converts simplified to traditional', () => {
    expect(toTraditional('国')).toBe('國');
    expect(toTraditional('软体')).toBe('軟體');
  });

  it('leaves unmapped characters untouched', () => {
    expect(toTraditional('国hello你')).toBe('國hello你');
  });
});

describe('toSimplified', () => {
  it('converts traditional to simplified', () => {
    expect(toSimplified('國')).toBe('国');
    expect(toSimplified('軟體')).toBe('软体');
  });

  it('round-trips for mapped characters', () => {
    expect(toSimplified(toTraditional('国软体电脑'))).toBe('国软体电脑');
  });
});
