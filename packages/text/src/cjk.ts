// Simplified <-> Traditional Chinese conversion using a SMALL built-in mapping
// table of common characters. This demonstrates the conversion mechanism; the
// full OpenCC dataset is a planned follow-up (see README).

// Simplified -> Traditional, character by character. Keep entries 1:1 so the
// reverse mapping is unambiguous for this curated subset.
const SIMP_TO_TRAD: Record<string, string> = {
  国: '國',
  软: '軟',
  体: '體',
  繁: '繁', // identical in both; kept for documentation/clarity
  电: '電',
  脑: '腦',
  车: '車',
  门: '門',
  马: '馬',
  鸟: '鳥',
  鱼: '魚',
  龙: '龍',
  爱: '愛',
  学: '學',
  习: '習',
  书: '書',
  画: '畫',
  时: '時',
  间: '間',
  长: '長',
  风: '風',
  飞: '飛',
  发: '發',
  开: '開',
  关: '關',
  来: '來',
  万: '萬',
  与: '與',
  专: '專',
  东: '東',
  丝: '絲',
  乐: '樂',
  买: '買',
  卖: '賣',
  亚: '亞',
  们: '們',
  从: '從',
  众: '眾',
  会: '會',
  传: '傳',
  纸: '紙',
  网: '網',
  语: '語',
  说: '說',
  读: '讀',
  写: '寫',
  汉: '漢',
};

// Build the reverse map once. If two simplified chars map to the same
// traditional char, the first one wins (deterministic by insertion order).
const TRAD_TO_SIMP: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const [simp, trad] of Object.entries(SIMP_TO_TRAD)) {
    if (!(trad in out)) out[trad] = simp;
  }
  return out;
})();

function mapChars(s: string, table: Record<string, string>): string {
  let out = '';
  for (const ch of s) {
    const mapped = table[ch];
    out += mapped ?? ch;
  }
  return out;
}

/** Convert Traditional characters to Simplified using the built-in table. */
export function toSimplified(s: string): string {
  return mapChars(s, TRAD_TO_SIMP);
}

/** Convert Simplified characters to Traditional using the built-in table. */
export function toTraditional(s: string): string {
  return mapChars(s, SIMP_TO_TRAD);
}
