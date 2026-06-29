/**
 * Chinese lunar calendar (旧暦/農曆), 六曜 (rokuyō), and 二十四節気 (24 solar
 * terms).
 *
 * The astronomy is delegated to `lunar-typescript` (MIT) — a deterministic,
 * fully offline port of the well-known lunar-javascript algorithms (no network,
 * no ephemeris files to ship). This module wraps it in a small, typed,
 * locale-agnostic surface and follows the package convention of reading the
 * **UTC** fields of any `Date` so results never drift with the host time zone.
 */
import { Solar, Lunar } from 'lunar-typescript';

/** A date on the Chinese lunar calendar. */
export interface LunarDate {
  /** Lunar year (sui). */
  year: number;
  /** Lunar month 1–12 (always positive; see {@link isLeapMonth}). */
  month: number;
  /** Lunar day 1–30. */
  day: number;
  /** True when this is the leap (閏) repetition of `month`. */
  isLeapMonth: boolean;
  /** Sexagenary (干支) year, e.g. "丙午". */
  ganZhiYear: string;
  /** Chinese zodiac animal for the lunar year, e.g. "馬". */
  zodiac: string;
}

function utcParts(date: Date): [number, number, number] {
  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
}

/** Convert a Gregorian `Date` (UTC fields) to its Chinese lunar date. */
export function gregorianToLunar(date: Date): LunarDate {
  const [y, m, d] = utcParts(date);
  const lunar = Solar.fromYmd(y, m, d).getLunar();
  const rawMonth = lunar.getMonth(); // negative ⇒ leap month
  return {
    year: lunar.getYear(),
    month: Math.abs(rawMonth),
    day: lunar.getDay(),
    isLeapMonth: rawMonth < 0,
    ganZhiYear: lunar.getYearInGanZhi(),
    zodiac: lunar.getYearShengXiao(),
  };
}

/**
 * Convert a Chinese lunar date to its Gregorian `Date` (at UTC midnight).
 * Set `isLeapMonth` to target the leap repetition of `month`.
 */
export function lunarToGregorian(
  year: number,
  month: number,
  day: number,
  isLeapMonth = false,
): Date {
  if (month < 1 || month > 12) throw new RangeError(`Lunar month must be 1–12, received ${month}`);
  if (day < 1 || day > 30) throw new RangeError(`Lunar day must be 1–30, received ${day}`);
  const signed = isLeapMonth ? -month : month;
  const solar = Lunar.fromYmd(year, signed, day).getSolar();
  return new Date(Date.UTC(solar.getYear(), solar.getMonth() - 1, solar.getDay()));
}

/** The six 六曜 labels, in formula order (index = (month + day) mod 6). */
export const ROKUYO = [
  { kanji: '大安', romaji: 'taian' },
  { kanji: '赤口', romaji: 'shakkō' },
  { kanji: '先勝', romaji: 'senshō' },
  { kanji: '友引', romaji: 'tomobiki' },
  { kanji: '先負', romaji: 'senbu' },
  { kanji: '仏滅', romaji: 'butsumetsu' },
] as const;

/** A 六曜 reading for a given day. */
export interface Rokuyo {
  index: number;
  kanji: string;
  romaji: string;
}

/**
 * 六曜 (rokuyō) for a Gregorian date. Derived from the lunar date as
 * `(lunarMonth + lunarDay) mod 6` — e.g. lunar 1/1 (旧正月) is always 先勝.
 */
export function rokuyo(date: Date): Rokuyo {
  const lunar = gregorianToLunar(date);
  const index = (lunar.month + lunar.day) % 6;
  const entry = ROKUYO[index] ?? ROKUYO[0];
  return { index, kanji: entry.kanji, romaji: entry.romaji };
}

/**
 * The 24 solar terms in canonical order (小寒 → 冬至), with Traditional-Chinese
 * and Japanese kanji. A Gregorian year always contains exactly these 24, in
 * this order, so we can label dates by position.
 */
const SOLAR_TERM_NAMES: ReadonlyArray<{ zh: string; ja: string }> = [
  { zh: '小寒', ja: '小寒' },
  { zh: '大寒', ja: '大寒' },
  { zh: '立春', ja: '立春' },
  { zh: '雨水', ja: '雨水' },
  { zh: '驚蟄', ja: '啓蟄' },
  { zh: '春分', ja: '春分' },
  { zh: '清明', ja: '清明' },
  { zh: '穀雨', ja: '穀雨' },
  { zh: '立夏', ja: '立夏' },
  { zh: '小滿', ja: '小満' },
  { zh: '芒種', ja: '芒種' },
  { zh: '夏至', ja: '夏至' },
  { zh: '小暑', ja: '小暑' },
  { zh: '大暑', ja: '大暑' },
  { zh: '立秋', ja: '立秋' },
  { zh: '處暑', ja: '処暑' },
  { zh: '白露', ja: '白露' },
  { zh: '秋分', ja: '秋分' },
  { zh: '寒露', ja: '寒露' },
  { zh: '霜降', ja: '霜降' },
  { zh: '立冬', ja: '立冬' },
  { zh: '小雪', ja: '小雪' },
  { zh: '大雪', ja: '大雪' },
  { zh: '冬至', ja: '冬至' },
];

/** One of the 24 solar terms on a specific date. */
export interface SolarTerm {
  /** 1-based position in the year (1 = 小寒 … 24 = 冬至). */
  index: number;
  /** Traditional-Chinese name, e.g. "立春". */
  zh: string;
  /** Japanese name, e.g. "啓蟄". */
  ja: string;
  /** Gregorian date (UTC midnight). */
  date: Date;
}

function sortedTermDatesInYear(year: number): Solar[] {
  const seen = new Map<string, Solar>();
  for (let m = 1; m <= 12; m += 1) {
    const table = Solar.fromYmd(year, m, 15).getLunar().getJieQiTable();
    for (const solar of Object.values(table)) {
      if (solar.getYear() === year) seen.set(solar.toYmd(), solar);
    }
  }
  return [...seen.values()].sort((a, b) => (a.toYmd() < b.toYmd() ? -1 : 1));
}

/**
 * All 24 solar terms that fall in the given Gregorian `year`, in chronological
 * (and canonical) order.
 */
export function solarTermsInYear(year: number): SolarTerm[] {
  const dates = sortedTermDatesInYear(year);
  if (dates.length !== 24) {
    throw new Error(`Expected 24 solar terms in ${year}, computed ${dates.length}`);
  }
  return dates.map((solar, i) => {
    const name = SOLAR_TERM_NAMES[i] ?? { zh: '', ja: '' };
    return {
      index: i + 1,
      zh: name.zh,
      ja: name.ja,
      date: new Date(Date.UTC(solar.getYear(), solar.getMonth() - 1, solar.getDay())),
    };
  });
}

/** The solar term falling exactly on `date`, or `undefined` if none does. */
export function solarTermOn(date: Date): SolarTerm | undefined {
  const [y, m, d] = utcParts(date);
  return solarTermsInYear(y).find(
    (t) => t.date.getUTCMonth() + 1 === m && t.date.getUTCDate() === d,
  );
}
