import type { ToolCategory } from '@zii/registry';
import type { Lang } from './i18n';
import type { L10n } from './catalog';

/** Display order for category sections and filter chips. */
export const CATEGORY_ORDER: readonly ToolCategory[] = [
  'pdf',
  'image',
  'text',
  'dev',
  'calc',
  'finance',
  'convert',
  'datetime',
  'generator',
  'id',
  'file',
  'daily',
];

/** Localized display names per category (English required, others fall back to en). */
const CATEGORY_LABELS: Record<string, L10n> = {
  pdf: { en: 'PDF' },
  image: {
    en: 'Image',
    'zh-TW': '影像',
    'zh-HK': '圖片',
    ja: '画像',
    ko: '이미지',
    es: 'Imagen',
    fr: 'Image',
    de: 'Bild',
  },
  text: {
    en: 'Text',
    'zh-TW': '文字',
    'zh-HK': '文字',
    ja: 'テキスト',
    ko: '텍스트',
    es: 'Texto',
    fr: 'Texte',
    de: 'Text',
  },
  dev: {
    en: 'Developer',
    'zh-TW': '開發者',
    'zh-HK': '開發者',
    ja: '開発者',
    ko: '개발자',
    es: 'Desarrollo',
    fr: 'Développeur',
    de: 'Entwickler',
  },
  calc: {
    en: 'Calculators',
    'zh-TW': '計算機',
    'zh-HK': '計算機',
    ja: '計算ツール',
    ko: '계산기',
    es: 'Calculadoras',
    fr: 'Calculatrices',
    de: 'Rechner',
  },
  finance: {
    en: 'Finance',
    'zh-TW': '財務',
    'zh-HK': '財務',
    ja: '金融',
    ko: '금융',
    es: 'Finanzas',
    fr: 'Finance',
    de: 'Finanzen',
  },
  convert: {
    en: 'Converters',
    'zh-TW': '轉換工具',
    'zh-HK': '轉換工具',
    ja: '変換ツール',
    ko: '변환기',
    es: 'Conversores',
    fr: 'Convertisseurs',
    de: 'Konverter',
  },
  datetime: {
    en: 'Date & time',
    'zh-TW': '日期時間',
    'zh-HK': '日期時間',
    ja: '日付・時刻',
    ko: '날짜·시간',
    es: 'Fecha y hora',
    fr: 'Date et heure',
    de: 'Datum & Uhrzeit',
  },
  generator: {
    en: 'Generators',
    'zh-TW': '產生器',
    'zh-HK': '產生器',
    ja: '生成ツール',
    ko: '생성기',
    es: 'Generadores',
    fr: 'Générateurs',
    de: 'Generatoren',
  },
  id: {
    en: 'Identity',
    'zh-TW': '證件',
    'zh-HK': '證件',
    ja: 'ID',
    ko: '신원',
    es: 'Identidad',
    fr: 'Identité',
    de: 'Identität',
  },
  file: {
    en: 'Files',
    'zh-TW': '檔案',
    'zh-HK': '檔案',
    ja: 'ファイル',
    ko: '파일',
    es: 'Archivos',
    fr: 'Fichiers',
    de: 'Dateien',
  },
  daily: {
    en: 'Everyday',
    'zh-TW': '日常',
    'zh-HK': '日常',
    ja: '日常',
    ko: '일상',
    es: 'Diario',
    fr: 'Quotidien',
    de: 'Alltag',
  },
};

