// Small, pure, dependency-free helpers backing several dev/generator tools.
// Kept here (not in an engine package) because they're app-local and tiny;
// unit-tested in test/toolkit.test.ts.

/* ------------------------------------------------------------------ password */

export interface PasswordOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
}

const CHARSETS = {
  lower: 'abcdefghijkmnpqrstuvwxyz',
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digits: '23456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};

/** Cryptographically-random password from the selected character classes. */
export function randomPassword(o: PasswordOptions): string {
  let pool = '';
  if (o.lower) pool += CHARSETS.lower;
  if (o.upper) pool += CHARSETS.upper;
  if (o.digits) pool += CHARSETS.digits;
  if (o.symbols) pool += CHARSETS.symbols;
  if (!pool) return '';
  const n = Math.max(1, Math.min(256, Math.trunc(o.length)));
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < n; i++) out += pool[buf[i]! % pool.length];
  return out;
}

/** Approximate entropy in bits for the given options. */
export function passwordBits(o: PasswordOptions): number {
  let pool = 0;
  if (o.lower) pool += CHARSETS.lower.length;
  if (o.upper) pool += CHARSETS.upper.length;
  if (o.digits) pool += CHARSETS.digits.length;
  if (o.symbols) pool += CHARSETS.symbols.length;
  return pool > 0 ? Math.round(Math.max(1, Math.trunc(o.length)) * Math.log2(pool)) : 0;
}

/** Cryptographically-random string from a custom character pool. */
export function randomString(length: number, pool: string): string {
  if (!pool) return '';
  const n = Math.max(1, Math.min(512, Math.trunc(length)));
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < n; i++) out += pool[buf[i]! % pool.length];
  return out;
}

/* ---------------------------------------------------------------------- uuid */

export function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0'));
  return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10, 16).join('')}`;
}

/* --------------------------------------------------------------- base convert */

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

function parseBig(s: string, base: number): bigint {
  let str = s.trim().toLowerCase();
  if (!str) throw new Error('empty');
  let neg = false;
  if (str.startsWith('-')) {
    neg = true;
    str = str.slice(1);
  }
  const b = BigInt(base);
  let acc = 0n;
  for (const ch of str) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) throw new Error(`invalid digit '${ch}' for base ${base}`);
    acc = acc * b + BigInt(d);
  }
  return neg ? -acc : acc;
}

function bigToBase(n: bigint, base: number): string {
  if (n === 0n) return '0';
  let neg = false;
  if (n < 0n) {
    neg = true;
    n = -n;
  }
  const b = BigInt(base);
  let out = '';
  while (n > 0n) {
    out = DIGITS[Number(n % b)] + out;
    n = n / b;
  }
  return (neg ? '-' : '') + out;
}

/** Convert an integer string between arbitrary bases (2..36). */
export function convertBase(value: string, from: number, to: number): string {
  if (from < 2 || from > 36 || to < 2 || to > 36) throw new Error('base must be 2..36');
  return bigToBase(parseBig(value, from), to);
}

/* --------------------------------------------------------------------- color */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseColor(input: string): Rgb | null {
  const s = input.trim().toLowerCase();
  let m = /^#?([0-9a-f]{3})$/.exec(s);
  if (m) {
    const [r, g, b] = [...m[1]!].map((c) => parseInt(c + c, 16));
    return { r: r!, g: g!, b: b! };
  }
  m = /^#?([0-9a-f]{6})$/.exec(s);
  if (m) {
    const v = m[1]!;
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
    };
  }
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(s);
  if (m) return { r: +m[1]!, g: +m[2]!, b: +m[3]! };
  return null;
}

const hx = (n: number): string => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${hx(r)}${hx(g)}${hx(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/* ----------------------------------------------------------------------- jwt */

function b64urlToJson(seg: string): unknown {
  let s = seg.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export interface DecodedJwt {
  header: unknown;
  payload: unknown;
}

/** Decode (not verify) a JWT's header and payload. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length < 2) throw new Error('Not a JWT (expected header.payload.signature)');
  return { header: b64urlToJson(parts[0]!), payload: b64urlToJson(parts[1]!) };
}

/* ---------------------------------------------------------------------- cron */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function describeField(field: string, names?: string[], everyLabel = ''): string {
  if (field === '*') return everyLabel;
  const parts = field.split(',');
  const render = (p: string): string => {
    const stepM = /^(\*|\d+(?:-\d+)?)\/(\d+)$/.exec(p);
    if (stepM) return `every ${stepM[2]}${stepM[1] === '*' ? '' : ` in ${stepM[1]}`}`;
    const rangeM = /^(\d+)-(\d+)$/.exec(p);
    if (rangeM) return `${label(+rangeM[1]!, names)}–${label(+rangeM[2]!, names)}`;
    return label(+p, names);
  };
  return parts.map(render).join(', ');
}

function label(n: number, names?: string[]): string {
  if (names) return names[n % names.length] ?? String(n);
  return String(n);
}

/** Human-readable summary of a 5-field cron expression (best-effort). */
export function explainCron(expr: string): string {
  const f = expr.trim().split(/\s+/);
  if (f.length !== 5) throw new Error('Expected 5 fields: minute hour day-of-month month day-of-week');
  const [min, hour, dom, mon, dow] = f as [string, string, string, string, string];

  const time =
    min === '*' && hour === '*'
      ? 'every minute'
      : hour === '*'
        ? `minute ${describeField(min, undefined, 'every minute')}`
        : min === '*'
          ? `every minute of hour ${describeField(hour)}`
          : `at ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;

  const parts = [time];
  if (dow !== '*') parts.push(`on ${describeField(dow, DOW, 'every day')}`);
  if (dom !== '*') parts.push(`on day-of-month ${describeField(dom)}`);
  if (mon !== '*') parts.push(`in ${describeField(mon, ['', ...MONTHS])}`);
  return parts.join(' ');
}

