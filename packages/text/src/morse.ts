const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
};

const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

/** Encode text to International Morse (letters separated by space, words by /). */
export function morseEncode(text: string): string {
  return text
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      [...word]
        .map((ch) => MORSE[ch] ?? '')
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join(' / ');
}

/** Decode International Morse to text. */
export function morseDecode(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => REV[code] ?? '')
        .join(''),
    )
    .join(' ');
}
