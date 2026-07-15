/**
 * Brazil payroll / tax estimates — 2026 (simplified CLT).
 * Pure, offline, deterministic. Planning estimates only — not Receita / INSS advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const BR_2026 = {
  label: 'Brazil 2026 (estimate)',
  inssEmployeeRate: 0.11,
  inssCeiling: 95_000,
  fgtsRate: 0.08,
  vacationDays: 30,
  incomeBrackets: [
    { upTo: 24_240, rate: 0 },
    { upTo: 33_919, rate: 0.075 },
    { upTo: 45_012, rate: 0.15 },
    { upTo: 55_976, rate: 0.225 },
    { upTo: null, rate: 0.275 },
  ] satisfies TaxBracket[],
} as const;

export const BR_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Confraternização Universal' },
  { date: '2026-02-16', name: 'Carnaval' },
  { date: '2026-02-17', name: 'Carnaval' },
  { date: '2026-04-03', name: 'Sexta-feira Santa' },
  { date: '2026-04-21', name: 'Tiradentes' },
  { date: '2026-05-01', name: 'Dia do Trabalho' },
  { date: '2026-06-04', name: 'Corpus Christi' },
  { date: '2026-09-07', name: 'Independência' },
  { date: '2026-10-12', name: 'Nossa Senhora Aparecida' },
  { date: '2026-11-02', name: 'Finados' },
  { date: '2026-11-15', name: 'Proclamação da República' },
  { date: '2026-12-25', name: 'Natal' },
];

export function brIrpfAnnual(taxable: number): number {
  return progressiveTax([...BR_2026.incomeBrackets], taxable);
}

export function brInssEmployee(annualGross: number): number {
  const base = Math.min(Math.max(0, annualGross), BR_2026.inssCeiling);
  return base * BR_2026.inssEmployeeRate;
}

export function brFgts(annualGross: number): number {
  return Math.max(0, annualGross) * BR_2026.fgtsRate;
}

export function brTakeHome(annualGross: number): {
  net: number;
  irpf: number;
  inss: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const inss = brInssEmployee(gross);
  const taxable = Math.max(0, gross - inss);
  const irpf = brIrpfAnnual(taxable);
  return { gross, inss, irpf, net: gross - inss - irpf };
}

export function brVacationDays(fullTime = true): number {
  return fullTime ? BR_2026.vacationDays : Math.floor(BR_2026.vacationDays / 2);
}
