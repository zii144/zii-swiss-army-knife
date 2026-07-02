const ROMAN: ReadonlyArray<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Convert an integer 1..3999 to a Roman numeral string. */
export function toRoman(n: number): string {
  const value = Math.trunc(n);
  if (value < 1 || value > 3999) {
    throw new RangeError('Roman numerals support integers from 1 to 3999');
  }
  let rest = value;
  let out = '';
  for (const [v, sym] of ROMAN) {
    while (rest >= v) {
      out += sym;
      rest -= v;
    }
  }
  return out;
}

/** Parse a Roman numeral (case-insensitive) to an integer. */
export function fromRoman(s: string): number {
  const upper = s.trim().toUpperCase();
  if (!/^[IVXLCDM]+$/.test(upper)) {
    throw new RangeError('Invalid Roman numeral');
  }
  let i = 0;
  let total = 0;
  while (i < upper.length) {
    const pair = upper.slice(i, i + 2);
    const one = upper[i];
    if (one === undefined) break;
    const twoVal = ROMAN.find(([, sym]) => sym === pair)?.[0];
    if (twoVal !== undefined) {
      total += twoVal;
      i += 2;
      continue;
    }
    const oneVal = ROMAN.find(([, sym]) => sym === one)?.[0];
    if (oneVal === undefined) throw new RangeError('Invalid Roman numeral');
    total += oneVal;
    i += 1;
  }
  if (toRoman(total) !== upper) throw new RangeError('Invalid Roman numeral');
  return total;
}
