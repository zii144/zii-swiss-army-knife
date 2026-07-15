/**
 * Portugal payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not AT / Segurança Social advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const PT_2026 = {
  label: 'Portugal 2026 (estimate)',
  ssEmployeeRate: 0.11,
  ivaRate: 0.23,
  vacationDays: 22,
  incomeBrackets: [
    { upTo: 8_059, rate: 0.1325 },
    { upTo: 12_160, rate: 0.18 },
    { upTo: 17_233, rate: 0.23 },
    { upTo: 22_306, rate: 0.26 },
    { upTo: 28_400, rate: 0.3275 },
    { upTo: 41_629, rate: 0.37 },
    { upTo: 44_987, rate: 0.435 },
    { upTo: 83_696, rate: 0.45 },
    { upTo: null, rate: 0.48 },
  ] satisfies TaxBracket[],
} as const;

export const PT_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Ano Novo' },
  { date: '2026-04-03', name: 'Sexta-feira Santa' },
  { date: '2026-04-05', name: 'Páscoa' },
  { date: '2026-04-25', name: 'Dia da Liberdade' },
  { date: '2026-05-01', name: 'Dia do Trabalhador' },
  { date: '2026-06-10', name: 'Dia de Portugal' },
  { date: '2026-08-15', name: 'Assunção' },
  { date: '2026-10-05', name: 'Implantação da República' },
  { date: '2026-11-01', name: 'Todos os Santos' },
  { date: '2026-12-01', name: 'Restauração da Independência' },
  { date: '2026-12-08', name: 'Imaculada Conceição' },
  { date: '2026-12-25', name: 'Natal' },
];

export function ptIrsAnnual(taxable: number): number {
  return progressiveTax([...PT_2026.incomeBrackets], taxable);
}

export function ptSsEmployee(annualGross: number): number {
  return Math.max(0, annualGross) * PT_2026.ssEmployeeRate;
}

export function ptTakeHome(annualGross: number): {
  net: number;
  irs: number;
  ss: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const ss = ptSsEmployee(gross);
  const taxable = Math.max(0, gross - ss);
  const irs = ptIrsAnnual(taxable);
  return { gross, ss, irs, net: gross - ss - irs };
}

export function ptVacationDays(fullTime = true): number {
  return fullTime ? PT_2026.vacationDays : Math.floor(PT_2026.vacationDays / 2);
}
