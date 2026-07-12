/**
 * Germany payroll / tax estimates — 2026 (simplified).
 * Pure, offline, deterministic. Planning estimates only — not BMF advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const DE_2026 = {
  label: 'Germany 2026 (estimate)',
  pensionRate: 0.093,
  unemploymentRate: 0.013,
  healthBaseRate: 0.073,
  careRate: 0.023,
  socialCeilingMonthly: 8_050,
  churchTaxRate: 0.09,
  commuteFirstKmRate: 0.3,
  commuteBeyondRate: 0.38,
  commuteFirstKm: 20,
  statutoryVacationFullTime: 20,
  incomeBrackets: [
    { upTo: 12_096, rate: 0 },
    { upTo: 17_430, rate: 0.14 },
    { upTo: 68_480, rate: 0.24 },
    { upTo: 277_825, rate: 0.42 },
    { upTo: null, rate: 0.45 },
  ] satisfies TaxBracket[],
} as const;

export type DeTaxClass = 1 | 2 | 3 | 4 | 5 | 6;

const TAX_CLASS_FACTOR: Record<DeTaxClass, number> = {
  1: 1,
  2: 0.9,
  3: 0.55,
  4: 1,
  5: 1.35,
  6: 1.5,
};

export const DE_HOLIDAYS_2026_FEDERAL: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Neujahr' },
  { date: '2026-04-03', name: 'Karfreitag' },
  { date: '2026-04-06', name: 'Ostermontag' },
  { date: '2026-05-01', name: 'Tag der Arbeit' },
  { date: '2026-05-14', name: 'Christi Himmelfahrt' },
  { date: '2026-05-25', name: 'Pfingstmontag' },
  { date: '2026-10-03', name: 'Tag der Deutschen Einheit' },
  { date: '2026-12-25', name: '1. Weihnachtstag' },
  { date: '2026-12-26', name: '2. Weihnachtstag' },
];

export function deIncomeTaxAnnual(taxable: number): number {
  return progressiveTax([...DE_2026.incomeBrackets], taxable);
}

export interface DeTakeHomeResult {
  net: number;
  wageTax: number;
  solidarity: number;
  churchTax: number;
  pension: number;
  unemployment: number;
  health: number;
  care: number;
}

export function deTakeHome(
  monthlyGross: number,
  opts?: { taxClass?: DeTaxClass; zusatz?: number; church?: boolean },
): DeTakeHomeResult {
  const gross = Math.max(0, monthlyGross);
  const capped = Math.min(gross, DE_2026.socialCeilingMonthly);
  const pension = capped * DE_2026.pensionRate;
  const unemployment = capped * DE_2026.unemploymentRate;
  const zusatz = opts?.zusatz ?? 0.025;
  const health = capped * (DE_2026.healthBaseRate + zusatz / 2);
  const care = capped * DE_2026.careRate;
  const social = pension + unemployment + health + care;

  const annualTaxable = Math.max(0, (gross - social) * 12);
  const annualWage = deIncomeTaxAnnual(annualTaxable) * TAX_CLASS_FACTOR[opts?.taxClass ?? 1];
  const wageTax = annualWage / 12;
  const solidarity = wageTax * 0.055;
  const churchTax = opts?.church === false ? 0 : wageTax * DE_2026.churchTaxRate;
  const net = gross - social - wageTax - solidarity - churchTax;
  return { net, wageTax, solidarity, churchTax, pension, unemployment, health, care };
}

export function deVacationDays(fullTime: boolean, extraWeeks = 0): number {
  const base = fullTime ? DE_2026.statutoryVacationFullTime : DE_2026.statutoryVacationFullTime / 2;
  return base + Math.max(0, extraWeeks) * (fullTime ? 5 : 2.5);
}

export function deCommuteAllowance(oneWayKm: number, workDays: number): number {
  const km = Math.max(0, oneWayKm);
  const days = Math.max(0, workDays);
  const first = Math.min(km, DE_2026.commuteFirstKm) * DE_2026.commuteFirstKmRate;
  const beyond = Math.max(0, km - DE_2026.commuteFirstKm) * DE_2026.commuteBeyondRate;
  return (first + beyond) * days;
}

/** Rough Abfindung tax using the one-fifth (Fünftel) rule. */
export function deSeveranceTax(
  severance: number,
  otherTaxable: number,
): { estimatedTax: number; net: number } {
  const fifth = Math.max(0, severance) / 5;
  const withFifth = deIncomeTaxAnnual(otherTaxable + fifth);
  const without = deIncomeTaxAnnual(otherTaxable);
  const estimatedTax = Math.max(0, (withFifth - without) * 5);
  return { estimatedTax, net: Math.max(0, severance - estimatedTax) };
}
