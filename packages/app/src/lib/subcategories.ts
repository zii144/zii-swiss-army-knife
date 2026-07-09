import type { ToolCategory } from '@zii/registry';
import type { Lang } from './i18n';
import type { L10n } from './catalog';

/** An ordered sub-section within a category detail page. */
export interface SubGroup {
  key: string;
  label: L10n;
  /** Tool ids in this group, in display order. */
  tools: readonly string[];
}

/** A sub-group resolved against the tools actually available (market-filtered). */
export interface ResolvedSubGroup {
  key: string;
  label: L10n;
  tools: string[];
}

/**
 * Curated sub-sections for the large categories, so a 30-plus-tool page reads
 * as a handful of scannable groups (JSON, encoding, hashing…) instead of one
 * wall. Labels are fully localized (see L10n); missing locales fall back to
 * English via subLabel.
 * Categories not listed here render as a single flat list.
 */
export const SUBCATEGORIES: Partial<Record<ToolCategory, readonly SubGroup[]>> = {
  dev: [
    {
      key: 'json',
      label: {
        en: 'JSON & data formats',
        'zh-TW': 'JSON 與資料格式',
        'zh-HK': 'JSON 與資料格式',
        ja: 'JSON・データ形式',
        ko: 'JSON 및 데이터 형식',
        es: 'JSON y formatos de datos',
        fr: 'JSON et formats de données',
        de: 'JSON & Datenformate',
      },
      tools: [
        'json-format',
        'json-csv',
        'json-yaml',
        'json-escape',
        'xml-json',
        'csv-clean',
        'transpose-grid',
      ],
    },
    {
      key: 'encode',
      label: {
        en: 'Encoding & escaping',
        'zh-TW': '編碼與跳脫',
        'zh-HK': '編碼與跳脫',
        ja: 'エンコード・エスケープ',
        ko: '인코딩 및 이스케이프',
        es: 'Codificación y escape',
        fr: 'Encodage et échappement',
        de: 'Kodierung & Escaping',
      },
      tools: [
        'base64',
        'base32-codec',
        'base-convert',
        'url-encode',
        'quoted-printable',
        'unicode-escape',
        'html-entities',
        'hex-text',
        'binary-text',
      ],
    },
    {
      key: 'crypto',
      label: {
        en: 'Hashing & tokens',
        'zh-TW': '雜湊與權杖',
        'zh-HK': '雜湊與權杖',
        ja: 'ハッシュ・トークン',
        ko: '해시 및 토큰',
        es: 'Hash y tokens',
        fr: 'Hachage et jetons',
        de: 'Hashing & Tokens',
      },
      tools: ['hash', 'hmac', 'jwt-decode'],
    },
    {
      key: 'inspect',
      label: {
        en: 'Inspect & test',
        'zh-TW': '檢查與測試',
        'zh-HK': '檢查與測試',
        ja: '検査・テスト',
        ko: '검사 및 테스트',
        es: 'Inspección y pruebas',
        fr: 'Inspection et tests',
        de: 'Prüfen & Testen',
      },
      tools: ['regex-tester', 'cron', 'color-convert', 'timestamp-convert', 'duration-format'],
    },
    {
      key: 'textdata',
      label: {
        en: 'Text & data utilities',
        'zh-TW': '文字與資料工具',
        'zh-HK': '文字與資料工具',
        ja: 'テキスト・データ処理',
        ko: '텍스트 및 데이터 도구',
        es: 'Utilidades de texto y datos',
        fr: 'Utilitaires de texte et de données',
        de: 'Text- & Datenwerkzeuge',
      },
      tools: [
        'grep-lines',
        'indent-lines',
        'tabs-spaces',
        'strip-html',
        'markdown-strip',
        'extract-ipv4',
      ],
    },
    {
      key: 'similarity',
      label: {
        en: 'Similarity & distance',
        'zh-TW': '相似度與距離',
        'zh-HK': '相似度與距離',
        ja: '類似度・距離',
        ko: '유사도 및 거리',
        es: 'Similitud y distancia',
        fr: 'Similarité et distance',
        de: 'Ähnlichkeit & Distanz',
      },
      tools: ['levenshtein', 'hamming-distance', 'jaccard-similarity', 'string-similarity'],
    },
  ],
  text: [
    {
      key: 'transform',
      label: {
        en: 'Transform & format',
        'zh-TW': '轉換與格式化',
        'zh-HK': '轉換與格式化',
        ja: '変換・整形',
        ko: '변환 및 서식',
        es: 'Transformar y formatear',
        fr: 'Transformer et formater',
        de: 'Umwandeln & Formatieren',
      },
      tools: [
        'text-case',
        'slugify',
        'reverse-text',
        'reverse-words',
        'repeat-text',
        'text-wrap',
        'truncate-text',
        'pad-text',
        'number-lines',
        'line-prefix',
      ],
    },
    {
      key: 'lines',
      label: {
        en: 'Lines',
        'zh-TW': '行處理',
        'zh-HK': '行處理',
        ja: '行の操作',
        ko: '줄 처리',
        es: 'Líneas',
        fr: 'Lignes',
        de: 'Zeilen',
      },
      tools: [
        'line-dedupe',
        'sort-lines',
        'shuffle-lines',
        'trim-lines',
        'remove-empty-lines',
        'join-lines',
        'split-text',
      ],
    },
    {
      key: 'clean',
      label: {
        en: 'Clean & normalize',
        'zh-TW': '清理與正規化',
        'zh-HK': '清理與正規化',
        ja: 'クリーン・正規化',
        ko: '정리 및 정규화',
        es: 'Limpiar y normalizar',
        fr: 'Nettoyer et normaliser',
        de: 'Bereinigen & Normalisieren',
      },
      tools: [
        'text-normalize',
        'remove-diacritics',
        'zero-width-clean',
        'find-replace',
        'mask-emails',
        'fullwidth',
      ],
    },
    {
      key: 'analyze',
      label: {
        en: 'Analyze & compare',
        'zh-TW': '分析與比較',
        'zh-HK': '分析與比較',
        ja: '分析・比較',
        ko: '분석 및 비교',
        es: 'Analizar y comparar',
        fr: 'Analyser et comparer',
        de: 'Analysieren & Vergleichen',
      },
      tools: [
        'text-count',
        'word-frequency',
        'char-frequency',
        'palindrome-check',
        'text-diff',
        'soundex',
        'extract-numbers',
        'extract-urls',
      ],
    },
    {
      key: 'cipher',
      label: {
        en: 'Ciphers & codes',
        'zh-TW': '密碼與編碼',
        'zh-HK': '密碼與編碼',
        ja: '暗号・コード',
        ko: '암호 및 코드',
        es: 'Cifrados y códigos',
        fr: 'Chiffrements et codes',
        de: 'Chiffren & Codes',
      },
      tools: ['rot13', 'rot47', 'caesar-cipher', 'atbash-cipher', 'morse-code'],
    },
    {
      key: 'cjk',
      label: {
        en: 'CJK & international',
        'zh-TW': '中日韓與國際化',
        'zh-HK': '中日韓與國際化',
        ja: 'CJK・多言語',
        ko: 'CJK 및 국제화',
        es: 'CJK e internacional',
        fr: 'CJK et international',
        de: 'CJK & International',
      },
      tools: ['cjk-convert', 'jp-romaji'],
    },
  ],
  convert: [
    {
      key: 'units',
      label: {
        en: 'Units & measurements',
        'zh-TW': '單位與度量',
        'zh-HK': '單位與度量',
        ja: '単位・計量',
        ko: '단위 및 측정',
        es: 'Unidades y medidas',
        fr: 'Unités et mesures',
        de: 'Einheiten & Maße',
      },
      tools: [
        'unit-convert',
        'length-convert',
        'area-convert',
        'volume-convert',
        'mass-convert',
        'temperature-convert',
        'speed-convert',
        'pressure-convert',
        'energy-convert',
        'power-convert',
        'frequency-convert',
        'angle-convert',
        'cooking-convert',
      ],
    },
    {
      key: 'data',
      label: {
        en: 'Data & currency',
        'zh-TW': '資料與貨幣',
        'zh-HK': '資料與貨幣',
        ja: 'データ・通貨',
        ko: '데이터 및 통화',
        es: 'Datos y moneda',
        fr: 'Données et devises',
        de: 'Daten & Währung',
      },
      tools: ['data-size', 'currency-convert'],
    },
    {
      key: 'docs',
      label: {
        en: 'Files & documents',
        'zh-TW': '檔案與文件',
        'zh-HK': '檔案與文件',
        ja: 'ファイル・ドキュメント',
        ko: '파일 및 문서',
        es: 'Archivos y documentos',
        fr: 'Fichiers et documents',
        de: 'Dateien & Dokumente',
      },
      tools: [
        'csv-excel',
        'video-convert',
        'audio-extract',
        'docx-to-pdf',
        'pptx-to-pdf',
        'pdf-to-word',
      ],
    },
  ],
  generator: [
    {
      key: 'codes',
      label: {
        en: 'Codes & scanning',
        'zh-TW': '條碼與掃描',
        'zh-HK': '條碼與掃描',
        ja: 'コード・スキャン',
        ko: '코드 및 스캔',
        es: 'Códigos y escaneo',
        fr: 'Codes et numérisation',
        de: 'Codes & Scannen',
      },
      tools: ['qr-generate', 'qr-batch', 'qr-scan', 'barcode', 'favicon'],
    },
    {
      key: 'secrets',
      label: {
        en: 'Secrets & IDs',
        'zh-TW': '密鑰與識別碼',
        'zh-HK': '密鑰與識別碼',
        ja: 'シークレット・ID',
        ko: '시크릿 및 ID',
        es: 'Secretos e identificadores',
        fr: 'Secrets et identifiants',
        de: 'Geheimnisse & IDs',
      },
      tools: ['password', 'uuid', 'nanoid', 'totp', 'random-string'],
    },
    {
      key: 'misc',
      label: {
        en: 'Text & math',
        'zh-TW': '文字與數學',
        'zh-HK': '文字與數學',
        ja: 'テキスト・計算',
        ko: '텍스트 및 수학',
        es: 'Texto y matemáticas',
        fr: 'Texte et mathématiques',
        de: 'Text & Mathe',
      },
      tools: ['lorem-ipsum', 'gcd-lcm'],
    },
  ],
  finance: [
    {
      key: 'everyday',
      label: {
        en: 'Everyday money',
        'zh-TW': '日常理財',
        'zh-HK': '日常理財',
        ja: '日常のお金',
        ko: '일상 자금',
        es: 'Dinero cotidiano',
        fr: 'Argent au quotidien',
        de: 'Alltagsfinanzen',
      },
      tools: ['loan-calculator', 'savings', 'subscription-tracker', 'sales-tax', 'tw-invoice'],
    },
    {
      key: 'payroll',
      label: {
        en: 'Payroll & tax',
        'zh-TW': '薪資與稅務',
        'zh-HK': '薪酬與稅務',
        ja: '給与・税金',
        ko: '급여 및 세금',
        es: 'Nómina e impuestos',
        fr: 'Paie et impôts',
        de: 'Gehalt & Steuern',
      },
      tools: ['paycheck-calc', 'hk-salaries-tax', 'hk-severance', 'jp-takehome', 'jp-furusato'],
    },
  ],
};

