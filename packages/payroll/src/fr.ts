/**
 * France salaire brut/net & related helpers (2026 simplified). Not URSSAF official.
 */

import { progressiveTax, type TaxBracket } from './tax';

export const FR_2026 = {
  label: 'France 2026 (estimate)',
  source: 'https://www.urssaf.fr',
  employeeRate: 0.22,
  employerRate: 0.42,
  pmss: 3_925,
  tvaStandard: 0.2,
  tvaInter: 0.1,
  tvaReduced: 0.055,
  congesDaysFullYear: 25,
  brackets: [
    { upTo: 11_600, rate: 0 },
    { upTo: 29_500, rate: 0.11 },
    { upTo: 84_200, rate: 0.3 },
    { upTo: 180_800, rate: 0.41 },
    { upTo: null, rate: 0.45 },
  ] as TaxBracket[],
  /** Simplified taux neutre bands (monthly net imposable approx). */
  tauxNeutre: [
    { upTo: 1_541, rate: 0 },
    { upTo: 1_596, rate: 0.005 },
    { upTo: 1_698, rate: 0.013 },
    { upTo: 1_816, rate: 0.021 },
    { upTo: 1_940, rate: 0.029 },
    { upTo: 2_511, rate: 0.08 },
    { upTo: 3_000, rate: 0.12 },
    { upTo: 4_000, rate: 0.15 },
    { upTo: null, rate: 0.2 },
  ] as TaxBracket[],
} as const;

export interface FrBrutNetResult {
  brut: number;
  cotisations: number;
  netBeforePas: number;
  pas: number;
  netAfterPas: number;
}

export function frBrutNet(brutMonthly: number, pasRate?: number): FrBrutNetResult {
  const brut = Math.max(0, brutMonthly);
  const cotisations = brut * FR_2026.employeeRate;
  const netBeforePas = brut - cotisations;
  const rate =
    pasRate !== undefined && pasRate >= 0
      ? pasRate
      : progressiveTax(FR_2026.tauxNeutre, netBeforePas) / Math.max(1, netBeforePas);
  const pas = netBeforePas * rate;
  return { brut, cotisations, netBeforePas, pas, netAfterPas: netBeforePas - pas };
}

export function frEmployerCost(brutMonthly: number): {
  brut: number;
  employerCharges: number;
  totalCost: number;
} {
  const brut = Math.max(0, brutMonthly);
  const employerCharges = brut * FR_2026.employerRate;
  return { brut, employerCharges, totalCost: brut + employerCharges };
}

export function frPasAmount(netBeforePas: number, ratePercent: number): number {
  return Math.max(0, netBeforePas) * Math.max(0, ratePercent) / 100;
}

export function frCongesAccrual(monthsWorked: number): {
  days: number;
  monthsWorked: number;
} {
  const m = Math.max(0, Math.min(12, monthsWorked));
  return { days: (FR_2026.congesDaysFullYear / 12) * m, monthsWorked: m };
}

export function frIncomeTaxAnnual(taxable: number): number {
  return progressiveTax(FR_2026.brackets, taxable);
}

export const FR_HOLIDAYS_2026: ReadonlyArray<{ date: string; name: string }> = [
  { date: '2026-01-01', name: "Jour de l'an" },
  { date: '2026-04-06', name: 'Lundi de Pâques' },
  { date: '2026-05-01', name: 'Fête du Travail' },
  { date: '2026-05-08', name: 'Victoire 1945' },
  { date: '2026-05-14', name: 'Ascension' },
  { date: '2026-05-25', name: 'Lundi de Pentecôte' },
  { date: '2026-07-14', name: 'Fête nationale' },
  { date: '2026-08-15', name: 'Assomption' },
  { date: '2026-11-01', name: 'Toussaint' },
  { date: '2026-11-11', name: 'Armistice' },
  { date: '2026-12-25', name: 'Noël' },
];

export const FR_HOLIDAYS_ALSACE_EXTRA: ReadonlyArray<{ date: string; name: string }> = [
  { date: '2026-04-03', name: 'Vendredi saint' },
  { date: '2026-12-26', name: 'Saint-Étienne' },
];
