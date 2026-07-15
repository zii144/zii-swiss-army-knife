/**
 * Canada payroll / tax estimates — TY 2026 (indexed approximations).
 * Pure, offline, deterministic. Planning estimates only — not CRA advice.
 */
import { progressiveTax, type TaxBracket } from './tax';

export const CA_2026 = {
  label: 'Canada TY 2026 (estimate)',
  basicPersonalAmount: 16_129,
  cpp: {
    rate: 0.0595,
    ympe: 74_600,
    exemption: 3_500,
    cpp2Rate: 0.04,
    yampe: 85_000,
  },
  ei: {
    rate: 1.64 / 100,
    maxInsurable: 68_900,
    qcRate: 1.31 / 100,
  },
  tfsaAnnualLimit: 7_000,
  rrspLimit: 33_810,
  federalBrackets: [
    { upTo: 57_375, rate: 0.14 },
    { upTo: 114_750, rate: 0.205 },
    { upTo: 177_882, rate: 0.26 },
    { upTo: 253_414, rate: 0.29 },
    { upTo: null, rate: 0.33 },
  ] satisfies TaxBracket[],
  /** Default provincial pack: Ontario 2026 estimate. */
  ontarioBrackets: [
    { upTo: 52_886, rate: 0.0505 },
    { upTo: 105_775, rate: 0.0915 },
    { upTo: 150_000, rate: 0.1116 },
    { upTo: 220_000, rate: 0.1216 },
    { upTo: null, rate: 0.1316 },
  ] satisfies TaxBracket[],
  gstHst: {
    AB: 0.05,
    BC: 0.12,
    MB: 0.12,
    NB: 0.15,
    NL: 0.15,
    NS: 0.15,
    NT: 0.05,
    NU: 0.05,
    ON: 0.13,
    PE: 0.15,
    QC: 0.14975,
    SK: 0.11,
    YT: 0.05,
  } as Record<string, number>,
  /**
   * Approximate first-bracket provincial rates for estimates.
   * Ontario uses full brackets below; other provinces use these flat rates
   * so the province selector meaningfully changes results.
   */
  provincialFlat: {
    AB: 0.08,
    BC: 0.0506,
    MB: 0.108,
    NB: 0.094,
    NL: 0.087,
    NS: 0.0879,
    NT: 0.059,
    NU: 0.04,
    ON: 0.0505,
    PE: 0.095,
    QC: 0.14,
    SK: 0.105,
    YT: 0.064,
  } as Record<string, number>,
} as const;

export type CaProvince = keyof typeof CA_2026.gstHst;

export function caCppEmployee(pensionable: number): { cpp: number; cpp2: number; total: number } {
  const { rate, ympe, exemption, cpp2Rate, yampe } = CA_2026.cpp;
  const base = Math.max(0, Math.min(pensionable, ympe) - exemption);
  const cpp = base * rate;
  const cpp2Base = Math.max(0, Math.min(pensionable, yampe) - ympe);
  const cpp2 = cpp2Base * cpp2Rate;
  return { cpp, cpp2, total: cpp + cpp2 };
}

export function caEiEmployee(insurable: number, opts?: { quebec?: boolean }): number {
  const rate = opts?.quebec ? CA_2026.ei.qcRate : CA_2026.ei.rate;
  return Math.min(insurable, CA_2026.ei.maxInsurable) * rate;
}

export function caFederalTax(taxable: number): number {
  const gross = progressiveTax([...CA_2026.federalBrackets], taxable);
  // Rough non-refundable credit at lowest rate on BPA (simplified).
  const credit = CA_2026.basicPersonalAmount * CA_2026.federalBrackets[0]!.rate;
  return Math.max(0, gross - credit);
}

export function caProvincialTax(taxable: number, province: CaProvince = 'ON'): number {
  if (province === 'ON') {
    const gross = progressiveTax([...CA_2026.ontarioBrackets], taxable);
    const credit = CA_2026.basicPersonalAmount * CA_2026.ontarioBrackets[0]!.rate;
    return Math.max(0, gross - credit);
  }
  const rate = CA_2026.provincialFlat[province] ?? 0.1;
  const credit = CA_2026.basicPersonalAmount * rate;
  return Math.max(0, taxable * rate - credit);
}

export interface CaTakeHomeResult {
  net: number;
  federalTax: number;
  provincialTax: number;
  cpp: number;
  cpp2: number;
  ei: number;
  gross: number;
}

export function caTakeHome(
  gross: number,
  opts?: { province?: CaProvince; quebec?: boolean },
): CaTakeHomeResult {
  const province = opts?.province ?? 'ON';
  const cpp = caCppEmployee(gross);
  const ei = caEiEmployee(gross, { quebec: opts?.quebec ?? province === 'QC' });
  const taxable = Math.max(0, gross - cpp.total - ei);
  const federalTax = caFederalTax(taxable);
  const provincialTax = caProvincialTax(taxable, province);
  const net = gross - federalTax - provincialTax - cpp.total - ei;
  return {
    net,
    federalTax,
    provincialTax,
    cpp: cpp.cpp,
    cpp2: cpp.cpp2,
    ei,
    gross,
  };
}

export function caGstHst(
  amount: number,
  province: CaProvince,
  opts?: { inclusive?: boolean },
): { net: number; tax: number; gross: number; rate: number } {
  const rate = CA_2026.gstHst[province] ?? 0.05;
  if (opts?.inclusive) {
    const net = amount / (1 + rate);
    return { net, tax: amount - net, gross: amount, rate };
  }
  const tax = amount * rate;
  return { net: amount, tax, gross: amount + tax, rate };
}

export function caRrspTaxImpact(
  contribution: number,
  taxableIncome: number,
  province: CaProvince = 'ON',
): { taxSaved: number; marginalRate: number } {
  const capped = Math.min(contribution, CA_2026.rrspLimit);
  const before = caFederalTax(taxableIncome) + caProvincialTax(taxableIncome, province);
  const after =
    caFederalTax(Math.max(0, taxableIncome - capped)) +
    caProvincialTax(Math.max(0, taxableIncome - capped), province);
  const taxSaved = Math.max(0, before - after);
  const marginalRate = capped > 0 ? taxSaved / capped : 0;
  return { taxSaved, marginalRate };
}

export function caTfsaRoom(opts: {
  unusedRoom: number;
  contributionsThisYear?: number;
  withdrawalsLastYear?: number;
}): { room: number; annualLimit: number } {
  const contributions = opts.contributionsThisYear ?? 0;
  const withdrawals = opts.withdrawalsLastYear ?? 0;
  const room = Math.max(
    0,
    opts.unusedRoom + CA_2026.tfsaAnnualLimit + withdrawals - contributions,
  );
  return { room, annualLimit: CA_2026.tfsaAnnualLimit };
}
