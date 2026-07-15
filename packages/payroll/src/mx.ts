/**
 * Mexico payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not SAT / IMSS advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const MX_2026 = {
  label: 'Mexico 2026 (estimate)',
  imssEmployeeRate: 0.0275,
  ivaRate: 0.16,
  vacationDays: 12,
  incomeBrackets: [
    { upTo: 89_500, rate: 0.0192 },
    { upTo: 759_000, rate: 0.064 },
    { upTo: 1_335_000, rate: 0.1088 },
    { upTo: 1_551_000, rate: 0.16 },
    { upTo: 1_857_000, rate: 0.1792 },
    { upTo: 3_745_000, rate: 0.2136 },
    { upTo: 5_900_000, rate: 0.2352 },
    { upTo: null, rate: 0.3 },
  ] satisfies TaxBracket[],
} as const;

export const MX_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Año Nuevo' },
  { date: '2026-02-02', name: 'Día de la Constitución' },
  { date: '2026-03-16', name: 'Natalicio de Benito Juárez' },
  { date: '2026-04-03', name: 'Viernes Santo' },
  { date: '2026-05-01', name: 'Día del Trabajo' },
  { date: '2026-09-16', name: 'Día de la Independencia' },
  { date: '2026-11-16', name: 'Revolución Mexicana' },
  { date: '2026-12-25', name: 'Navidad' },
];

export function mxIsrAnnual(taxable: number): number {
  return progressiveTax([...MX_2026.incomeBrackets], taxable);
}

export function mxImssEmployee(annualGross: number): number {
  return Math.max(0, annualGross) * MX_2026.imssEmployeeRate;
}

export function mxTakeHome(annualGross: number): {
  net: number;
  isr: number;
  imss: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const imss = mxImssEmployee(gross);
  const taxable = Math.max(0, gross - imss);
  const isr = mxIsrAnnual(taxable);
  return { gross, imss, isr, net: gross - imss - isr };
}

export function mxVacationDays(yearsOfService: number): number {
  const y = Math.max(0, yearsOfService);
  if (y < 1) return 12;
  if (y < 2) return 14;
  if (y < 3) return 16;
  if (y < 4) return 18;
  if (y < 5) return 20;
  return Math.min(32, 20 + Math.floor((y - 5) / 5) * 2);
}