/* ------------------------------------------------------------- expression eval */

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
};

/**
 * Safely evaluate a math expression (no `eval`). Supports + - * / % ^,
 * parentheses, unary minus, the functions in FUNCS, and the constants pi/e.
 * Trig is in radians. Throws on malformed input.
 */
export function evalExpression(input: string): number {
  const s = input;
  let i = 0;
  const skip = (): void => {
    while (i < s.length && s[i] === ' ') i++;
  };

  const parseExpr = (): number => {
    let v = parseTerm();
    skip();
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++];
      const r = parseTerm();
      v = op === '+' ? v + r : v - r;
      skip();
    }
    return v;
  };
  const parseTerm = (): number => {
    let v = parseFactor();
    skip();
    while (s[i] === '*' || s[i] === '/' || s[i] === '%') {
      const op = s[i++];
      const r = parseFactor();
      v = op === '*' ? v * r : op === '/' ? v / r : v % r;
      skip();
    }
    return v;
  };
  const parseFactor = (): number => {
    const base = parseUnary();
    skip();
    if (s[i] === '^') {
      i++;
      return Math.pow(base, parseFactor());
    }
    return base;
  };
  const parseUnary = (): number => {
    skip();
    if (s[i] === '-') {
      i++;
      return -parseUnary();
    }
    if (s[i] === '+') {
      i++;
      return parseUnary();
    }
    return parsePrimary();
  };
  const parsePrimary = (): number => {
    skip();
    if (s[i] === '(') {
      i++;
      const v = parseExpr();
      skip();
      if (s[i] !== ')') throw new Error('missing )');
      i++;
      return v;
    }
    const rest = s.slice(i);
    const numM = /^[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(rest);
    if (numM && /[0-9.]/.test(s[i] ?? '')) {
      i += numM[0].length;
      return parseFloat(numM[0]);
    }
    const idM = /^[a-zA-Z]+/.exec(rest);
    if (idM) {
      const name = idM[0].toLowerCase();
      i += idM[0].length;
      skip();
      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;
      if (s[i] === '(') {
        i++;
        const arg = parseExpr();
        skip();
        if (s[i] !== ')') throw new Error('missing )');
        i++;
        const fn = FUNCS[name];
        if (!fn) throw new Error(`unknown function '${name}'`);
        return fn(arg);
      }
      throw new Error(`unknown identifier '${name}'`);
    }
    throw new Error('unexpected token');
  };

  skip();
  if (i >= s.length) throw new Error('empty expression');
  const result = parseExpr();
  skip();
  if (i < s.length) throw new Error('unexpected trailing input');
  if (!Number.isFinite(result)) throw new Error('not a finite number');
  return result;
}
