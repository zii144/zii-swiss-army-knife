import {
  BR_HOLIDAYS_2026,
  DE_HOLIDAYS_2026_FEDERAL,
  ES_HOLIDAYS_2026,
  FR_HOLIDAYS_2026,
  FR_HOLIDAYS_ALSACE_EXTRA,
  IN_HOLIDAYS_2026,
  IT_HOLIDAYS_2026,
  MX_HOLIDAYS_2026,
  NL_HOLIDAYS_2026,
  NZ_HOLIDAYS_2026,
  PL_HOLIDAYS_2026,
  PT_HOLIDAYS_2026,
  SG_HOLIDAYS_2026,
} from '@zii/payroll';

/**
 * Union of 2026 public-holiday ISO dates from markets that ship tables in
 * `@zii/payroll`. Weekends are skipped separately. TW/HK/JP/US/CA/AU/GB/KO
 * are not in this list — we do not invent those calendars.
 */
export const HOLIDAYS_ISO_2026: readonly string[] = [
  ...new Set(
    [
      ...DE_HOLIDAYS_2026_FEDERAL,
      ...FR_HOLIDAYS_2026,
      ...FR_HOLIDAYS_ALSACE_EXTRA,
      ...ES_HOLIDAYS_2026,
      ...IT_HOLIDAYS_2026,
      ...NL_HOLIDAYS_2026,
      ...SG_HOLIDAYS_2026,
      ...IN_HOLIDAYS_2026,
      ...PT_HOLIDAYS_2026,
      ...BR_HOLIDAYS_2026,
      ...MX_HOLIDAYS_2026,
      ...PL_HOLIDAYS_2026,
      ...NZ_HOLIDAYS_2026,
    ].map((h) => h.date),
  ),
];
