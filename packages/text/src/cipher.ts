/** ROT13 encode/decode (self-inverse). */
export function rot13(s: string): string {
  return caesarCipher(s, 13);
}

/** Caesar cipher with a custom shift (1–25). Set decode=true to reverse. */
export function caesarCipher(s: string, shift: number, decode = false): string {
  const k = (((decode ? -shift : shift) % 26) + 26) % 26;
  return s.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const code = ch.charCodeAt(0) - base;
    return String.fromCharCode(base + ((code + k) % 26));
  });
}

/** Escape a string for embedding inside JSON (without surrounding quotes). */
export function jsonEscapeString(s: string): string {
  return JSON.stringify(s).slice(1, -1);
}

/** Unescape a JSON string fragment (without surrounding quotes). */
export function jsonUnescapeString(s: string): string {
  return JSON.parse(`"${s}"`) as string;
}

/** Encode text as space-separated binary octets (8 bits per character). */
export function textToBinary(text: string, sep = ' '): string {
  return [...text].map((ch) => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(sep);
}

/** Decode space-separated binary octets back to text. */
export function binaryToText(binary: string): string {
  const tokens = binary.trim().split(/\s+/);
  return tokens.map((t) => String.fromCharCode(Number.parseInt(t, 2))).join('');
}

/** Encode text as hexadecimal (optional separator between bytes). */
export function textToHex(text: string, sep = ''): string {
  return [...text].map((ch) => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(sep);
}

/** Decode hexadecimal (with or without separators) back to text. */
export function hexToText(hex: string): string {
  const clean = hex.replace(/\s+/g, '').replace(/^0x/i, '');
  if (clean.length === 0) return '';
  if (clean.length % 2 !== 0) throw new RangeError('Invalid hex length');
  if (!/^[0-9a-fA-F]+$/.test(clean)) throw new RangeError('Invalid hex');
  const out: string[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    out.push(String.fromCharCode(Number.parseInt(clean.slice(i, i + 2), 16)));
  }
  return out.join('');
}
