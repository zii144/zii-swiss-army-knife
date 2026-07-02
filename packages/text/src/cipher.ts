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

/** Atbash cipher (reverse alphabet), self-inverse for letters. */
export function atbash(text: string): string {
  return text.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });
}

/** ROT47 encode/decode (self-inverse, printable ASCII). */
export function rot47(s: string): string {
  return s.replace(/[!-~]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String.fromCharCode(33 + ((code - 33 + 47) % 94));
  });
}

/** Escape non-ASCII and control chars as \\uXXXX. */
export function unicodeEscape(text: string): string {
  return [...text]
    .map((ch) => {
      const cp = ch.codePointAt(0)!;
      if (cp >= 0x20 && cp <= 0x7e) return ch === '\\' ? '\\\\' : ch;
      if (cp <= 0xffff) return `\\u${cp.toString(16).padStart(4, '0')}`;
      return `\\u${(0xd800 + ((cp - 0x10000) >> 10)).toString(16).padStart(4, '0')}\\u${(0xdc00 + ((cp - 0x10000) & 0x3ff)).toString(16).padStart(4, '0')}`;
    })
    .join('');
}

/** Unescape \\uXXXX (including surrogate pairs) to characters. */
export function unicodeUnescape(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\\' && text[i + 1] === 'u') {
      const hex = text.slice(i + 2, i + 6);
      if (/^[0-9a-fA-F]{4}$/.test(hex)) {
        const code = Number.parseInt(hex, 16);
        const next = text.slice(i + 6, i + 12);
        if (code >= 0xd800 && code <= 0xdbff && next.startsWith('\\u')) {
          const loHex = next.slice(2, 6);
          if (/^[0-9a-fA-F]{4}$/.test(loHex)) {
            const lo = Number.parseInt(loHex, 16);
            if (lo >= 0xdc00 && lo <= 0xdfff) {
              out += String.fromCodePoint((code - 0xd800) * 0x400 + (lo - 0xdc00) + 0x10000);
              i += 11;
              continue;
            }
          }
        }
        out += String.fromCharCode(code);
        i += 5;
        continue;
      }
    }
    out += text[i];
  }
  return out;
}
