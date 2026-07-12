/**
 * Canada payroll & tax helpers (2026 rates). Estimates only — not CRA PDOC.
 */

import { progressiveTax, type TaxBracket } from './tax';

export const CA_2026 = {
  label: 'Canada 2026 (estimate)',
  source: 'https://www.canada.ca/en/revenue-agency.html',
  ympe: 74_600,
  yampe: 85_000,
  cppRate: 0.0595,
  cpp2Rate: 0.04,
  cppBasicExemption: 3_500,
  eiRate: 0.0163,
  eiMaxInsurable: 68_900,
  eiRateQc: 0.013,
  bpa: 16_452,
  federalBrackets: [
    { upTo: 58_523, rate: 0.14 },
    { upTo: 117_045, rate: 0.205 },
    { upTo: 181_440, rate: 0.26 },
    { upTo: 258_482, rate: 0.29 },
    { upTo: null, rate: 0.33 },
  ] as TaxBracket[],
  /** Simplified single-rate provincial approximations for common provinces. */
  provincialFlat: {
    ON: 0.0505,
    BC: 0.0506,
    AB: 0.08,
    QC: 0.14,
    MB: 0.108,
    SK: 0.105,
    NS: 0.0879,
    NB: 0.094,
    NL: 0.087,
    PE: 0.095,
    YT: 0.064,
    NT: 0.059,
    NU: 0.04,
  } as Record<string, number>,
  gstHst: {
    ON: 0.13,
    BC: 0.12,
    AB: 0.05,
    QC: 0.14975,
    MB: 0.12,
    SK: 0.11,
    NS: 0.14,
    NB: 0.15,
    NL: 0.15,
    PE: 0.15,
    YT: 0.05,
    NT: 0.05,
    NU: 0.05,
  } as Record<string, number>,
  rrspLimit2026: 33_810,
  tfsaAnnual2026: 7_000,
} as const;

export type CaProvince = keyof typeof CA_2026.provincialFlat;

export function caCppEmployee(annualGross: number): { cpp: number; cpp2: number; total: number } {
  const pensionable = Math.max(0, Math.min(annualGross, CA_2026.ympe) - CA_2026.cppBasicExemption);
  const cpp = pensionable * CA_2026.cppRate;
  const cpp2Base = Math.max(0, Math.min(annualGross, CA_2026.yampe) - CA_2026.ympe);
  const cpp2 = cpp2Base * CA_2026.cpp2Rate;
  return { cpp, cpp2, total: cpp + cpp2 };
}

export function caEiEmployee(annualGross: number, quebec = false): number {
  const rate = quebec ? CA_2026.eiRateQc : CA_2026.eiRate;
  return Math.min(annualGross, CA_2026.eiMaxInsurable) * rate;
}

export function caFederalTax(taxable: number): number {
  const tax = progressiveTax(CA_2026.federalBrackets, taxable);
  const credit = CA_2026.bpa * 0.14;
  return Math.max(0, tax - credit);
}

export function caProvincialTax(taxable: number, province: CaProvince): number {
  const rate = CA_2026.provincialFlat[province] ?? 0.1;
  return Math.max(0, taxable * rate);
}

export interface CaTakeHomeResult {
  gross: number;
  federalTax: number;
  provincialTax: number;
  cpp: number;
  cpp2: number;
  ei: number;
  net: number;
}

export function caTakeHome(
  annualGross: number,
  province: CaProvince = 'ON',
  opts?: { rrsp?: number },
): CaTakeHomeResult {
  const rrsp = Math.max(0, opts?.rrsp ?? 0);
  const taxable = Math.max(0, annualGross - rrsp);
  const { cpp, cpp2 } = caCppEmployee(annualGross);
  const ei = caEiEmployee(annualGross, province === 'QC');
  const federalTax = caFederalTax(taxable);
  const provincialTax = caProvincialTax(taxable, province);
  const net = annualGross - federalTax - provincialTax - cpp - cpp2 - ei;
  return { gross: annualGross, federalTax, provincialTax, cpp, cpp2, ei, net };
}

export function caGstHst(amount: number, province: CaProvince, inclusive = false) {
  const rate = CA_2026.gstHst[province] ?? 0.05;
  if (inclusive) {
    const net = amount / (1 + rate);
    return { net, tax: amount - net, gross: amount, rate };
  }
  return { net: amount, tax: amount * rate, gross: amount * (1 + rate), rate };
}

export function caRrspTaxImpact(contribution: number, marginalRate: number): {
  contribution: number;
  taxSaved: number;
  netCost: number;
} {
  const c = Math.max(0, contribution);
  const saved = c * Math.min(1, Math.max(0, marginalRate));
  return { contribution: c, taxSaved: saved, netCost: c - saved };
}

export function caTfsaRoom(priorUnused: number, contributedThisYear: number): {
  annualLimit: number;
  remaining: number;
} {
  const remaining = Math.max(0, priorUnused + CA_2026.tfsaAnnual2026 - Math.max(0, contributedThisYear));
  return { annualLimit: CA_2026.tfsaAnnual2026, remaining };
}
