/** Chinese zodiac (生肖) sign resolution. */

export const ZODIAC_ANIMALS = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
] as const;

export type ZodiacAnimal = (typeof ZODIAC_ANIMALS)[number];

/**
 * Chinese zodiac sign for a Gregorian year.
 *
 * Baseline: 2020 is the year of the rat (index 0). The 12-year cycle then
 * advances by year. This uses the Gregorian year boundary, not the lunar new
 * year, so years near January/February may differ from the lunar calendar.
 * e.g. 2026 -> 'horse'.
 */
export function chineseZodiac(year: number): ZodiacAnimal {
  // Modulo that is always in [0, 12) even for years before the baseline.
  const index = (((year - 2020) % 12) + 12) % 12;
  const animal = ZODIAC_ANIMALS[index];
  // index is guaranteed in-range, but guard for noUncheckedIndexedAccess.
  if (animal === undefined) {
    throw new RangeError(`Zodiac index out of range: ${index}`);
  }
  return animal;
}
