/**
 * India payroll / tax estimates — FY 2025–26 new regime (simplified).
 * Pure, offline, deterministic. Planning estimates only — not income-tax advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const IN_2026 = {
  label: 'India FY 2025–26 (new regime, estimate)',
  gstRate: 0.18,
  epfEmployeeRate: 0.12,
  epfWageCeilingMonthly: 15_000,
  /** New tax regime slabs (simplified). */
  incomeBrackets: [
    { upTo: 300_000, rate: 0 },
    { upTo: 700_000, rate: 0.05 },
    { upTo: 1_000_000, rate: 0.1 },
    { upTo: 1_200_000, rate: 0.15 },
    { upTo: 1_500_000, rate: 0.2 },
    { upTo: null, rate: 0.3 },
  ] satisfies TaxBracket[],
} as const;

export const IN_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-26', name: 'Republic Day' },
  { date: '2026-03-14', name: 'Holi' },
  { date: '2026-03-21', name: 'Id-ul-Fitr' },
  { date: '2026-03-29', name: 'Mahavir Jayanti' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti' },
  { date: '2026-08-15', name: 'Independence Day' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-10-20', name: 'Dussehra' },
  { date: '2026-11-08', name: 'Diwali' },
  { date: '2026-12-25', name: 'Christmas' },
];

export function inIncomeTax(taxable: number): number {
  return progressiveTax([...IN_2026.incomeBrackets], Math.max(0, taxable));
}

export function inEpfEmployee(annualGross: number): number {
  const monthly = Math.max(0, annualGross) / 12;
  const base = Math.min(monthly, IN_2026.epfWageCeilingMonthly);
  return base * IN_2026.epfEmployeeRate * 12;
}

export function inTakeHome(annualGross: number): {
  net: number;
  incomeTax: number;
  epf: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const epf = inEpfEmployee(gross);
  const taxable = Math.max(0, gross - epf);
  const incomeTax = inIncomeTax(taxable);
  return { gross, epf, incomeTax, net: gross - epf - incomeTax };
}
