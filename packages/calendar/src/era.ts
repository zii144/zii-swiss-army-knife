/**
 * Era conversions: Republic of China (ROC / 民國) and Japanese imperial eras.
 *
 * All functions are pure, deterministic, and operate on UTC fields of the
 * provided `Date` so results don't drift with the host time zone.
 */

/** ROC year offset: ROC year 1 === Gregorian 1912. */
const ROC_OFFSET = 1911;

/** Gregorian year -> ROC (民國) year. e.g. 2026 -> 115. */
export function gregorianToRoc(year: number): number {
  return year - ROC_OFFSET;
}

/** ROC (民國) year -> Gregorian year. e.g. 115 -> 2026. */
export function rocToGregorian(rocYear: number): number {
  return rocYear + ROC_OFFSET;
}

/** Identifier for a Japanese imperial era (nengō). */
export type JapaneseEraName = 'reiwa' | 'heisei' | 'showa' | 'taisho' | 'meiji';

export interface JapaneseEra {
  era: JapaneseEraName;
  /** 1-based year within the era (the first calendar year is "year 1"). */
  year: number;
  /** Localized label, e.g. "令和8年". */
  label: string;
}

interface EraDefinition {
  era: JapaneseEraName;
  kanji: string;
  /** Inclusive start as [year, month (1-12), day]. */
  start: [number, number, number];
}

/**
 * Era boundaries, newest first. Each era runs from its start date (inclusive)
 * up to the day before the next-newer era's start.
 *   - 令和 (reiwa):  2019-05-01 ..
 *   - 平成 (heisei): 1989-01-08 .. 2019-04-30
 *   - 昭和 (showa):  1926-12-25 .. 1989-01-07
 *   - 大正 (taisho): 1912-07-30 .. 1926-12-24
 *   - 明治 (meiji):  ..          .. 1912-07-29
 */
const ERAS: readonly EraDefinition[] = [
  { era: 'reiwa', kanji: '令和', start: [2019, 5, 1] },
  { era: 'heisei', kanji: '平成', start: [1989, 1, 8] },
  { era: 'showa', kanji: '昭和', start: [1926, 12, 25] },
  { era: 'taisho', kanji: '大正', start: [1912, 7, 30] },
  { era: 'meiji', kanji: '明治', start: [1868, 1, 1] },
];

/** Comparable integer key from a (year, month, day) triple: YYYYMMDD. */
function dateKey(year: number, month: number, day: number): number {
  return year * 10000 + month * 100 + day;
}

/**
 * Resolve a Gregorian `Date` to its Japanese imperial era.
 * Uses UTC fields, so callers should construct dates as `new Date('YYYY-MM-DD')`.
 */
export function toJapaneseEra(date: Date): JapaneseEra {
  const key = dateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  for (const def of ERAS) {
    const startKey = dateKey(def.start[0], def.start[1], def.start[2]);
    if (key >= startKey) {
      const eraYear = date.getUTCFullYear() - def.start[0] + 1;
      return { era: def.era, year: eraYear, label: `${def.kanji}${eraYear}年` };
    }
  }
  throw new RangeError(
    `Date ${date.toISOString()} predates the Meiji era; not representable as a Japanese era.`,
  );
}

/**
 * Convert an era + 1-based era year to its Gregorian calendar year.
 * Note: an era year maps to the Gregorian year in which that era year begins.
 */
export function japaneseEraToGregorian(era: JapaneseEraName, year: number): number {
  const def = ERAS.find((e) => e.era === era);
  if (def === undefined) {
    throw new RangeError(`Unknown Japanese era: ${era}`);
  }
  if (year < 1) {
    throw new RangeError(`Era year must be >= 1, received ${year}`);
  }
  return def.start[0] + year - 1;
}
