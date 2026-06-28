# @zii/calendar

Calendar & Era engine (M6). Pure-TypeScript, offline, deterministic helpers for
multi-market date reasoning.

## Exports

### Era

- `gregorianToRoc(year)` / `rocToGregorian(rocYear)` — Republic of China (民國)
  year conversions (`ROC year = Gregorian year - 1911`).
- `toJapaneseEra(date)` — resolve a `Date` to its Japanese imperial era
  (`reiwa | heisei | showa | taisho | meiji`), 1-based era year, and a localized
  label. Boundaries honored: 令和 from 2019-05-01, 平成 1989-01-08..2019-04-30,
  昭和 1926-12-25..1989-01-07, 大正 1912-07-30..1926-12-24, 明治 ..1912-07-29.
- `japaneseEraToGregorian(era, year)` — inverse, mapping an era year to the
  Gregorian year in which it begins.

### Zodiac

- `chineseZodiac(year)` — Chinese zodiac sign for a Gregorian year (baseline:
  2020 = rat). Uses the Gregorian year boundary, not the lunar new year.

### Age

- `ageWestern(birth, on)` — completed-years age (満年齢).
- `ageKazoe(birth, on)` — Japanese counted age (数え年):
  `on.year - birth.year + 1`.

### Holidays & business days

- `resolveHolidays(pack, year)` — filter a `@zii/locale` pack's
  `holidays.list` to a given year.
- `substituteIfWeekend(isoDate, opts?)` — substitute-holiday (振替休日) rule:
  Sunday shifts to the next Monday; optionally Saturday too.
- `isBusinessDay(date, holidaysIso)` — false on weekends and listed holidays.
- `businessDaysBetween(a, b, holidaysIso)` — count business days in the
  half-open interval `[a, b)`.

All `Date`-taking functions read **UTC** fields, so construct inputs as
`new Date('YYYY-MM-DD')` for stable, time-zone-independent results.

## Out of scope (documented follow-up)

Lunar calendar conversion, 六曜 (rokuyō), and 二十四節気 (the 24 solar terms)
require ephemeris / astronomical lookup tables and are intentionally **not**
implemented here. They are planned as a follow-up once the supporting data
tables are vendored, since they cannot be computed deterministically from the
Gregorian calendar alone.
