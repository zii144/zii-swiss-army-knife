import { describe, it, expect } from 'vitest';
import { ageWestern, ageKazoe } from '../src/index';

describe('ageWestern', () => {
  it('counts completed years when the birthday has passed', () => {
    expect(ageWestern(new Date('2000-01-01'), new Date('2026-06-28'))).toBe(26);
  });

  it('subtracts a year when the birthday has not occurred yet', () => {
    expect(ageWestern(new Date('2000-12-31'), new Date('2026-01-01'))).toBe(25);
  });

  it('is exact on the birthday itself', () => {
    expect(ageWestern(new Date('2000-06-28'), new Date('2026-06-28'))).toBe(26);
  });

  it('returns 0 for a newborn', () => {
    expect(ageWestern(new Date('2026-01-01'), new Date('2026-06-28'))).toBe(0);
  });
});

describe('ageKazoe', () => {
  it('(2000-12-31, 2026-01-01) === 27 (golden anchor)', () => {
    // Japanese counted age = on.year - birth.year + 1 = 2026 - 2000 + 1
    expect(ageKazoe(new Date('2000-12-31'), new Date('2026-01-01'))).toBe(27);
  });

  it('is 1 in the year of birth', () => {
    expect(ageKazoe(new Date('2026-03-01'), new Date('2026-06-28'))).toBe(1);
  });

  it('ignores month/day (depends only on calendar years)', () => {
    expect(ageKazoe(new Date('2000-01-01'), new Date('2026-12-31'))).toBe(27);
    expect(ageKazoe(new Date('2000-12-31'), new Date('2026-01-01'))).toBe(27);
  });
});
