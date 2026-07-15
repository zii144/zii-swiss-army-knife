/**
 * Italy payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not Agenzia delle Entrate advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const IT_2026 = {
  label: 'Italy 2026 (estimate)',
  inpsEmployeeRate: 0.0919,
  ivaRate: 0.22,
  incomeBrackets: [
    { upTo: 28_000, rate: 0.23 },
    { upTo: 50_000, rate: 0.35 },
    { upTo: null, rate: 0.43 },
  ] satisfies TaxBracket[],
} as const;

export const IT_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Capodanno' },
  { date: '2026-01-06', name: 'Epifania' },
  { date: '2026-04-06', name: 'Lunedì dell’Angelo' },
  { date: '2026-04-25', name: 'Liberazione' },
  { date: '2026-05-01', name: 'Festa del Lavoro' },
  { date: '2026-06-02', name: 'Festa della Repubblica' },
  { date: '2026-08-15', name: 'Ferragosto' },
  { date: '2026-11-01', name: 'Ognissanti' },
  { date: '2026-12-08', name: 'Immacolata Concezione' },
  { date: '2026-12-25', name: 'Natale' },
  { date: '2026-12-26', name: 'Santo Stefano' },
];

export function itIrpefAnnual(taxable: number): number {
  return progressiveTax([...IT_2026.incomeBrackets], taxable);
}

export function itInpsEmployee(annualGross: number): number {
  return Math.max(0, annualGross) * IT_2026.inpsEmployeeRate;
}

export function itTakeHome(annualGross: number): {
  net: number;
  irpef: number;
  inps: number;
  gross: number;
} {
  const gross = Math.max(0, annualGross);
  const inps = itInpsEmployee(gross);
  const taxable = Math.max(0, gross - inps);
  const irpef = itIrpefAnnual(taxable);
  return { gross, inps, irpef, net: gross - inps - irpef };
}

/** Rough TFR accrual: ~1/13.5 of annual pay per year of service. */
export function itTfr(annualGross: number, years: number): number {
  return (Math.max(0, annualGross) / 13.5) * Math.max(0, years);
}
