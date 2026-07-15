/**
 * New Zealand payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not IRD advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const NZ_2026 = {
  label: 'New Zealand 2026 (estimate)',
  kiwiSaverEmployeeRate: 0.03,
  gstRate: 0.15,
  leaveDays: 20,
  incomeBrackets: [
    { upTo: 15_600, rate: 0.105 },
    { upTo: 53_500, rate: 0.175 },
    { upTo: 78_100, rate: 0.3 },
    { upTo: 180_000, rate: 0.33 },
    { upTo: null, rate: 0.39 },
  ] satisfies TaxBracket[],
} as const;

export const NZ_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-02', name: "Day after New Year's Day" },
  { date: '2026-02-06', name: 'Waitangi Day' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-04-25', name: 'ANZAC Day' },
  { date: '2026-06-01', name: "King's Birthday" },
  { date: '2026-06-26', name: 'Matariki' },
  { date: '2026-10-26', name: 'Labour Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' },
];

export function nzIncomeTax(taxable: number): number {
  return progressiveTax([...NZ_2026.incomeBrackets], taxable);
}

export function nzKiwiSaver(annualGross: number, rate = NZ_2026.kiwiSaverEmployeeRate): number {
  return Math.max(0, annualGross) * rate;
}

export function nzTakeHome(annualGross: number): {
  net: number;
  incomeTax: number;
  kiwiSaver: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const kiwiSaver = nzKiwiSaver(gross);
  const incomeTax = nzIncomeTax(gross);
  return { gross, kiwiSaver, incomeTax, net: gross - kiwiSaver - incomeTax };
}

export function nzLeaveDays(fullTime = true): number {
  return fullTime ? NZ_2026.leaveDays : Math.floor(NZ_2026.leaveDays / 2);
}
