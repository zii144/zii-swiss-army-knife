import { afterEach, describe, expect, it } from 'vitest';
import { readDark, readMarket, writeDark, writeMarket } from '../src/lib/prefs';

type Store = Record<string, string>;

function installWindow(store: Store, prefersDark = false): void {
  const localStorage = {
    getItem: (key: string) => (key in store ? store[key]! : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage,
      matchMedia: (query: string) => ({ matches: prefersDark && query.includes('dark') }),
    },
  });
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
});

describe('prefs', () => {
  it('falls back to prefers-color-scheme when nothing is stored', () => {
    installWindow({}, true);
    expect(readDark()).toBe(true);
    installWindow({}, false);
    expect(readDark()).toBe(false);
  });

  it('persists an explicit dark toggle over the system preference', () => {
    const store: Store = {};
    installWindow(store, false);
    writeDark(true);
    expect(store['zii-dark']).toBe('1');
    expect(readDark()).toBe(true);
    writeDark(false);
    expect(store['zii-dark']).toBe('0');
    expect(readDark()).toBe(false);
  });

  it('restores a stored market only when it is still selectable', () => {
    const store: Store = { 'zii-market': 'jp' };
    installWindow(store);
    expect(readMarket(['global', 'jp', 'tw'])).toBe('jp');
    expect(readMarket(['global', 'tw'])).toBe('global');
    writeMarket('tw');
    expect(store['zii-market']).toBe('tw');
  });
});
