/** ROT13 encode/decode (self-inverse). */
export function rot13(s: string): string {
  return s.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const code = ch.charCodeAt(0) - base;
    return String.fromCharCode(base + ((code + 13) % 26));
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
