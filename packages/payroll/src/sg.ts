/**
 * Singapore payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not IRAS / CPF advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const SG_2026 = {
  label: 'Singapore 2026 (estimate)',
  gstRate: 0.09,
  /** Citizen/PR employee CPF ordinary wage ceiling (monthly) — simplified annual. */
  cpfEmployeeRate: 0.2,
  cpfEmployerRate: 0.17,
  cpfWageCeilingAnnual: 102_000,
  leaveDays: 14,
  incomeBrackets: [
    { upTo: 20_000, rate: 0 },
    { upTo: 30_000, rate: 0.02 },
    { upTo: 40_000, rate: 0.035 },
    { upTo: 80_000, rate: 0.07 },
    { upTo: 120_000, rate: 0.115 },
    { upTo: 160_000, rate: 0.15 },
    { upTo: 200_000, rate: 0.18 },
    { upTo: 240_000, rate: 0.19 },
    { upTo: 280_000, rate: 0.195 },
    { upTo: 320_000, rate: 0.2 },
    { upTo: 500_000, rate: 0.22 },
    { upTo: 1_000_000, rate: 0.23 },
    { upTo: null, rate: 0.24 },
  ] satisfies TaxBracket[],
} as const;

export const SG_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'New Year’s Day' },
  { date: '2026-02-17', name: 'Chinese New Year' },
  { date: '2026-02-18', name: 'Chinese New Year (2nd)' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-05-27', name: 'Vesak Day' },
  { date: '2026-06-01', name: 'Hari Raya Puasa' },
  { date: '2026-08-09', name: 'National Day' },
  { date: '2026-08-19', name: 'Hari Raya Haji' },
  { date: '2026-11-08', name: 'Deepavali' },
  { date: '2026-12-25', name: 'Christmas Day' },
];

export function sgIncomeTax(taxable: number): number {
  return progressiveTax([...SG_2026.incomeBrackets], taxable);
}

export function sgCpf(annualGross: number): { employee: number; employer: number; total: number } {
  const wage = Math.min(Math.max(0, annualGross), SG_2026.cpfWageCeilingAnnual);
  const employee = wage * SG_2026.cpfEmployeeRate;
  const employer = wage * SG_2026.cpfEmployerRate;
  return { employee, employer, total: employee + employer };
}

export function sgTakeHome(annualGross: number): {
  net: number;
  incomeTax: number;
  cpfEmployee: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const cpf = sgCpf(gross);
  const taxable = Math.max(0, gross - cpf.employee);
  const incomeTax = sgIncomeTax(taxable);
  return { gross, cpfEmployee: cpf.employee, incomeTax, net: gross - cpf.employee - incomeTax };
}

export function sgLeaveDays(yearsOfService: number): number {
  const y = Math.max(0, yearsOfService);
  if (y < 1) return 7;
  return Math.min(14, 7 + Math.floor(y));
}
