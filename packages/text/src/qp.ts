/** Encode text as quoted-printable (RFC 2045 subset). */
export function quotedPrintableEncode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const lines: string[] = [];
  let line = '';
  for (const b of bytes) {
    const ch = String.fromCharCode(b);
    const softBreak = line.length >= 73;
    const needsEscape = b === 61 || b < 32 || b > 126;
    const token = needsEscape ? `=${b.toString(16).toUpperCase().padStart(2, '0')}` : ch;
    if (softBreak) {
      lines.push(`${line}=`);
      line = token;
    } else {
      line += token;
    }
  }
  if (line) lines.push(line);
  return lines.join('\r\n');
}

/** Decode quoted-printable text. */
export function quotedPrintableDecode(qp: string): string {
  const unfolded = qp.replace(/\r\n/g, '\n').replace(/=\n/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < unfolded.length; i += 1) {
    if (unfolded[i] === '=' && /^=[0-9A-Fa-f]{2}/.test(unfolded.slice(i, i + 3))) {
      bytes.push(Number.parseInt(unfolded.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(unfolded.charCodeAt(i));
    }
  }
  return new TextDecoder().decode(Uint8Array.from(bytes));
}
