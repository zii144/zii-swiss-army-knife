import type { Market } from '@zii/registry';

const DARK_KEY = 'zii-dark';
const MARKET_KEY = 'zii-market';

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode / quota — prefs are optional.
  }
}

/** Stored dark preference, else `prefers-color-scheme`. No PII. */
export function readDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = storageGet(DARK_KEY);
  if (stored === '1') return true;
  if (stored === '0') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function writeDark(dark: boolean): void {
  if (typeof window === 'undefined') return;
  storageSet(DARK_KEY, dark ? '1' : '0');
}

/** Last selected market, if it is still a known option. */
export function readMarket(valid: readonly Market[]): Market {
  if (typeof window === 'undefined') return 'global';
  const stored = storageGet(MARKET_KEY);
  if (stored && (valid as readonly string[]).includes(stored)) {
    return stored as Market;
  }
  return 'global';
}

export function writeMarket(market: Market): void {
  if (typeof window === 'undefined') return;
  storageSet(MARKET_KEY, market);
}
