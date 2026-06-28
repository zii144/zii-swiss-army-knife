/** Age reckoning: Western (満年齢) and Japanese counted (数え年) ages. */

/** UTC YYYYMMDD key for month/day comparison without time-zone drift. */
function monthDayKey(date: Date): number {
  return (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
}

/**
 * Western age (満年齢) in completed years as of `on`.
 * Subtracts a year if the birthday hasn't occurred yet in the `on` year.
 */
export function ageWestern(birth: Date, on: Date): number {
  let age = on.getUTCFullYear() - birth.getUTCFullYear();
  if (monthDayKey(on) < monthDayKey(birth)) {
    age -= 1;
  }
  return age;
}

/**
 * Japanese counted age (数え年): you are "1" at birth and gain a year each
 * calendar new year, so age == (on.year - birth.year + 1) regardless of month.
 */
export function ageKazoe(birth: Date, on: Date): number {
  return on.getUTCFullYear() - birth.getUTCFullYear() + 1;
}
