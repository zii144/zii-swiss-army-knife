/**
 * Germany Brutto-Netto & related helpers (2026 simplified). Not BMF Lohnsteuer.
 */

import { progressiveTax, type TaxBracket } from './tax';

export const DE_2026 = {
  label: 'Germany 2026 (estimate)',
  source: 'https://www.bundesfinanzministerium.de',
  pension: 0.093,
  unemployment: 0.013,
  healthBase: 0.073,
  healthZusatzDefault: 0.0145,
  care: 0.018,
  careChildlessExtra: 0.006,
  solidary: 0.055,
  churchTaxByLand: { BY: 0.08, BW: 0.08, default: 0.09 } as Record<string, number>,
  brackets: [
    { upTo: 12_348, rate: 0 },
    { upTo: 68_429, rate: 0.22 },
    { upTo: 277_825, rate: 0.42 },
    { upTo: null, rate: 0.45 },
  ] as TaxBracket[],
  vatStandard: 0.19,
  vatReduced: 0.07,
  vacationMinDays: 20,
  commutePerKm: 0.3,
  commuteFromKm21: 0.38,
} as const;

export type DeTaxClass = 1 | 2 | 3 | 4 | 5 | 6;

export interface DeTakeHomeResult {
  grossMonthly: number;
  pension: number;
  unemployment: number;
  health: number;
  care: number;
  wageTax: number;
  solidarity: number;
  churchTax: number;
  net: number;
}

export function deTakeHome(
  grossMonthly: number,
  opts?: {
    taxClass?: DeTaxClass;
    zusatz?: number;
    church?: boolean;
    land?: string;
    children?: boolean;
  },
): DeTakeHomeResult {
  const g = Math.max(0, grossMonthly);
  const zusatz = opts?.zusatz ?? DE_2026.healthZusatzDefault;
  const pension = g * DE_2026.pension;
  const unemployment = g * DE_2026.unemployment;
  const health = g * (DE_2026.healthBase + zusatz);
  const care =
    g * (DE_2026.care + (opts?.children ? 0 : DE_2026.careChildlessExtra));
  // Very rough Lohnsteuer: annualize, apply progressive, divide; tax class 1 baseline.
  const classFactor =
    opts?.taxClass === 3 ? 0.7 : opts?.taxClass === 5 || opts?.taxClass === 6 ? 1.2 : 1;
  const annualTaxable = g * 12 - (pension + unemployment + health + care) * 12;
  const wageTax = (progressiveTax(DE_2026.brackets, Math.max(0, annualTaxable)) / 12) * classFactor;
  const solidarity = wageTax * DE_2026.solidary;
  const churchRate =
    opts?.church === false
      ? 0
      : (DE_2026.churchTaxByLand[opts?.land ?? 'default'] ?? DE_2026.churchTaxByLand.default);
  const churchTax = wageTax * (churchRate ?? 0);
  const net = g - pension - unemployment - health - care - wageTax - solidarity - churchTax;
  return {
    grossMonthly: g,
    pension,
    unemployment,
    health,
    care,
    wageTax,
    solidarity,
    churchTax,
    net,
  };
}

export function deIncomeTaxAnnual(taxableAnnual: number): number {
  return progressiveTax(DE_2026.brackets, taxableAnnual);
}

export function deVacationDays(fullTime = true, extraWeeks = 0): number {
  const base = DE_2026.vacationMinDays;
  return fullTime ? base + extraWeeks * 5 : Math.round(base * 0.5);
}

/** Pendlerpauschale: first 20 km @ €0.30, beyond @ €0.38 per work day. */
export function deCommuteAllowance(oneWayKm: number, workDays: number): number {
  const km = Math.max(0, oneWayKm);
  const days = Math.max(0, workDays);
  const first = Math.min(km, 20) * DE_2026.commutePerKm;
  const rest = Math.max(0, km - 20) * DE_2026.commuteFromKm21;
  return (first + rest) * days;
}

/** Simplified Abfindung tax: one-fifth rule rough estimate. */
export function deSeveranceTax(severance: number, otherTaxable: number): {
  severance: number;
  estimatedTax: number;
  net: number;
} {
  const s = Math.max(0, severance);
  const fifth = s / 5;
  const taxWith = progressiveTax(DE_2026.brackets, otherTaxable + fifth);
  const taxWithout = progressiveTax(DE_2026.brackets, otherTaxable);
  const estimatedTax = (taxWith - taxWithout) * 5;
  return { severance: s, estimatedTax, net: s - estimatedTax };
}

export const DE_HOLIDAYS_2026_FEDERAL: ReadonlyArray<{ date: string; name: string }> = [
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
