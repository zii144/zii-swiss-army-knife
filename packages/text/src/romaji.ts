/**
 * Hepburn romanization of Japanese kana (かな → ローマ字). Pure, offline,
 * deterministic. Rule-based (no dictionary) — it romanizes kana, not kanji.
 *
 * Rules covered:
 *  - Gojūon + dakuten/handakuten + yōon (きゃ→kya, しゃ→sha, ちゃ→cha …)
 *  - Sokuon 促音 っ → doubles the next consonant (がっこう→gakkou), with the
 *    Hepburn special case っち/っちゃ → tchi/tcha
 *  - Syllabic ん → "n", written "n'" before a vowel or y (しんゆう→shin'yuu)
 *  - Katakana long vowel ー → macron (ラーメン→rāmen). Hiragana vowel
 *    sequences are kept literal (とうきょう→toukyou) for deterministic output.
 *  - Common extended katakana (ファ→fa, ティ→ti, ヴ→vu …)
 */

const CHOONPU = 'ー'; // ー

/** Two-kana yōon and extended combinations (checked before single kana). */
const DIGRAPHS: Readonly<Record<string, string>> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  ぢゃ: 'ja', ぢゅ: 'ju', ぢょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  // Extended (foreign) sounds — after katakana→hiragana normalization.
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo',
  てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du',
  うぃ: 'wi', うぇ: 'we', うぉ: 'wo',
  ゔぁ: 'va', ゔぃ: 'vi', ゔ: 'vu', ゔぇ: 've', ゔぉ: 'vo',
};

/** Single kana. */
const MONOGRAPHS: Readonly<Record<string, string>> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  ゃ: 'ya', ゅ: 'yu', ょ: 'yo', ゎ: 'wa',
};

const VOWELS = new Set(['a', 'i', 'u', 'e', 'o']);
const MACRON: Readonly<Record<string, string>> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };

/** Normalize katakana (U+30A1–U+30F6) to hiragana; leave ー and others intact. */
function katakanaToHiragana(input: string): string {
  let out = '';
  for (const ch of input) {
    const code = ch.codePointAt(0)!;
    if (code >= 0x30a1 && code <= 0x30f6) out += String.fromCodePoint(code - 0x60);
    else out += ch;
  }
  return out;
}

/** Apply a pending sokuon (っ) by doubling the leading consonant of `romaji`. */
function applySokuon(romaji: string): string {
  const first = romaji[0];
  if (first === undefined || VOWELS.has(first)) return romaji; // nothing to double
  if (romaji.startsWith('ch')) return 't' + romaji; // Hepburn: っち→tchi, っちゃ→tcha
  return first + romaji;
}

/**
 * Romanize a string of Japanese kana into Hepburn rōmaji. Non-kana characters
 * (spaces, punctuation, latin, kanji) pass through unchanged.
 */
export function kanaToRomaji(input: string): string {
  const s = katakanaToHiragana(input);
  const chars = [...s];
  let out = '';
  let sokuon = false;

  const push = (romaji: string): void => {
    out += sokuon ? applySokuon(romaji) : romaji;
    sokuon = false;
  };

  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i]!;
    const next = chars[i + 1];

    if (ch === CHOONPU) {
      // Lengthen the previous vowel with a macron.
      const last = out[out.length - 1];
      if (last !== undefined && VOWELS.has(last)) out = out.slice(0, -1) + MACRON[last];
      continue;
    }

    if (ch === 'っ') {
      sokuon = true;
      continue;
    }

    if (ch === 'ん') {
      // Romanize the next syllable enough to see its first letter, then write
      // "n'" before a vowel or y (しんゆう→shin'yuu) and "n" otherwise.
      let nextRomaji = '';
      if (next !== undefined) {
        const two = chars[i + 2] !== undefined ? DIGRAPHS[next + chars[i + 2]!] : undefined;
        nextRomaji = two ?? MONOGRAPHS[next] ?? '';
      }
      const head = nextRomaji[0];
      out += head !== undefined && (VOWELS.has(head) || head === 'y') ? "n'" : 'n';
      continue;
    }

    // Try a two-kana digraph first, then a single kana.
    if (next !== undefined && DIGRAPHS[ch + next] !== undefined) {
      push(DIGRAPHS[ch + next]!);
      i += 1;
      continue;
    }
    const mono = MONOGRAPHS[ch];
    if (mono !== undefined) {
      push(mono);
      continue;
    }
    // Unknown (kanji, latin, punctuation): flush any pending sokuon literally.
    if (sokuon) {
      out += 'っ';
      sokuon = false;
    }
    out += ch;
  }

  if (sokuon) out += 'っ'; // trailing sokuon with nothing to double
  return out;
}
