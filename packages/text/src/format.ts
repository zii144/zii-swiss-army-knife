// Format conversion helpers: JSON<->CSV, pretty JSON, manual (environment
// independent) base64, URL encoding, and HTML escaping.

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Reverse lookup: char -> 6-bit value.
const BASE64_LOOKUP: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (let i = 0; i < BASE64_CHARS.length; i += 1) {
    const ch = BASE64_CHARS[i];
    if (ch !== undefined) out[ch] = i;
  }
  return out;
})();

/**
 * Encode a string to base64. UTF-8 bytes are produced with TextEncoder (a
 * standard Web/Node API) and the base64 alphabet is applied manually so the
 * function works identically in browsers and Node without btoa/Buffer.
 */
export function base64Encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const hasB1 = i + 1 < bytes.length;
    const hasB2 = i + 2 < bytes.length;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;

    const c0 = b0 >> 2;
    const c1 = ((b0 & 0x03) << 4) | (b1 >> 4);
    const c2 = ((b1 & 0x0f) << 2) | (b2 >> 6);
    const c3 = b2 & 0x3f;

    out += BASE64_CHARS[c0] ?? '';
    out += BASE64_CHARS[c1] ?? '';
    out += hasB1 ? (BASE64_CHARS[c2] ?? '') : '=';
    out += hasB2 ? (BASE64_CHARS[c3] ?? '') : '=';
  }
  return out;
}

/**
 * Decode a base64 string back to its original UTF-8 text. Whitespace and
 * padding are ignored; works identically in browsers and Node.
 */
export function base64Decode(s: string): string {
  const clean = s.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const ch0 = clean[i];
    const ch1 = clean[i + 1];
    const ch2 = clean[i + 2];
    const ch3 = clean[i + 3];

    const e0 = ch0 !== undefined ? (BASE64_LOOKUP[ch0] ?? 0) : 0;
    const e1 = ch1 !== undefined ? (BASE64_LOOKUP[ch1] ?? 0) : 0;
    const e2 = ch2 !== undefined ? (BASE64_LOOKUP[ch2] ?? 0) : 0;
    const e3 = ch3 !== undefined ? (BASE64_LOOKUP[ch3] ?? 0) : 0;

    const b0 = (e0 << 2) | (e1 >> 4);
    const b1 = ((e1 & 0x0f) << 4) | (e2 >> 2);
    const b2 = ((e2 & 0x03) << 6) | e3;

    bytes.push(b0);
    if (ch2 !== undefined) bytes.push(b1);
    if (ch3 !== undefined) bytes.push(b2);
  }
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function stringifyCsvValue(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/**
 * Convert an array of row objects to CSV. The header is the union of all keys
 * in first-seen order. Values are stringified; objects are JSON-encoded.
 * Returns an empty string for an empty input array.
 */
export function jsonToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';

  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }

  const lines: string[] = [];
  lines.push(headers.map(escapeCsvField).join(','));
  for (const row of rows) {
    const cells = headers.map((h) => escapeCsvField(stringifyCsvValue(row[h])));
    lines.push(cells.join(','));
  }
  return lines.join('\n');
}

/**
 * Parse CSV text into an array of row objects keyed by the header row. Handles
 * quoted fields, escaped quotes ("" -> "), and embedded newlines/commas.
 * Returns an empty array for empty input.
 */
export function csvToJson(csv: string): Record<string, string>[] {
  if (csv.length === 0) return [];

  const records: string[][] = [];
  let field = '';
  let record: string[] = [];
  let inQuotes = false;
  let i = 0;

  const pushField = (): void => {
    record.push(field);
    field = '';
  };
  const pushRecord = (): void => {
    pushField();
    records.push(record);
    record = [];
  };

  while (i < csv.length) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      pushField();
      i += 1;
      continue;
    }
    if (ch === '\r') {
      // Handle CRLF and lone CR.
      if (csv[i + 1] === '\n') i += 1;
      pushRecord();
      i += 1;
      continue;
    }
    if (ch === '\n') {
      pushRecord();
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  // Flush the final field/record if the file did not end with a newline.
  if (field.length > 0 || record.length > 0) {
    pushRecord();
  }

  const header = records[0];
  if (header === undefined) return [];

  const out: Record<string, string>[] = [];
  for (let r = 1; r < records.length; r += 1) {
    const row = records[r];
    if (row === undefined) continue;
    const obj: Record<string, string> = {};
    for (let c = 0; c < header.length; c += 1) {
      const key = header[c];
      if (key === undefined) continue;
      obj[key] = row[c] ?? '';
    }
    out.push(obj);
  }
  return out;
}

/** Stringify a value as pretty-printed JSON (default 2-space indent). */
export function prettyJson(obj: unknown, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}

/** Stringify a value as compact JSON (no extra whitespace). */
export function minifyJson(obj: unknown): string {
  return JSON.stringify(obj);
}

/** Options for {@link cleanCsv}. */
export interface CleanCsvOptions {
  /** Trim leading/trailing whitespace on headers and cells. Default true. */
  trimFields?: boolean;
  /** Drop rows where every cell is empty. Default true. */
  dropEmptyRows?: boolean;
  /** Deduplicate rows: none, full row, or first column only. Default `all`. */
  dedupe?: 'none' | 'all' | 'first-column';
}

/**
 * Normalize CSV: optional trim, drop blank rows, and dedupe. Returns cleaned
 * CSV text with a stable header row.
 */
export function cleanCsv(csv: string, opts: CleanCsvOptions = {}): string {
  const trimFields = opts.trimFields ?? true;
  const dropEmptyRows = opts.dropEmptyRows ?? true;
  const dedupe = opts.dedupe ?? 'all';

  let rows = csvToJson(csv);
  if (rows.length === 0) return '';

  if (trimFields) {
    rows = rows.map((row) => {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(row)) {
        out[k.trim()] = v.trim();
      }
      return out;
    });
  }

  if (dropEmptyRows) {
    rows = rows.filter((row) => Object.values(row).some((v) => v !== ''));
  }

  if (dedupe !== 'none') {
    const seen = new Set<string>();
    rows = rows.filter((row) => {
      const key =
        dedupe === 'first-column'
          ? (Object.values(row)[0] ?? '')
          : JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return jsonToCsv(rows as Record<string, unknown>[]);
}

/** URL-encode a string component (encodeURIComponent). */
export function urlEncode(s: string): string {
  return encodeURIComponent(s);
}

/** URL-decode a string component (decodeURIComponent). */
export function urlDecode(s: string): string {
  return decodeURIComponent(s);
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape the five HTML-significant characters. */
export function htmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/** Reverse htmlEscape, including numeric/hex entities. */
export function htmlUnescape(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|#39);/g, (m, body: string) => {
    switch (body) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      case 'apos':
        return "'";
      default:
        break;
    }
    if (body.startsWith('#x') || body.startsWith('#X')) {
      const code = parseInt(body.slice(2), 16);
      return Number.isNaN(code) ? m : String.fromCodePoint(code);
    }
    if (body.startsWith('#')) {
      const code = parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? m : String.fromCodePoint(code);
    }
    return m;
  });
}
