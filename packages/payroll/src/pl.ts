/**
 * Poland payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not ZUS / KAS advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const PL_2026 = {
  label: 'Poland 2026 (estimate)',
  zusEmployeeRate: 0.1371,
  vatRate: 0.23,
  vacationDays: 20,
  incomeBrackets: [
    { upTo: 120_000, rate: 0.12 },
    { upTo: null, rate: 0.32 },
  ] satisfies TaxBracket[],
} as const;

export const PL_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Nowy Rok' },
  { date: '2026-01-06', name: 'Trzech Króli' },
  { date: '2026-04-05', name: 'Wielkanoc' },
  { date: '2026-04-06', name: 'Poniedziałek Wielkanocny' },
  { date: '2026-05-01', name: 'Święto Pracy' },
  { date: '2026-05-03', name: 'Święto Konstytucji 3 Maja' },
  { date: '2026-05-24', name: 'Zielone Świątki' },
  { date: '2026-06-04', name: 'Boże Ciało' },
  { date: '2026-08-15', name: 'Wniebowzięcie NMP' },
  { date: '2026-11-01', name: 'Wszystkich Świętych' },
  { date: '2026-11-11', name: 'Święto Niepodległości' },
  { date: '2026-12-25', name: 'Boże Narodzenie' },
  { date: '2026-12-26', name: 'Drugi dzień Bożego Narodzenia' },
];

export function plPitAnnual(taxable: number): number {
  return progressiveTax([...PL_2026.incomeBrackets], taxable);
}

export function plZusEmployee(annualGross: number): number {
  return Math.max(0, annualGross) * PL_2026.zusEmployeeRate;
}

export function plTakeHome(annualGross: number): {
  net: number;
  pit: number;
  zus: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const zus = plZusEmployee(gross);
  const taxable = Math.max(0, gross - zus);
  const pit = plPitAnnual(taxable);
  return { gross, zus, pit, net: gross - zus - pit };
}

export function plVacationDays(yearsOfService: number): number {
  return yearsOfService >= 10 ? 26 : PL_2026.vacationDays;
}
