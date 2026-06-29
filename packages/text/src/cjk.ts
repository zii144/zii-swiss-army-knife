/**
 * Simplified ⇄ Traditional Chinese conversion, powered by OpenCC
 * (`opencc-js`, MIT AND Apache-2.0) with its full bundled dictionaries — not a
 * curated character table. Pure, deterministic, offline; runs in browser and
 * Node alike.
 *
 * `toTraditional` uses the standard Traditional mapping; `toTraditionalTaiwan`
 * additionally applies Taiwan vocabulary/idioms (e.g. 软件→軟體, 鼠标→滑鼠).
 */
import * as OpenCC from 'opencc-js';

type Convert = (text: string) => string;

// Converters are created lazily and memoised. Each carries the OpenCC
// dictionaries, so creation is the only non-trivial cost.
let cnToTw: Convert | undefined;
let cnToTwIdiom: Convert | undefined;
let twToCn: Convert | undefined;

function simpToTrad(): Convert {
  return (cnToTw ??= OpenCC.Converter({ from: 'cn', to: 'tw' }));
}

function simpToTradTaiwan(): Convert {
  return (cnToTwIdiom ??= OpenCC.Converter({ from: 'cn', to: 'twp' }));
}

function tradToSimp(): Convert {
  return (twToCn ??= OpenCC.Converter({ from: 'tw', to: 'cn' }));
}

/** Convert Traditional Chinese to Simplified Chinese. */
export function toSimplified(s: string): string {
  return tradToSimp()(s);
}

/** Convert Simplified Chinese to Traditional Chinese (standard mapping). */
export function toTraditional(s: string): string {
  return simpToTrad()(s);
}

/**
 * Convert Simplified Chinese to Traditional Chinese **with Taiwan-localized
 * vocabulary** (idiom conversion), e.g. 软件→軟體, 内存→記憶體, 鼠标→滑鼠.
 */
export function toTraditionalTaiwan(s: string): string {
  return simpToTradTaiwan()(s);
}
