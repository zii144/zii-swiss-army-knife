import { describe, it, expect } from 'vitest';
import {
  caTakeHome,
  caProvincialTax,
  auTakeHome,
  koTakeHome,
  deTakeHome,
  frBrutNet,
  CA_2026,
  AU_2026,
  KO_2026,
  DE_2026,
  FR_2026,
} from '../src/index';

describe('market payroll smoke', () => {
  it('caTakeHome returns a coherent net under gross', () => {
    const r = caTakeHome(80_000, { province: 'ON' });
    expect(r.gross).toBe(80_000);
    expect(r.net).toBeLessThan(r.gross);
    expect(r.net).toBeGreaterThan(40_000);
    expect(r.cpp + r.cpp2).toBeGreaterThan(0);
    expect(r.ei).toBeGreaterThan(0);
    expect(CA_2026.label).toMatch(/2026/);
  });

  it('caProvincialTax differs by province', () => {
    const on = caProvincialTax(80_000, 'ON');
    const qc = caProvincialTax(80_000, 'QC');
    const ab = caProvincialTax(80_000, 'AB');
    expect(qc).toBeGreaterThan(on);
    expect(ab).not.toBe(on);
  });

  it('auTakeHome applies tax and medicare', () => {
    const r = auTakeHome(90_000, { help: true, privateHospital: false });
    expect(r.net).toBeLessThan(90_000);
    expect(r.incomeTax).toBeGreaterThan(0);
    expect(r.medicare).toBeCloseTo(90_000 * 0.02, 0);
    expect(r.help).toBeGreaterThan(0);
    expect(r.superGuarantee).toBeCloseTo(90_000 * AU_2026.superGuaranteeRate, 0);
  });

  it('koTakeHome deducts insurances and tax', () => {
    const r = koTakeHome(3_500_000, 200_000);
    expect(r.takeHome).toBeLessThan(3_500_000);
    expect(r.insurances.total).toBeGreaterThan(0);
    expect(r.incomeTax).toBeGreaterThanOrEqual(0);
    expect(KO_2026.label).toMatch(/2026/);
  });

  it('deTakeHome returns Netto below Brutto', () => {
    const r = deTakeHome(4_000, { taxClass: 1, zusatz: 0.029, church: true });
    expect(r.net).toBeLessThan(4_000);
    expect(r.wageTax).toBeGreaterThan(0);
    expect(r.pension).toBeGreaterThan(0);
    expect(DE_2026.label).toMatch(/2026/);
  });

  it('frBrutNet applies cotisations and PAS', () => {
    const r = frBrutNet(3_000);
    expect(r.netBeforePas).toBeCloseTo(3_000 * (1 - FR_2026.employeeCotisationsRate), 0);
    expect(r.netAfterPas).toBeLessThanOrEqual(r.netBeforePas);
    expect(r.pas).toBeGreaterThanOrEqual(0);
  });
});
