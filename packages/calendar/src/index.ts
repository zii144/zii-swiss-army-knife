// @zii/calendar — Calendar & Era engine (M6).
// Pure, offline, deterministic Gregorian-based era / zodiac / age / holiday math.

export { gregorianToRoc, rocToGregorian, toJapaneseEra, japaneseEraToGregorian } from './era';
export type { JapaneseEra, JapaneseEraName } from './era';

export { chineseZodiac, ZODIAC_ANIMALS } from './zodiac';
export type { ZodiacAnimal } from './zodiac';

export { ageWestern, ageKazoe } from './age';

export {
  resolveHolidays,
  substituteIfWeekend,
  isBusinessDay,
  businessDaysBetween,
} from './holidays';
export type { ResolvedHoliday, SubstituteOptions } from './holidays';
