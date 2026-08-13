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
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  // Brand + navigation
  brand: string;
  navHome: string;
  navTools: string;
  navAbout: string;
  navPrivacy: string;
  navTerms: string;
  navLegal: string;
  getStarted: string;
  skipToContent: string;
  needsNetwork: string;
  uploadsWorker: string;
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
  footerLegal: string;
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
    errorBody:
      'Something went wrong while loading or running this tool. The rest of the app is unaffected.',
    errorRetry: 'Try again',
    notFoundTitle: 'Page not found',
    notFoundBody:
      'That address does not match any tool. It may have been renamed, or the link may be mistyped.',
    notFoundCta: 'Browse all tools',
    brand: 'Zii',
    navHome: 'Home',
    navTools: 'Tools',
    navAbout: 'About',
    navPrivacy: 'Privacy',
    navTerms: 'Terms',
    navLegal: 'Legal',
    getStarted: 'Get started',
    skipToContent: 'Skip to content',
    needsNetwork: 'needs network',
    uploadsWorker: 'uploads to worker',
    heroKicker: 'Everyday utilities, one place',
    heroTitleA: 'Every tool you need,',
    heroTitleB: 'right in your browser',
    heroSubtitle:
      'Convert files, crunch numbers, and clean up text — fast and private. Most tools run on-device; a few need a model or optional worker.',
    viewTools: 'View tools',
    viewAll: 'View all',
    rated: 'Private by design · most tools run on-device',
    catalogKicker: 'The toolbox',
    catalogTitle: 'Pick a tool',
    catalogSubtitle: 'Most tools run locally — no accounts. A few need a model or optional worker.',
    footerLanguages: 'Languages',
    footerLegal: 'Legal',
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
    notFoundTitle: '找不到頁面',
    notFoundBody: '這個網址沒有對應的工具，可能已更名，或連結有誤。',
    notFoundCta: '瀏覽所有工具',
    brand: 'Zii',
    navHome: '首頁',
    navTools: '工具',
    navAbout: '關於',
    navPrivacy: '隱私權',
    navTerms: '使用條款',
    navLegal: '法律資訊',
    getStarted: '開始使用',
    skipToContent: '跳到主要內容',
    needsNetwork: '需要網路',
    uploadsWorker: '會上傳至工作器',
    heroKicker: '日常工具，一站搞定',
    heroTitleA: '你需要的每個工具，',
    heroTitleB: '都在瀏覽器裡',
    heroSubtitle:
      '轉檔、計算、整理文字 — 快速且隱私。多數工具在裝置上執行；少數需模型或可選工作器。',
    viewTools: '瀏覽工具',
    viewAll: '查看全部',
    rated: '隱私優先 · 多數工具於裝置上運算',
    catalogKicker: '工具箱',
    catalogTitle: '選擇工具',
    catalogSubtitle: '多數工具在本機執行 — 不需帳號。少數需模型或可選工作器。',
    footerLanguages: '語言',
    footerLegal: '法律',
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
    notFoundTitle: '搵唔到呢一頁',
    notFoundBody: '呢個網址冇對應嘅工具，可能已改名，或者連結有錯。',
    notFoundCta: '瀏覽所有工具',
    brand: 'Zii',
    navHome: '主頁',
    navTools: '工具',
    navAbout: '關於',
    navPrivacy: '私隱',
    navTerms: '使用條款',
    navLegal: '法律資訊',
    getStarted: '開始使用',
    skipToContent: '跳到主要內容',
    needsNetwork: '需要網絡',
    uploadsWorker: '會上傳至工作器',
    heroKicker: '日常工具，一站搞掂',
    heroTitleA: '你需要嘅每個工具，',
    heroTitleB: '都喺瀏覽器裡',
    heroSubtitle:
      '轉檔、計算、整理文字 — 快速而且私隱。多數工具喺裝置上執行；少數需模型或可選工作器。',
    viewTools: '瀏覽工具',
    viewAll: '查看全部',
    rated: '私隱優先 · 多數工具喺裝置上運算',
    catalogKicker: '工具箱',
    catalogTitle: '選擇工具',
    catalogSubtitle: '多數工具喺本機執行 — 唔使帳號。少數需模型或可選工作器。',
    footerLanguages: '語言',
    footerLegal: '法律',
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
    notFoundTitle: 'ページが見つかりません',
    notFoundBody:
      'このアドレスに一致するツールはありません。名前が変更されたか、リンクが間違っている可能性があります。',
    notFoundCta: 'すべてのツールを見る',
    brand: 'Zii',
    navHome: 'ホーム',
    navTools: 'ツール',
    navAbout: '概要',
    navPrivacy: 'プライバシー',
    navTerms: '利用規約',
    navLegal: '法的情報',
    getStarted: 'はじめる',
    skipToContent: '本文へスキップ',
    needsNetwork: '通信が必要',
    uploadsWorker: 'ワーカーへ送信',
    heroKicker: '毎日の便利ツールを一か所に',
    heroTitleA: '必要なツールが、',
    heroTitleB: 'すべてブラウザに',
    heroSubtitle:
      'ファイル変換、計算、テキスト整形 — 高速でプライベート。大半は端末内、一部はモデルまたは任意ワーカー。',
    viewTools: 'ツールを見る',
    viewAll: 'すべて見る',
    rated: 'プライバシー重視 · 大半は端末上で動作',
    catalogKicker: 'ツールボックス',
    catalogTitle: 'ツールを選ぶ',
    catalogSubtitle: '大半は端末内で動作 — アカウント不要。一部はモデルまたは任意ワーカーが必要。',
    footerLanguages: '言語',
    footerLegal: '法的情報',
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
    errorBody:
      '도구를 불러오거나 실행하는 중 오류가 발생했습니다. 나머지 기능은 영향을 받지 않습니다.',
    errorRetry: '다시 시도',
    notFoundTitle: '페이지를 찾을 수 없습니다',
    notFoundBody:
      '해당 주소와 일치하는 도구가 없습니다. 이름이 변경되었거나 링크가 잘못되었을 수 있습니다.',
    notFoundCta: '모든 도구 보기',
    brand: 'Zii',
    navHome: '홈',
    navTools: '도구',
    navAbout: '소개',
    navPrivacy: '개인정보',
    navTerms: '이용약관',
    navLegal: '법적 고지',
    getStarted: '시작하기',
    skipToContent: '본문으로 건너뛰기',
    needsNetwork: '네트워크 필요',
    uploadsWorker: '워커로 업로드',
    heroKicker: '매일 쓰는 도구를 한곳에',
    heroTitleA: '필요한 모든 도구를,',
    heroTitleB: '브라우저에서 바로',
    heroSubtitle:
      '파일 변환, 계산, 텍스트 정리 — 빠르고 안전합니다. 대부분은 기기에서 실행되며, 일부는 모델 또는 선택 워커가 필요합니다.',
    viewTools: '도구 보기',
    viewAll: '전체 보기',
    rated: '개인정보 우선 · 대부분 기기에서 실행',
    catalogKicker: '도구 상자',
    catalogTitle: '도구 선택',
    catalogSubtitle: '대부분 기기에서 실행 — 계정 없음. 일부는 모델 또는 선택 워커가 필요합니다.',
    footerLanguages: '언어',
    footerLegal: '법적 고지',
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
    errorBody:
      'Algo salió mal al cargar o ejecutar esta herramienta. El resto de la app no se ve afectada.',
    errorRetry: 'Reintentar',
    notFoundTitle: 'Página no encontrada',
    notFoundBody:
      'Esa dirección no corresponde a ninguna herramienta. Puede que se haya renombrado o que el enlace esté mal escrito.',
    notFoundCta: 'Ver todas las herramientas',
    brand: 'Zii',
    navHome: 'Inicio',
    navTools: 'Herramientas',
    navAbout: 'Acerca de',
    navPrivacy: 'Privacidad',
    navTerms: 'Términos',
    navLegal: 'Aviso legal',
    getStarted: 'Empezar',
    skipToContent: 'Saltar al contenido',
    needsNetwork: 'requiere red',
    uploadsWorker: 'envía al worker',
    heroKicker: 'Utilidades diarias, en un solo lugar',
    heroTitleA: 'Todas las herramientas que necesitas,',
    heroTitleB: 'en tu navegador',
    heroSubtitle:
      'Convierte archivos, haz cálculos y limpia texto — rápido y privado. La mayoría corre en tu dispositivo; unas pocas necesitan un modelo o worker opcional.',
    viewTools: 'Ver herramientas',
    viewAll: 'Ver todas',
    rated: 'Privado por diseño · la mayoría funciona en tu dispositivo',
    catalogKicker: 'La caja de herramientas',
    catalogTitle: 'Elige una herramienta',
    catalogSubtitle:
      'La mayoría se ejecuta en local — sin cuentas. Unas pocas necesitan un modelo o worker opcional.',
    footerLanguages: 'Idiomas',
    footerLegal: 'Legal',
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
    loadingEngine:
      'Chargement — la première utilisation télécharge un moteur plus lourd, un instant…',
    errorTitle: 'Cet outil a rencontré un problème',
    errorBody:
      "Une erreur s'est produite lors du chargement ou de l'exécution de cet outil. Le reste de l'application n'est pas affecté.",
    errorRetry: 'Réessayer',
    notFoundTitle: 'Page introuvable',
    notFoundBody:
      'Cette adresse ne correspond à aucun outil. Il a peut-être été renommé, ou le lien est erroné.',
    notFoundCta: 'Voir tous les outils',
    brand: 'Zii',
    navHome: 'Accueil',
    navTools: 'Outils',
    navAbout: 'À propos',
    navPrivacy: 'Confidentialité',
    navTerms: 'Conditions',
    navLegal: 'Mentions légales',
    getStarted: 'Commencer',
    skipToContent: 'Aller au contenu',
    needsNetwork: 'réseau requis',
    uploadsWorker: 'envoie au worker',
    heroKicker: 'Les outils du quotidien, au même endroit',
    heroTitleA: 'Tous les outils dont vous avez besoin,',
    heroTitleB: 'directement dans votre navigateur',
    heroSubtitle:
      'Convertissez des fichiers, calculez et nettoyez du texte — rapide et privé. La plupart s’exécute sur l’appareil ; quelques-uns ont besoin d’un modèle ou d’un worker.',
    viewTools: 'Voir les outils',
    viewAll: 'Tout voir',
    rated: 'Confidentiel par conception · la plupart s’exécute sur l’appareil',
    catalogKicker: 'La boîte à outils',
    catalogTitle: 'Choisissez un outil',
    catalogSubtitle:
      'La plupart fonctionne en local — sans compte. Quelques-uns nécessitent un modèle ou un worker.',
    footerLanguages: 'Langues',
    footerLegal: 'Mentions légales',
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
    errorBody:
      'Beim Laden oder Ausführen dieses Tools ist ein Fehler aufgetreten. Der Rest der App ist nicht betroffen.',
    errorRetry: 'Erneut versuchen',
    notFoundTitle: 'Seite nicht gefunden',
    notFoundBody:
      'Diese Adresse gehört zu keinem Werkzeug. Möglicherweise wurde es umbenannt oder der Link ist fehlerhaft.',
    notFoundCta: 'Alle Werkzeuge ansehen',
    brand: 'Zii',
    navHome: 'Start',
    navTools: 'Werkzeuge',
    navAbout: 'Über',
    navPrivacy: 'Datenschutz',
    navTerms: 'Nutzungsbedingungen',
    navLegal: 'Impressum',
    getStarted: 'Loslegen',
    skipToContent: 'Zum Inhalt springen',
    needsNetwork: 'Netzwerk nötig',
    uploadsWorker: 'Upload an Worker',
    heroKicker: 'Alltagswerkzeuge an einem Ort',
    heroTitleA: 'Jedes Werkzeug, das du brauchst,',
    heroTitleB: 'direkt im Browser',
    heroSubtitle:
      'Dateien umwandeln, rechnen und Text aufräumen — schnell und privat. Die meisten Tools laufen auf dem Gerät; einige brauchen ein Modell oder einen optionalen Worker.',
    viewTools: 'Werkzeuge ansehen',
    viewAll: 'Alle ansehen',
    rated: 'Privat by Design · die meisten Tools laufen auf dem Gerät',
    catalogKicker: 'Der Werkzeugkasten',
    catalogTitle: 'Wähle ein Werkzeug',
    catalogSubtitle:
      'Die meisten laufen lokal — kein Konto. Einige brauchen ein Modell oder einen optionalen Worker.',
    footerLanguages: 'Sprachen',
    footerLegal: 'Rechtliches',
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
