// Unit conversion engine.
//
// Most dimensions convert linearly: each unit has a factor expressing its size in a
// canonical base unit, so `convert = value * factor[from] / factor[to]`.
// Temperature is non-linear (offsets), so it is handled separately.
//
// US and imperial gallons/pints are kept as DISTINCT units on purpose:
//   usGal ≈ 3.785411784 L, impGal ≈ 4.54609 L.

export type LengthUnit = 'm' | 'km' | 'mi' | 'ft' | 'in' | 'yd';
export type MassUnit = 'kg' | 'g' | 'lb' | 'oz' | 'st';
export type TemperatureUnit = 'C' | 'F' | 'K';
export type VolumeUnit = 'l' | 'ml' | 'usGal' | 'impGal' | 'usPint' | 'impPint' | 'usCup';
export type AreaUnit = 'm2' | 'ft2' | 'acre' | 'ha';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type DataUnit = 'B' | 'KB' | 'MB' | 'GB' | 'KiB' | 'MiB' | 'GiB';
export type PressureUnit = 'Pa' | 'kPa' | 'bar' | 'psi' | 'atm' | 'mmHg';

export type Unit =
  | LengthUnit
  | MassUnit
  | TemperatureUnit
  | VolumeUnit
  | AreaUnit
  | SpeedUnit
  | DataUnit
  | PressureUnit;

// --- Linear factor tables (value-in-base-unit per 1 of the listed unit) ---

// Base: metre.
const LENGTH: Record<LengthUnit, number> = {
  m: 1,
  km: 1000,
  mi: 1609.344,
  ft: 0.3048,
  in: 0.0254,
  yd: 0.9144,
};

// Base: kilogram.
const MASS: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.028349523125,
  st: 6.35029318,
};

// Base: litre.
const VOLUME: Record<VolumeUnit, number> = {
  l: 1,
  ml: 0.001,
  usGal: 3.785411784,
  impGal: 4.54609,
  usPint: 0.473176473, // usGal / 8
  impPint: 0.56826125, // impGal / 8
  usCup: 0.2365882365, // usGal / 16
};

// Base: square metre.
const AREA: Record<AreaUnit, number> = {
  m2: 1,
  ft2: 0.09290304,
  acre: 4046.8564224,
  ha: 10000,
};

// Base: metre per second.
const SPEED: Record<SpeedUnit, number> = {
  ms: 1,
  kmh: 1000 / 3600,
  mph: 1609.344 / 3600,
};

// Base: byte. Decimal (SI) and binary (IEC) prefixes are distinct.
const DATA: Record<DataUnit, number> = {
  B: 1,
  KB: 1000,
  MB: 1000 ** 2,
  GB: 1000 ** 3,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
};

// Base: pascal.
const PRESSURE: Record<PressureUnit, number> = {
  Pa: 1,
  kPa: 1000,
  bar: 100_000,
  psi: 6894.757293168,
  atm: 101_325,
  mmHg: 133.322387415,
};

type LinearTable = Record<string, number>;

const LINEAR_DIMENSIONS: Record<string, LinearTable> = {
  length: LENGTH,
  mass: MASS,
  volume: VOLUME,
  area: AREA,
  speed: SPEED,
  data: DATA,
  pressure: PRESSURE,
};

const TEMPERATURE_UNITS: readonly TemperatureUnit[] = ['C', 'F', 'K'];

/** Find which dimension a unit belongs to, or undefined if unknown. */
function dimensionOf(unit: string): string | undefined {
  if ((TEMPERATURE_UNITS as readonly string[]).includes(unit)) {
    return 'temperature';
  }
  for (const dim of Object.keys(LINEAR_DIMENSIONS)) {
    const table = LINEAR_DIMENSIONS[dim];
    if (table && Object.prototype.hasOwnProperty.call(table, unit)) {
      return dim;
    }
  }
  return undefined;
}

// --- Temperature (non-linear) ---

function toCelsius(value: number, from: TemperatureUnit): number {
  switch (from) {
    case 'C':
      return value;
    case 'F':
      return (value - 32) * (5 / 9);
    case 'K':
      return value - 273.15;
  }
}

function fromCelsius(celsius: number, to: TemperatureUnit): number {
  switch (to) {
    case 'C':
      return celsius;
    case 'F':
      return celsius * (9 / 5) + 32;
    case 'K':
      return celsius + 273.15;
  }
}

function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  return fromCelsius(toCelsius(value, from), to);
}

/**
 * Convert a value between two units of the SAME dimension.
 * Throws on unknown units or cross-dimension conversions.
 *
 *   convert(1, 'mi', 'km') === 1.609344
 *   convert(0, 'C', 'F')   === 32
 *   convert(100, 'C', 'F') === 212
 */
export function convert(value: number, from: Unit, to: Unit): number {
  const fromDim = dimensionOf(from);
  const toDim = dimensionOf(to);
  if (fromDim === undefined) {
    throw new Error(`convert: unknown unit '${from}'`);
  }
  if (toDim === undefined) {
    throw new Error(`convert: unknown unit '${to}'`);
  }
  if (fromDim !== toDim) {
    throw new Error(
      `convert: cannot convert across dimensions ('${from}' is ${fromDim}, '${to}' is ${toDim})`,
    );
  }

  if (fromDim === 'temperature') {
    return convertTemperature(value, from as TemperatureUnit, to as TemperatureUnit);
  }

  const table = LINEAR_DIMENSIONS[fromDim];
  // dimensionOf guarantees these keys exist in the table.
  const fromFactor = table?.[from];
  const toFactor = table?.[to];
  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`convert: missing factor for '${from}' or '${to}'`);
  }
  return (value * fromFactor) / toFactor;
}
