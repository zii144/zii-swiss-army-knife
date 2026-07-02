const DEFAULT_ALPHABET = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Generate a URL-friendly NanoID-style string. */
export function nanoid(size = 21, alphabet = DEFAULT_ALPHABET): string {
  if (!alphabet) return '';
  const n = Math.max(1, Math.min(256, Math.trunc(size)));
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  let id = '';
  for (let i = 0; i < n; i += 1) id += alphabet[buf[i]! % alphabet.length];
  return id;
}
