// Cooking-measure conversion between cup (US), gram, and ml for a few ingredients.
//
// Densities (g per ml) used — common kitchen-reference approximations:
//   water: 1.0    g/ml
//   flour: 0.529  g/ml  (all-purpose, spooned & levelled ≈ 125 g per US cup)
//   sugar: 0.845  g/ml  (granulated white ≈ 200 g per US cup)
//
// 1 US cup = 236.5882365 ml (matches usCup in the units engine).

export type Ingredient = 'water' | 'flour' | 'sugar';
export type CookingUnit = 'cup' | 'gram' | 'ml';

const US_CUP_ML = 236.5882365;

/** Density in grams per millilitre for each supported ingredient. */
const DENSITY_G_PER_ML: Record<Ingredient, number> = {
  water: 1.0,
  flour: 0.529,
  sugar: 0.845,
};

/** Convert an `amount` of `ingredient` from one cooking unit to another. */
export function convertCooking(
  amount: number,
  ingredient: Ingredient,
  fromUnit: CookingUnit,
  toUnit: CookingUnit,
): number {
  const density = DENSITY_G_PER_ML[ingredient];
  if (density === undefined) {
    throw new Error(`convertCooking: unknown ingredient '${ingredient}'`);
  }

  // Normalise to millilitres (a volume) regardless of input unit.
  let ml: number;
  switch (fromUnit) {
    case 'ml':
      ml = amount;
      break;
    case 'cup':
      ml = amount * US_CUP_ML;
      break;
    case 'gram':
      ml = amount / density;
      break;
    default:
      throw new Error(`convertCooking: unknown fromUnit '${fromUnit}'`);
  }

  // Convert millilitres to the requested output unit.
  switch (toUnit) {
    case 'ml':
      return ml;
    case 'cup':
      return ml / US_CUP_ML;
    case 'gram':
      return ml * density;
    default:
      throw new Error(`convertCooking: unknown toUnit '${toUnit}'`);
  }
}

export { DENSITY_G_PER_ML, US_CUP_ML };
