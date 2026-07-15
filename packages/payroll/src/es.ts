/**
 * Spain payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not AEAT advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const ES_2026 = {
  label: 'Spain 2026 (estimate)',
  ssEmployeeRate: 0.0635,
  ivaRate: 0.21,
  vacationDays: 30,
  incomeBrackets: [
    { upTo: 12_450, rate: 0.19 },
    { upTo: 20_200, rate: 0.24 },
    { upTo: 35_200, rate: 0.3 },
    { upTo: 60_000, rate: 0.37 },
    { upTo: 300_000, rate: 0.45 },
    { upTo: null, rate: 0.47 },
  ] satisfies TaxBracket[],
} as const;

export const ES_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Año Nuevo' },
  { date: '2026-01-06', name: 'Epifanía' },
  { date: '2026-04-03', name: 'Viernes Santo' },
  { date: '2026-05-01', name: 'Día del Trabajo' },
  { date: '2026-08-15', name: 'Asunción' },
  { date: '2026-10-12', name: 'Fiesta Nacional' },
  { date: '2026-11-01', name: 'Todos los Santos' },
  { date: '2026-12-06', name: 'Constitución' },
  { date: '2026-12-08', name: 'Inmaculada Concepción' },
  { date: '2026-12-25', name: 'Navidad' },
];

export function esIrpfAnnual(taxable: number): number {
  return progressiveTax([...ES_2026.incomeBrackets], taxable);
}

export function esSsEmployee(annualGross: number): number {
  return Math.max(0, annualGross) * ES_2026.ssEmployeeRate;
}

export function esTakeHome(annualGross: number): {
  net: number;
  irpf: number;
  ss: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const ss = esSsEmployee(gross);
  const taxable = Math.max(0, gross - ss);
  const irpf = esIrpfAnnual(taxable);
  return { gross, ss, irpf, net: gross - ss - irpf };
}

export function esVacationDays(fullTime = true): number {
  return fullTime ? ES_2026.vacationDays : Math.floor(ES_2026.vacationDays / 2);
}
