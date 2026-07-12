/**
 * France payroll / tax estimates — 2026.
 * Pure, offline, deterministic. Planning estimates only — not URSSAF / DGFiP advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const FR_2026 = {
  label: 'France 2026 (estimate)',
  employeeCotisationsRate: 0.22,
  employerChargesRate: 0.42,
  congesDaysPerYear: 25,
  incomeBrackets: [
    { upTo: 11_497, rate: 0 },
    { upTo: 29_315, rate: 0.11 },
    { upTo: 83_823, rate: 0.3 },
    { upTo: 180_294, rate: 0.41 },
    { upTo: null, rate: 0.45 },
  ] satisfies TaxBracket[],
  /** Simplified taux neutre bands on monthly net before PAS. */
  neutreBands: [
    { upTo: 1_518, rate: 0 },
    { upTo: 1_577, rate: 0.005 },
    { upTo: 1_678, rate: 0.013 },
    { upTo: 1_791, rate: 0.021 },
    { upTo: 1_914, rate: 0.029 },
    { upTo: 2_019, rate: 0.035 },
    { upTo: 2_191, rate: 0.041 },
    { upTo: 2_603, rate: 0.053 },
    { upTo: 2_888, rate: 0.075 },
    { upTo: 3_186, rate: 0.099 },
    { upTo: 3_738, rate: 0.119 },
    { upTo: 4_497, rate: 0.139 },
    { upTo: 5_444, rate: 0.158 },
    { upTo: 6_595, rate: 0.179 },
    { upTo: 8_157, rate: 0.2 },
    { upTo: 11_000, rate: 0.24 },
    { upTo: null, rate: 0.43 },
  ] as { upTo: number | null; rate: number }[],
} as const;

export const FR_HOLIDAYS_2026: readonly { date: string; name: string }[] = [
  { date: '2026-01-01', name: 'Jour de l’An' },
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

export const FR_HOLIDAYS_ALSACE_EXTRA: readonly { date: string; name: string }[] = [
  { date: '2026-04-03', name: 'Vendredi saint' },
  { date: '2026-12-26', name: 'Saint-Étienne' },
];

function neutreRate(monthlyNetBeforePas: number): number {
  for (const band of FR_2026.neutreBands) {
    if (band.upTo === null || monthlyNetBeforePas <= band.upTo) return band.rate;
  }
  return 0;
}

export function frIncomeTaxAnnual(taxable: number): number {
  return progressiveTax([...FR_2026.incomeBrackets], taxable);
}

export function frBrutNet(
  monthlyBrut: number,
  pasRate?: number,
): { netBeforePas: number; pas: number; netAfterPas: number; cotisations: number } {
  const brut = Math.max(0, monthlyBrut);
  const cotisations = brut * FR_2026.employeeCotisationsRate;
  const netBeforePas = brut - cotisations;
  const rate = pasRate === undefined ? neutreRate(netBeforePas) : pasRate;
  const pas = netBeforePas * rate;
  return { netBeforePas, pas, netAfterPas: netBeforePas - pas, cotisations };
}

export function frEmployerCost(monthlyBrut: number): { employerCharges: number; totalCost: number } {
  const brut = Math.max(0, monthlyBrut);
  const employerCharges = brut * FR_2026.employerChargesRate;
  return { employerCharges, totalCost: brut + employerCharges };
}

/** Apply PAS. `ratePercent` is a percentage (e.g. 8 for 8%). */
export function frPasAmount(netBeforePas: number, ratePercent: number): number {
  return Math.max(0, netBeforePas) * (Math.max(0, ratePercent) / 100);
}

export function frCongesAccrual(monthsWorked: number): { days: number } {
  const months = Math.max(0, monthsWorked);
  return { days: (FR_2026.congesDaysPerYear / 12) * months };
}
