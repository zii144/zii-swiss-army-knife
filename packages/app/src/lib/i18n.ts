// Tiny in-house i18n scaffold — intentionally no i18next dependency.

export type Lang = 'en' | 'zh-TW' | 'zh-HK' | 'ja' | 'ko' | 'es' | 'fr' | 'de';

export interface Dict {
  title: string;
  searchPlaceholder: string;
  marketLabel: string;
  darkMode: string;
  language: string;
  noResults: string;
  offline: string;
  back: string;
  comingSoon: string;
  loading: string;
  loadingEngine: string;
  errorTitle: string;
  errorBody: string;
  errorRetry: string;
  // Brand + navigation
  brand: string;
  navHome: string;
  navTools: string;
  navAbout: string;
  getStarted: string;
  // Hero
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  viewTools: string;
  viewAll: string;
  rated: string;
  // Catalog
  catalogKicker: string;
  catalogTitle: string;
  catalogSubtitle: string;
  // Footer
  footerLanguages: string;
  // Categories
  allCategories: string;
}

export const DICTIONARY: Readonly<Record<Lang, Dict>> = {
  en: {
    title: 'Zii — Swiss Army Knife',
    searchPlaceholder: 'Search tools…',
    marketLabel: 'Region',
    darkMode: 'Dark',
    language: 'Language',
    noResults: 'No tools match your filters.',
    offline: 'offline',
    back: 'Back to tools',
    comingSoon: "This tool's interface isn't built yet.",
    loading: 'Loading…',
    loadingEngine: 'Loading — the first use fetches a larger engine, one moment…',
    errorTitle: 'This tool ran into a problem',
    errorBody: 'Something went wrong while loading or running this tool. The rest of the app is unaffected.',
    errorRetry: 'Try again',
    brand: 'Zii',
    navHome: 'Home',
    navTools: 'Tools',
    navAbout: 'About',
    getStarted: 'Get started',
    heroKicker: 'Everyday utilities, one place',
    heroTitleA: 'Every tool you need,',
    heroTitleB: 'right in your browser',
    heroSubtitle:
      'Convert files, crunch numbers, and clean up text — fast, private, and offline. Nothing ever leaves your device.',
    viewTools: 'View tools',
    viewAll: 'View all',
    rated: 'Private by design · runs fully on-device',
    catalogKicker: 'The toolbox',
    catalogTitle: 'Pick a tool',
    catalogSubtitle: 'Everything runs locally — no uploads, no accounts.',
    footerLanguages: 'Languages',
    allCategories: 'All',
  },
  'zh-TW': {
    title: 'Zii — 瑞士刀工具箱',
    searchPlaceholder: '搜尋工具…',
    marketLabel: '地區',
    darkMode: '深色',
    language: '語言',
    noResults: '沒有符合條件的工具。',
    offline: '離線',
    back: '返回工具列表',
    comingSoon: '此工具的介面尚未完成。',
    loading: '載入中…',
    loadingEngine: '載入中——首次使用會下載較大的引擎，請稍候…',
    errorTitle: '此工具發生問題',
    errorBody: '載入或執行此工具時發生錯誤，其餘功能不受影響。',
    errorRetry: '重試',
    brand: 'Zii',
    navHome: '首頁',
    navTools: '工具',
    navAbout: '關於',
    getStarted: '開始使用',
    heroKicker: '日常工具，一站搞定',
    heroTitleA: '你需要的每個工具，',
    heroTitleB: '都在瀏覽器裡',
    heroSubtitle: '轉檔、計算、整理文字 — 快速、隱私、可離線。資料完全不離開你的裝置。',
    viewTools: '瀏覽工具',
    viewAll: '查看全部',
    rated: '隱私優先 · 全程於裝置上運算',
    catalogKicker: '工具箱',
    catalogTitle: '選擇工具',
    catalogSubtitle: '全部在本機執行 — 不上傳、不需帳號。',
    footerLanguages: '語言',
    allCategories: '全部',
  },
  'zh-HK': {
    title: 'Zii — 瑞士刀工具箱',
    searchPlaceholder: '搜尋工具…',
    marketLabel: '地區',
    darkMode: '深色',
    language: '語言',
    noResults: '沒有符合條件的工具。',
    offline: '離線',
    back: '返回工具列表',
    comingSoon: '此工具的介面尚未完成。',
    loading: '載入中…',
    loadingEngine: '載入中——首次使用會下載較大的引擎，請稍候…',
    errorTitle: '此工具發生問題',
    errorBody: '載入或執行此工具時發生錯誤，其餘功能不受影響。',
    errorRetry: '重試',
    brand: 'Zii',
    navHome: '主頁',
    navTools: '工具',
    navAbout: '關於',
    getStarted: '開始使用',
    heroKicker: '日常工具，一站搞掂',
    heroTitleA: '你需要嘅每個工具，',
    heroTitleB: '都喺瀏覽器裡',
    heroSubtitle: '轉檔、計算、整理文字 — 快速、私隱、可離線。資料完全唔離開你嘅裝置。',
    viewTools: '瀏覽工具',
    viewAll: '查看全部',
    rated: '私隱優先 · 全程喺裝置上運算',
    catalogKicker: '工具箱',
    catalogTitle: '選擇工具',
    catalogSubtitle: '全部喺本機執行 — 唔上傳、唔需帳號。',
    footerLanguages: '語言',
    allCategories: '全部',
  },
  ja: {
    title: 'Zii — 万能ツールボックス',
    searchPlaceholder: 'ツールを検索…',
    marketLabel: '地域',
    darkMode: 'ダーク',
    language: '言語',
    noResults: '条件に一致するツールがありません。',
    offline: 'オフライン',
    back: 'ツール一覧へ戻る',
    comingSoon: 'このツールの画面はまだ準備中です。',
    loading: '読み込み中…',
    loadingEngine: '読み込み中——初回はやや大きなエンジンを取得します。少々お待ちください…',
    errorTitle: 'このツールで問題が発生しました',
    errorBody: 'ツールの読み込みまたは実行中にエラーが発生しました。他の機能には影響ありません。',
    errorRetry: '再試行',
    brand: 'Zii',
    navHome: 'ホーム',
    navTools: 'ツール',
    navAbout: '概要',
    getStarted: 'はじめる',
    heroKicker: '毎日の便利ツールを一か所に',
    heroTitleA: '必要なツールが、',
    heroTitleB: 'すべてブラウザに',
    heroSubtitle:
      'ファイル変換、計算、テキスト整形 — 高速・プライベート・オフライン。データが端末から出ることはありません。',
    viewTools: 'ツールを見る',
    viewAll: 'すべて見る',
    rated: 'プライバシー重視 · すべて端末上で動作',
    catalogKicker: 'ツールボックス',
    catalogTitle: 'ツールを選ぶ',
    catalogSubtitle: 'すべて端末内で動作 — アップロード不要、アカウント不要。',
    footerLanguages: '言語',
    allCategories: 'すべて',
  },
  ko: {
    title: 'Zii — 만능 도구 상자',
    searchPlaceholder: '도구 검색…',
    marketLabel: '지역',
    darkMode: '다크',
    language: '언어',
    noResults: '조건에 맞는 도구가 없습니다.',
    offline: '오프라인',
    back: '도구 목록으로',
    comingSoon: '이 도구의 화면은 아직 준비 중입니다.',
    loading: '불러오는 중…',
    loadingEngine: '불러오는 중——처음 사용할 때 더 큰 엔진을 내려받습니다. 잠시만 기다려 주세요…',
    errorTitle: '이 도구에 문제가 발생했습니다',
    errorBody: '도구를 불러오거나 실행하는 중 오류가 발생했습니다. 나머지 기능은 영향을 받지 않습니다.',
    errorRetry: '다시 시도',
    brand: 'Zii',
    navHome: '홈',
    navTools: '도구',
    navAbout: '소개',
    getStarted: '시작하기',
    heroKicker: '매일 쓰는 도구를 한곳에',
    heroTitleA: '필요한 모든 도구를,',
    heroTitleB: '브라우저에서 바로',
    heroSubtitle:
      '파일 변환, 계산, 텍스트 정리 — 빠르고 안전하며 오프라인. 데이터는 기기를 벗어나지 않습니다.',
    viewTools: '도구 보기',
    viewAll: '전체 보기',
    rated: '개인정보 우선 · 전부 기기에서 실행',
    catalogKicker: '도구 상자',
    catalogTitle: '도구 선택',
    catalogSubtitle: '모두 기기에서 실행 — 업로드 없음, 계정 없음.',
    footerLanguages: '언어',
    allCategories: '전체',
  },
  es: {
    title: 'Zii — Navaja suiza de herramientas',
    searchPlaceholder: 'Buscar herramientas…',
    marketLabel: 'Región',
    darkMode: 'Oscuro',
    language: 'Idioma',
    noResults: 'Ninguna herramienta coincide con tus filtros.',
    offline: 'sin conexión',
    back: 'Volver a herramientas',
    comingSoon: 'La interfaz de esta herramienta aún no está lista.',
    loading: 'Cargando…',
    loadingEngine: 'Cargando: el primer uso descarga un motor más grande, un momento…',
    errorTitle: 'Esta herramienta tuvo un problema',
    errorBody: 'Algo salió mal al cargar o ejecutar esta herramienta. El resto de la app no se ve afectada.',
    errorRetry: 'Reintentar',
    brand: 'Zii',
    navHome: 'Inicio',
    navTools: 'Herramientas',
    navAbout: 'Acerca de',
    getStarted: 'Empezar',
    heroKicker: 'Utilidades diarias, en un solo lugar',
    heroTitleA: 'Todas las herramientas que necesitas,',
    heroTitleB: 'en tu navegador',
    heroSubtitle:
      'Convierte archivos, haz cálculos y limpia texto — rápido, privado y sin conexión. Nada sale de tu dispositivo.',
    viewTools: 'Ver herramientas',
    viewAll: 'Ver todas',
    rated: 'Privado por diseño · funciona 100 % en tu dispositivo',
    catalogKicker: 'La caja de herramientas',
    catalogTitle: 'Elige una herramienta',
    catalogSubtitle: 'Todo se ejecuta localmente — sin subir archivos, sin cuentas.',
    footerLanguages: 'Idiomas',
    allCategories: 'Todas',
  },
  fr: {
    title: 'Zii — Boîte à outils tout-en-un',
    searchPlaceholder: 'Rechercher des outils…',
    marketLabel: 'Région',
    darkMode: 'Sombre',
    language: 'Langue',
    noResults: 'Aucun outil ne correspond à vos filtres.',
    offline: 'hors ligne',
    back: 'Retour aux outils',
    comingSoon: "L'interface de cet outil n'est pas encore prête.",
    loading: 'Chargement…',
    loadingEngine: 'Chargement — la première utilisation télécharge un moteur plus lourd, un instant…',
    errorTitle: 'Cet outil a rencontré un problème',
    errorBody: "Une erreur s'est produite lors du chargement ou de l'exécution de cet outil. Le reste de l'application n'est pas affecté.",
    errorRetry: 'Réessayer',
    brand: 'Zii',
    navHome: 'Accueil',
    navTools: 'Outils',
    navAbout: 'À propos',
    getStarted: 'Commencer',
    heroKicker: 'Les outils du quotidien, au même endroit',
    heroTitleA: 'Tous les outils dont vous avez besoin,',
    heroTitleB: 'directement dans votre navigateur',
    heroSubtitle:
      'Convertissez des fichiers, calculez et nettoyez du texte — rapide, privé et hors ligne. Rien ne quitte votre appareil.',
    viewTools: 'Voir les outils',
    viewAll: 'Tout voir',
    rated: 'Confidentiel par conception · 100 % sur votre appareil',
    catalogKicker: 'La boîte à outils',
    catalogTitle: 'Choisissez un outil',
    catalogSubtitle: 'Tout fonctionne en local — sans téléversement, sans compte.',
    footerLanguages: 'Langues',
    allCategories: 'Toutes',
  },
  de: {
    title: 'Zii — Das Schweizer Taschenmesser',
    searchPlaceholder: 'Werkzeuge suchen…',
    marketLabel: 'Region',
    darkMode: 'Dunkel',
    language: 'Sprache',
    noResults: 'Keine Werkzeuge passen zu deinen Filtern.',
    offline: 'offline',
    back: 'Zurück zu den Werkzeugen',
    comingSoon: 'Die Oberfläche dieses Werkzeugs ist noch nicht fertig.',
    loading: 'Wird geladen…',
    loadingEngine: 'Wird geladen – die erste Nutzung lädt ein größeres Modul, einen Moment…',
    errorTitle: 'Bei diesem Tool ist ein Problem aufgetreten',
    errorBody: 'Beim Laden oder Ausführen dieses Tools ist ein Fehler aufgetreten. Der Rest der App ist nicht betroffen.',
    errorRetry: 'Erneut versuchen',
    brand: 'Zii',
    navHome: 'Start',
    navTools: 'Werkzeuge',
    navAbout: 'Über',
    getStarted: 'Loslegen',
    heroKicker: 'Alltagswerkzeuge an einem Ort',
    heroTitleA: 'Jedes Werkzeug, das du brauchst,',
    heroTitleB: 'direkt im Browser',
    heroSubtitle:
      'Dateien umwandeln, rechnen und Text aufräumen — schnell, privat und offline. Nichts verlässt dein Gerät.',
    viewTools: 'Werkzeuge ansehen',
    viewAll: 'Alle ansehen',
    rated: 'Privat by Design · läuft komplett auf deinem Gerät',
    catalogKicker: 'Der Werkzeugkasten',
    catalogTitle: 'Wähle ein Werkzeug',
    catalogSubtitle: 'Alles läuft lokal — kein Upload, kein Konto.',
    footerLanguages: 'Sprachen',
    allCategories: 'Alle',
  },
};

export const LANGS: readonly Lang[] = [
  'en',
  'zh-TW',
  'zh-HK',
  'ja',
  'ko',
  'es',
  'fr',
  'de',
] as const;

export const LANG_LABELS: Readonly<Record<Lang, string>> = {
  en: 'English',
  'zh-TW': '繁體中文（台灣）',
  'zh-HK': '繁體中文（香港）',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

/** BCP-47 / hreflang code for each app language (here they already match). */
export const HREFLANG: Readonly<Record<Lang, string>> = {
  en: 'en',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-HK',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  fr: 'fr',
  de: 'de',
};

/** Returns a typed translator bound to `lang`, falling back to English. */
export function useT(lang: Lang): (key: keyof Dict) => string {
  const dict = DICTIONARY[lang] ?? DICTIONARY.en;
  return (key) => dict[key];
}
