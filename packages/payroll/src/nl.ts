/**
 * Netherlands payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not Belastingdienst advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const NL_2026 = {
  label: 'Netherlands 2026 (estimate)',
  holidayAllowanceRate: 0.08,
  btwRate: 0.21,
  vacationDays: 20,
  /** Box 1 loonbelasting brackets (simplified, no heffingskorting). */
  incomeBrackets: [
    { upTo: 38_441, rate: 0.3582 },
    { upTo: 76_817, rate: 0.3748 },
    { upTo: null, rate: 0.495 },
  ] satisfies TaxBracket[],
} as const;

export const NL_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Nieuwjaarsdag' },
  { date: '2026-04-03', name: 'Goede Vrijdag' },
  { date: '2026-04-06', name: 'Tweede Paasdag' },
  { date: '2026-04-27', name: 'Koningsdag' },
  { date: '2026-05-05', name: 'Bevrijdingsdag' },
  { date: '2026-05-14', name: 'Hemelvaartsdag' },
  { date: '2026-05-25', name: 'Tweede Pinksterdag' },
  { date: '2026-12-25', name: 'Eerste Kerstdag' },
  { date: '2026-12-26', name: 'Tweede Kerstdag' },
];

export function nlLoonheffing(annualGross: number): number {
  return progressiveTax([...NL_2026.incomeBrackets], Math.max(0, annualGross));
}

export function nlHolidayAllowance(annualGross: number): number {
  return Math.max(0, annualGross) * NL_2026.holidayAllowanceRate;
}

export function nlTakeHome(annualGross: number): {
  net: number;
  loonheffing: number;
  holidayAllowance: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const loonheffing = nlLoonheffing(gross);
  const holidayAllowance = nlHolidayAllowance(gross);
  // Holiday allowance is usually paid on top; net ≈ gross - tax + allowance.
  return { gross, loonheffing, holidayAllowance, net: gross - loonheffing + holidayAllowance };
}

export function nlVacationDays(fullTime = true): number {
  return fullTime ? NL_2026.vacationDays : Math.floor(NL_2026.vacationDays / 2);
}