const CATEGORY_DESCRIPTIONS: Record<string, L10n> = {
  pdf: {
    en: 'Merge, split, compress, rotate, watermark, organize, and convert PDF files in the browser.',
    'zh-TW': '在瀏覽器中合併、分割、壓縮、旋轉、浮水印、整理與轉換 PDF 檔案。',
    'zh-HK': '在瀏覽器中合併、分割、壓縮、旋轉、浮水印、整理與轉換 PDF 檔案。',
    ja: 'PDF の結合・分割・圧縮・回転・透かし・並べ替え・変換をブラウザ内で。',
    ko: '브라우저에서 PDF 병합, 분할, 압축, 회전, 워터마크, 정리, 변환을 하세요.',
    es: 'Combina, divide, comprime, rota, marca, organiza y convierte PDF en el navegador.',
    fr: 'Fusionnez, découpez, compressez, pivotez, filigranez, organisez et convertissez des PDF dans le navigateur.',
    de: 'PDFs im Browser zusammenführen, teilen, komprimieren, drehen, wasserzeichen, sortieren und konvertieren.',
  },
  image: {
    en: 'Convert, compress, resize, crop, clean metadata, OCR, and edit images locally in the browser.',
    'zh-TW': '在瀏覽器本機轉換、壓縮、調整大小、裁切、清除中繼資料、OCR 與編輯圖片。',
    'zh-HK': '在瀏覽器本機轉換、壓縮、調整大小、裁切、清除中繼資料、OCR 與編輯圖片。',
    ja: '画像の変換・圧縮・リサイズ・切り抜き・メタデータ削除・OCR をすべて端末内で。',
    ko: '브라우저에서 이미지 변환, 압축, 크기 조정, 자르기, 메타데이터 제거, OCR을 하세요.',
    es: 'Convierte, comprime, redimensiona, recorta, limpia metadatos, OCR y edita imágenes en el navegador.',
    fr: 'Convertissez, compressez, redimensionnez, recadrez, nettoyez les métadonnées, OCR et éditez des images localement.',
    de: 'Bilder lokal im Browser konvertieren, komprimieren, skalieren, zuschneiden, Metadaten entfernen und OCR nutzen.',
  },
  text: {
    en: 'Count, clean, transform, compare, encode, decode, and normalize text without uploading it.',
    'zh-TW': '計數、清理、轉換、比較、編碼、解碼與正規化文字——無需上傳。',
    'zh-HK': '計數、清理、轉換、比較、編碼、解碼與正規化文字——無需上傳。',
    ja: 'テキストのカウント・整形・変換・比較・エンコード・正規化をアップロードなしで。',
    ko: '업로드 없이 텍스트 세기, 정리, 변환, 비교, 인코딩, 디코딩, 정규화를 하세요.',
    es: 'Cuenta, limpia, transforma, compara, codifica, decodifica y normaliza texto sin subirlo.',
    fr: 'Comptez, nettoyez, transformez, comparez, encodez, décodez et normalisez du texte sans l’envoyer.',
    de: 'Text zählen, bereinigen, umwandeln, vergleichen, kodieren, dekodieren und normalisieren — ohne Upload.',
  },
  dev: {
    en: 'Format, convert, encode, decode, inspect, and generate developer data directly in the browser.',
    'zh-TW': '在瀏覽器中直接格式化、轉換、編碼、解碼、檢查與產生開發者資料。',
    'zh-HK': '在瀏覽器中直接格式化、轉換、編碼、解碼、檢查與產生開發者資料。',
    ja: '開発者向けのデータを整形・変換・エンコード・検査・生成、すべてブラウザで。',
    ko: '브라우저에서 개발자 데이터를 포맷, 변환, 인코딩, 디코딩, 검사, 생성하세요.',
    es: 'Formatea, convierte, codifica, decodifica, inspecciona y genera datos de desarrollador en el navegador.',
    fr: 'Formatez, convertissez, encodez, décodez, inspectez et générez des données développeur dans le navigateur.',
    de: 'Entwicklerdaten direkt im Browser formatieren, konvertieren, kodieren, dekodieren, prüfen und erzeugen.',
  },
  calc: {
    en: 'Run practical everyday calculators for percentages, discounts, health, math, finance, and more.',
    'zh-TW': '實用日常計算機：百分比、折扣、健康、數學、財務等。',
    'zh-HK': '實用日常計算機：百分比、折扣、健康、數學、財務等。',
    ja: '割合・割引・健康・数学・金融など、日常の計算ツールをまとめて。',
    ko: '비율, 할인, 건강, 수학, 금융 등 일상 계산기를 한곳에서 사용하세요.',
    es: 'Calculadoras prácticas: porcentajes, descuentos, salud, matemáticas, finanzas y más.',
    fr: 'Calculateurs du quotidien : pourcentages, remises, santé, maths, finance et plus.',
    de: 'Alltagsrechner für Prozente, Rabatte, Gesundheit, Mathematik, Finanzen und mehr.',
  },
  finance: {
    en: 'Calculate prices, savings, tax, loans, currency conversions, and payroll-related figures.',
    'zh-TW': '計算價格、儲蓄、稅金、貸款、匯率換算與薪資相關數字。',
    'zh-HK': '計算價格、儲蓄、稅金、貸款、匯率換算與薪資相關數字。',
    ja: '価格・貯蓄・税金・ローン・為替・給与関連の金額を計算。',
    ko: '가격, 저축, 세금, 대출, 환율, 급여 관련 금액을 계산하세요.',
    es: 'Calcula precios, ahorros, impuestos, préstamos, divisas y cifras de nómina.',
    fr: 'Calculez prix, épargne, taxes, prêts, devises et montants liés à la paie.',
    de: 'Preise, Ersparnisse, Steuern, Kredite, Währungsumrechnung und Gehaltswerte berechnen.',
  },
  convert: {
    en: 'Convert units, files, media, office documents, dates, data formats, and measurements privately.',
    'zh-TW': '私密轉換單位、檔案、媒體、辦公文件、日期、資料格式與度量。',
    'zh-HK': '私密轉換單位、檔案、媒體、辦公文件、日期、資料格式與度量。',
    ja: '単位・ファイル・メディア・文書・日付・データ形式・計量をプライベートに変換。',
    ko: '단위, 파일, 미디어, 문서, 날짜, 데이터 형식, 측정을 비공개로 변환하세요.',
    es: 'Convierte unidades, archivos, medios, documentos, fechas, formatos y medidas de forma privada.',
    fr: 'Convertissez unités, fichiers, médias, documents, dates, formats et mesures en privé.',
    de: 'Einheiten, Dateien, Medien, Dokumente, Daten, Formate und Maße privat konvertieren.',
  },
  datetime: {
    en: 'Work with dates, times, durations, time zones, calendars, holidays, eras, and lunar dates.',
    'zh-TW': '處理日期、時間、時長、時區、日曆、假日、年號與農曆。',
    'zh-HK': '處理日期、時間、時長、時區、日曆、假日、年號與農曆。',
    ja: '日付・時刻・経過時間・タイムゾーン・カレンダー・祝日・和暦・旧暦を扱う。',
    ko: '날짜, 시간, 기간, 시간대, 달력, 공휴일, 연호, 음력을 다루세요.',
    es: 'Trabaja con fechas, horas, duraciones, zonas horarias, calendarios, festivos, eras y lunares.',
    fr: 'Travaillez dates, heures, durées, fuseaux, calendriers, jours fériés, ères et dates lunaires.',
    de: 'Mit Datum, Zeit, Dauer, Zeitzonen, Kalendern, Feiertagen, Ären und Mondkalender arbeiten.',
  },
  generator: {
    en: 'Generate QR codes, passwords, IDs, placeholder text, barcodes, and other useful assets.',
    'zh-TW': '產生 QR 碼、密碼、識別碼、佔位文字、條碼與其他實用素材。',
    'zh-HK': '產生 QR 碼、密碼、識別碼、佔位文字、條碼與其他實用素材。',
    ja: 'QR コード・パスワード・ID・ダミーテキスト・バーコードなどを生成。',
    ko: 'QR 코드, 비밀번호, ID, 더미 텍스트, 바코드 등 유용한 항목을 생성하세요.',
    es: 'Genera códigos QR, contraseñas, IDs, texto de relleno, códigos de barras y más.',
    fr: 'Générez QR codes, mots de passe, IDs, texte factice, codes-barres et autres actifs utiles.',
    de: 'QR-Codes, Passwörter, IDs, Platzhaltertext, Barcodes und weitere nützliche Assets erzeugen.',
  },
  id: {
    en: 'Validate regional identity numbers, postal codes, phone numbers, bank formats, and business IDs.',
    'zh-TW': '驗證各地身分證號、郵遞區號、電話、銀行格式與商業登記號碼。',
    'zh-HK': '驗證各地身份證號碼、郵政編碼、電話、銀行格式與商業登記號碼。',
    ja: '各地域の身分証番号・郵便番号・電話番号・銀行番号・事業者番号を検証。',
    ko: '지역별 신분증 번호, 우편번호, 전화번호, 은행 형식, 사업자 번호를 검증하세요.',
    es: 'Valida números de identidad, códigos postales, teléfonos, formatos bancarios e IDs empresariales.',
    fr: 'Validez numéros d’identité, codes postaux, téléphones, formats bancaires et IDs d’entreprise.',
    de: 'Regionale Ausweisnummern, Postleitzahlen, Telefonnummern, Bankformate und Firmen-IDs prüfen.',
  },
  file: {
    en: 'Create, inspect, extract, and convert files and archives in a browser-first utility workspace.',
    'zh-TW': '在瀏覽器優先的工作區建立、檢查、解壓與轉換檔案與壓縮包。',
    'zh-HK': '在瀏覽器優先的工作區建立、檢查、解壓與轉換檔案與壓縮包。',
    ja: 'ファイルやアーカイブの作成・検査・展開・変換をブラウザ完結で。',
    ko: '브라우저에서 파일과 압축본을 만들고, 검사하고, 추출하고, 변환하세요.',
    es: 'Crea, inspecciona, extrae y convierte archivos y archivos comprimidos en el navegador.',
    fr: 'Créez, inspectez, extrayez et convertissez fichiers et archives dans un espace navigateur.',
    de: 'Dateien und Archive browserseitig erstellen, prüfen, entpacken und konvertieren.',
  },
  daily: {
    en: 'Handle everyday chores such as reminders, formatting, planning, quick checks, and small tasks.',
    'zh-TW': '處理日常瑣事：提醒、格式整理、規劃、快速檢查與小任務。',
    'zh-HK': '處理日常瑣事：提醒、格式整理、規劃、快速檢查與小任務。',
    ja: 'リマインダー・書式整え・計画・ちょっとした確認など、日常の作業をこなす。',
    ko: '알림, 서식 정리, 계획, 빠른 확인, 작은 작업 등 일상 일을 처리하세요.',
    es: 'Resuelve tareas diarias: recordatorios, formato, planificación, comprobaciones rápidas y más.',
    fr: 'Gérez le quotidien : rappels, mise en forme, planification, vérifications rapides et petites tâches.',
    de: 'Alltagsaufgaben erledigen: Erinnerungen, Formatierung, Planung, schnelle Checks und Kleinigkeiten.',
  },
};

const CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  pdf: ['pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf converter'],
  image: ['image tools', 'image converter', 'compress image', 'resize image', 'ocr'],
  text: ['text tools', 'word counter', 'case converter', 'text cleaner', 'text formatter'],
  dev: ['developer tools', 'json tools', 'csv converter', 'base64', 'hash generator'],
  calc: ['calculator', 'percentage calculator', 'scientific calculator', 'bmi calculator'],
  finance: ['finance calculator', 'loan calculator', 'sales tax', 'currency converter'],
  convert: ['unit converter', 'file converter', 'measurement converter', 'media converter'],
  datetime: ['date calculator', 'time zone converter', 'calendar tools', 'timestamp converter'],
  generator: ['generator tools', 'qr code generator', 'password generator', 'uuid generator'],
  id: ['id validator', 'postal code checker', 'phone validator', 'business id validator'],
  file: ['file tools', 'zip tools', 'archive tools', 'file converter'],
  daily: ['everyday tools', 'daily utilities', 'browser utilities', 'offline tools'],
};

/** Localized label for a category, falling back to English then the raw key. */
export function categoryLabel(category: string, lang: Lang): string {
  const map = CATEGORY_LABELS[category];
  if (!map) return category;
  return map[lang] ?? map.en;
}

/** Search-oriented description for category landing pages and LLM indexes. */
export function categoryDescription(category: string, lang: Lang = 'en'): string {
  const map = CATEGORY_DESCRIPTIONS[category];
  if (!map) return `${category} tools for everyday browser workflows.`;
  return map[lang] ?? map.en;
}

/** Search-oriented keyword set for category landing pages. */
export function categoryKeywords(category: string): readonly string[] {
  return CATEGORY_KEYWORDS[category] ?? [category, `${category} tools`, 'browser tools'];
}

/**
 * Given a set of tools, return the categories that actually have tools,
 * in display order.
 */
export function presentCategories(categories: Iterable<string>): ToolCategory[] {
  const have = new Set(categories);
  return CATEGORY_ORDER.filter((c) => have.has(c));
}
