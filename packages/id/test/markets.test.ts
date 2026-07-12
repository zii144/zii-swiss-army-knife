import { describe, it, expect } from 'vitest';
import {
  validateKoBrn,
  generateKoBrn,
  validateAbn,
  generateAbn,
  validateSiren,
  generateSiren,
  validateNir,
  generateNir,
  validateCaPostal,
  generateCaPostal,
  validateAuPostcode,
  generateAuPostcode,
  validateFrPostal,
  generateFrPostal,
  validateKoPostal,
  generateKoPostal,
  ribToIban,
  validateIban,
  validateDeTaxId,
  generateDeTaxId,
  validateKoRrn,
  generateKoRrn,
} from '../src/index';

describe('validateKoBrn', () => {
  it('accepts a generated golden round-trip', () => {
    const id = generateKoBrn(42);
    expect(validateKoBrn(id)).toBe(true);
    expect(validateKoBrn(id.slice(0, -1) + ((Number(id.slice(-1)) + 1) % 10))).toBe(false);
  });

  it('generates ids that validate', () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(validateKoBrn(generateKoBrn(seed))).toBe(true);
    }
  });
});

describe('validateAbn', () => {
  it('accepts the ABR golden example', () => {
    expect(validateAbn('51824753556')).toBe(true);
  });

  it('rejects a tampered ABN', () => {
    expect(validateAbn('51824753557')).toBe(false);
  });

  it('generates ids that validate', () => {
    for (let seed = 0; seed < 30; seed++) {
      expect(validateAbn(generateAbn(seed))).toBe(true);
    }
  });
});

describe('validateSiren', () => {
  it('accepts Luhn-valid SIREN from generator as golden', () => {
    const id = generateSiren(7);
    expect(id).toHaveLength(9);
    expect(validateSiren(id)).toBe(true);
  });

  it('generates round-trips', () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(validateSiren(generateSiren(seed))).toBe(true);
    }
  });
});

describe('validateNir', () => {
  it('accepts a generated NIR with mod-97 key', () => {
    const id = generateNir(11);
    expect(id).toHaveLength(15);
    expect(validateNir(id)).toBe(true);
  });

  it('rejects a tampered key', () => {
    const id = generateNir(11);
    const bad = id.slice(0, 13) + String((Number(id.slice(13)) + 1) % 97).padStart(2, '0');
    expect(validateNir(bad)).toBe(false);
  });

  it('generates round-trips', () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(validateNir(generateNir(seed))).toBe(true);
    }
  });
});

describe('postal codes', () => {
  it('validates Canadian A1A 1A1 golden', () => {
    expect(validateCaPostal('K1A 0B1')).toBe(true);
    expect(validateCaPostal('K1A0B1')).toBe(true);
    expect(validateCaPostal('D1A 0B1')).toBe(false);
  });

  it('round-trips CA / AU / FR / KO postal generators', () => {
    for (let seed = 0; seed < 30; seed++) {
      expect(validateCaPostal(generateCaPostal(seed))).toBe(true);
      expect(validateAuPostcode(generateAuPostcode(seed))).toBe(true);
      expect(validateFrPostal(generateFrPostal(seed))).toBe(true);
      expect(validateKoPostal(generateKoPostal(seed))).toBe(true);
    }
  });
});

describe('ribToIban', () => {
  it('produces a MOD-97-valid French IBAN', () => {
    const iban = ribToIban('20041', '01005', '0500013M026', '06');
    expect(iban.startsWith('FR')).toBe(true);
    expect(validateIban(iban)).toBe(true);
  });
});

describe('other generators', () => {
  it('round-trips RRN and German IdNr', () => {
    for (let seed = 0; seed < 25; seed++) {
      expect(validateKoRrn(generateKoRrn(seed))).toBe(true);
      expect(validateDeTaxId(generateDeTaxId(seed))).toBe(true);
    }
  });
});