/** Localized sub-group label (English required; falls back to English). */
export function subLabel(label: L10n, lang: Lang): string {
  return label[lang] ?? label.en;
}

/**
 * Resolve a category's sub-groups against the tool ids actually present
 * (already market/category filtered). Empty groups are dropped; any present
 * tool not claimed by a group lands in a trailing "More" group. Returns an
 * empty array when the category has no sub-grouping (caller renders flat).
 */
export function subGroupsFor(category: string, available: readonly string[]): ResolvedSubGroup[] {
  const groups = SUBCATEGORIES[category as ToolCategory];
  if (!groups) return [];
  const availSet = new Set(available);
  const claimed = new Set<string>();
  const out: ResolvedSubGroup[] = [];
  for (const g of groups) {
    const tools = g.tools.filter((id) => availSet.has(id));
    tools.forEach((id) => claimed.add(id));
    if (tools.length > 0) out.push({ key: g.key, label: g.label, tools });
  }
  const leftovers = available.filter((id) => !claimed.has(id));
  if (leftovers.length > 0)
    out.push({
      key: 'more',
      label: {
        en: 'More',
        'zh-TW': '更多',
        'zh-HK': '更多',
        ja: 'その他',
        ko: '기타',
        es: 'Más',
        fr: 'Plus',
        de: 'Mehr',
      },
      tools: leftovers,
    });
  return out;
}
