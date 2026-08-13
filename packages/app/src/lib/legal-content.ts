import type { Lang } from './i18n';
import { LEGAL_CONTACT, LEGAL_OPERATOR, LEGAL_SITE, type LegalView } from './legal';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDoc {
  title: string;
  sections: LegalSection[];
}

type Docs = Record<LegalView, Record<Lang, LegalDoc>>;

const DOCS: Docs = {
  privacy: {
    en: {
      title: 'Privacy',
      sections: [
        {
          heading: 'Who we are',
          paragraphs: [
            `${LEGAL_OPERATOR} operates ${LEGAL_SITE}. There are no user accounts. We do not run ads or product analytics.`,
            `Questions: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'On-device by default',
          paragraphs: [
            'Most tools run entirely in your browser. Files, text, and numbers you enter stay on your device unless you choose a tool that needs the network.',
            'We do not keep a server-side copy of what you type or upload into on-device tools.',
          ],
        },
        {
          heading: 'When the network is used',
          paragraphs: [
            'A small set of tools is marked as needing the network. OCR and background removal download a recognition model on first use (your image is processed in the browser). Video and audio conversion load a WASM engine. Optional document conversion (Word/PowerPoint → PDF, PDF → Word) may send the file to a conversion worker you or the operator configure — that worker is designed not to retain files. Live exchange rates, if you tap “Fetch live rate”, request a public FX API or that same optional backend.',
            'The service worker caches the app shell so repeat visits work offline. It does not upload your documents.',
          ],
        },
        {
          heading: 'Storage on your device',
          paragraphs: [
            'The app may store your language (in the URL), dark-mode preference, and selected region in localStorage. That is not personal data. Individual tools may keep drafts you create (for example a subscription list) in localStorage on this device only.',
            'Clearing site data in your browser removes those preferences.',
          ],
        },
        {
          heading: 'No tracking',
          paragraphs: [
            'There is no account system, no advertising SDK, and no crash telemetry. Errors stay in your browser console.',
          ],
        },
      ],
    },
    'zh-TW': {
      title: '隱私權',
      sections: [
        {
          heading: '營運者',
          paragraphs: [
            `${LEGAL_OPERATOR} 營運 ${LEGAL_SITE}。沒有使用者帳號，也不投放廣告或產品分析。`,
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '預設在裝置上處理',
          paragraphs: [
            '多數工具完全在瀏覽器中執行。你輸入的檔案、文字與數字會留在裝置上，除非你選用需要網路的工具。',
            '裝置端工具的內容，我們不會在伺服器上另存一份。',
          ],
        },
        {
          heading: '何時會用到網路',
          paragraphs: [
            '少數工具會標示需要網路。OCR 與去背會在首次使用時下載辨識模型（圖片仍在瀏覽器處理）。影片／音訊轉檔會載入 WASM 引擎。可選的文件轉檔（Word/PowerPoint → PDF、PDF → Word）可能把檔案送到你或營運者設定的轉檔工作器——該工作器設計為不保留檔案。若你點選「取得即時匯率」，會向公開匯率 API 或同一可選後端查詢。',
            'Service worker 會快取應用程式外殼以便離線重訪，不會上傳你的文件。',
          ],
        },
        {
          heading: '裝置上的儲存',
          paragraphs: [
            '應用程式可能把語言（在網址中）、深色模式與地區選擇存在 localStorage，這不是個人資料。個別工具也可能把你建立的草稿存在本機。',
            '在瀏覽器清除此網站資料即可刪除這些偏好。',
          ],
        },
        {
          heading: '沒有追蹤',
          paragraphs: ['沒有帳號系統、廣告 SDK 或當機遙測。錯誤只會留在瀏覽器主控台。'],
        },
      ],
    },
    'zh-HK': {
      title: '私隱',
      sections: [
        {
          heading: '營運者',
          paragraphs: [
            `${LEGAL_OPERATOR} 營運 ${LEGAL_SITE}。冇使用者帳號，亦唔投放廣告或產品分析。`,
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '預設喺裝置上處理',
          paragraphs: [
            '多數工具完全喺瀏覽器入面執行。你輸入嘅檔案、文字同數字會留喺裝置上，除非你選用需要網絡嘅工具。',
            '裝置端工具嘅內容，我哋唔會喺伺服器另外存一份。',
          ],
        },
        {
          heading: '幾時會用到網絡',
          paragraphs: [
            '少數工具會標示需要網絡。OCR 同去背會喺首次使用時下載辨識模型（圖片仍然喺瀏覽器處理）。影片／音訊轉檔會載入 WASM 引擎。可選嘅文件轉檔可能把檔案送到轉檔工作器——設計上唔保留檔案。若你撳「取得即時匯率」，會向公開匯率 API 或同一可選後端查詢。',
            'Service worker 會快取應用程式外殼以便離線重訪，唔會上傳你嘅文件。',
          ],
        },
        {
          heading: '裝置上嘅儲存',
          paragraphs: [
            '應用程式可能把語言（喺網址）、深色模式同地區選擇存在 localStorage，呢啲唔係個人資料。個別工具亦可能把草稿存在本機。',
            '喺瀏覽器清除此網站資料即可刪除呢啲偏好。',
          ],
        },
        {
          heading: '冇追蹤',
          paragraphs: ['冇帳號系統、廣告 SDK 或當機遙測。錯誤只會留喺瀏覽器主控台。'],
        },
      ],
    },
    ja: {
      title: 'プライバシー',
      sections: [
        {
          heading: '運営者',
          paragraphs: [
            `${LEGAL_OPERATOR} が ${LEGAL_SITE} を運営しています。アカウントはなく、広告やプロダクト分析もありません。`,
            `連絡先: ${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '原則として端末内で処理',
          paragraphs: [
            '大半のツールはブラウザ内だけで動作します。入力したファイル・テキスト・数値は、通信が必要なツールを選ばない限り端末から出ません。',
            '端末内ツールの内容をサーバー側に保管することはありません。',
          ],
        },
        {
          heading: '通信を使う場合',
          paragraphs: [
            '一部のツールは通信が必要です。OCR と背景削除は初回に認識モデルを取得します（画像はブラウザ内で処理）。動画／音声変換は WASM エンジンを読み込みます。任意の文書変換は、設定した変換ワーカーへファイルを送ることがあり、そのワーカーはファイルを保持しない設計です。ライブ為替を取得すると、公開 FX API または同じ任意バックエンドへ問い合わせます。',
            'Service Worker はアプリシェルをキャッシュしてオフライン再利用を可能にします。文書はアップロードしません。',
          ],
        },
        {
          heading: '端末上の保存',
          paragraphs: [
            '言語（URL）、ダークモード、地域選択を localStorage に保存することがあります。個人情報ではありません。一部ツールは下書きをこの端末にだけ保存します。',
            'ブラウザでこのサイトのデータを削除すると、それらの設定も消えます。',
          ],
        },
        {
          heading: '追跡なし',
          paragraphs: [
            'アカウント、広告 SDK、クラッシュ計測はありません。エラーはブラウザのコンソールに留まります。',
          ],
        },
      ],
    },
    ko: {
      title: '개인정보',
      sections: [
        {
          heading: '운영자',
          paragraphs: [
            `${LEGAL_OPERATOR}가 ${LEGAL_SITE}를 운영합니다. 계정은 없으며 광고나 제품 분석도 없습니다.`,
            `문의: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: '기본은 기기에서 처리',
          paragraphs: [
            '대부분의 도구는 브라우저에서만 실행됩니다. 네트워크가 필요한 도구를 고르지 않는 한 파일·텍스트·숫자는 기기에 남습니다.',
            '기기에서 처리한 내용을 서버에 보관하지 않습니다.',
          ],
        },
        {
          heading: '네트워크를 쓰는 경우',
          paragraphs: [
            '일부 도구는 네트워크가 필요합니다. OCR과 배경 제거는 처음 사용할 때 인식 모델을 내려받습니다(이미지는 브라우저에서 처리). 동영상/오디오 변환은 WASM 엔진을 불러옵니다. 선택적 문서 변환은 설정한 변환 워커로 파일을 보낼 수 있으며, 해당 워커는 파일을 보관하지 않도록 설계되어 있습니다. 실시간 환율을 요청하면 공개 FX API 또는 같은 선택적 백엔드를 조회합니다.',
            '서비스 워커는 앱 셸을 캐시해 오프라인 재방문을 돕습니다. 문서를 업로드하지 않습니다.',
          ],
        },
        {
          heading: '기기의 저장소',
          paragraphs: [
            '언어(URL), 다크 모드, 지역 선택을 localStorage에 저장할 수 있습니다. 이는 개인정보가 아닙니다. 일부 도구는 초안을 이 기기에만 저장합니다.',
            '브라우저에서 이 사이트 데이터를 지우면 해당 설정도 삭제됩니다.',
          ],
        },
        {
          heading: '추적 없음',
          paragraphs: [
            '계정, 광고 SDK, 충돌 원격 측정이 없습니다. 오류는 브라우저 콘솔에만 남습니다.',
          ],
        },
      ],
    },
    es: {
      title: 'Privacidad',
      sections: [
        {
          heading: 'Quiénes somos',
          paragraphs: [
            `${LEGAL_OPERATOR} opera ${LEGAL_SITE}. No hay cuentas de usuario. No hay anuncios ni analítica de producto.`,
            `Contacto: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'En el dispositivo por defecto',
          paragraphs: [
            'La mayoría de las herramientas se ejecutan por completo en tu navegador. Archivos, texto y números se quedan en el dispositivo salvo que elijas una herramienta que necesite red.',
            'No guardamos en un servidor una copia de lo que escribes o subes a las herramientas locales.',
          ],
        },
        {
          heading: 'Cuándo se usa la red',
          paragraphs: [
            'Un conjunto pequeño de herramientas necesita red. OCR y quitar fondo descargan un modelo la primera vez (la imagen se procesa en el navegador). Vídeo y audio cargan un motor WASM. La conversión opcional de documentos puede enviar el archivo a un worker configurado, diseñado para no retener archivos. El tipo de cambio en vivo consulta una API pública o ese mismo backend opcional.',
            'El service worker guarda la cáscara de la app para visitas sin conexión. No sube tus documentos.',
          ],
        },
        {
          heading: 'Almacenamiento en tu dispositivo',
          paragraphs: [
            'La app puede guardar idioma (en la URL), el modo oscuro y la región en localStorage. Eso no es dato personal. Algunas herramientas guardan borradores solo en este dispositivo.',
            'Borrar los datos del sitio en el navegador elimina esas preferencias.',
          ],
        },
        {
          heading: 'Sin seguimiento',
          paragraphs: [
            'No hay cuentas, SDK publicitario ni telemetría de fallos. Los errores se quedan en la consola del navegador.',
          ],
        },
      ],
    },
    fr: {
      title: 'Confidentialité',
      sections: [
        {
          heading: 'Qui nous sommes',
          paragraphs: [
            `${LEGAL_OPERATOR} exploite ${LEGAL_SITE}. Il n’y a pas de comptes. Pas de publicité ni d’analytique produit.`,
            `Contact : ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Traitement sur l’appareil par défaut',
          paragraphs: [
            'La plupart des outils s’exécutent entièrement dans votre navigateur. Fichiers, texte et nombres restent sur l’appareil, sauf si vous choisissez un outil qui a besoin du réseau.',
            'Nous ne conservons pas côté serveur une copie de ce que vous saisissez dans les outils locaux.',
          ],
        },
        {
          heading: 'Quand le réseau est utilisé',
          paragraphs: [
            'Quelques outils nécessitent le réseau. L’OCR et la suppression d’arrière-plan téléchargent un modèle à la première utilisation (l’image est traitée dans le navigateur). Vidéo et audio chargent un moteur WASM. La conversion de documents facultative peut envoyer le fichier à un worker configuré, conçu pour ne pas le conserver. Le taux de change en direct interroge une API publique ou ce même backend facultatif.',
            'Le service worker met en cache la coque de l’application pour un usage hors ligne. Il n’envoie pas vos documents.',
          ],
        },
        {
          heading: 'Stockage sur votre appareil',
          paragraphs: [
            'L’application peut enregistrer la langue (dans l’URL), le mode sombre et la région dans localStorage. Ce n’est pas une donnée personnelle. Certains outils y gardent des brouillons sur cet appareil uniquement.',
            'Effacer les données du site dans le navigateur supprime ces préférences.',
          ],
        },
        {
          heading: 'Pas de suivi',
          paragraphs: [
            'Pas de comptes, de SDK publicitaire ni de télémétrie de plantage. Les erreurs restent dans la console du navigateur.',
          ],
        },
      ],
    },
    de: {
      title: 'Datenschutz',
      sections: [
        {
          heading: 'Wer wir sind',
          paragraphs: [
            `${LEGAL_OPERATOR} betreibt ${LEGAL_SITE}. Es gibt keine Benutzerkonten, keine Werbung und keine Produktanalytik.`,
            `Kontakt: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Standardmäßig auf dem Gerät',
          paragraphs: [
            'Die meisten Tools laufen vollständig im Browser. Dateien, Text und Zahlen bleiben auf dem Gerät, außer du wählst ein Tool, das Netzwerk braucht.',
            'Von Eingaben in lokale Tools legen wir keine serverseitige Kopie an.',
          ],
        },
        {
          heading: 'Wann das Netzwerk genutzt wird',
          paragraphs: [
            'Einige Tools brauchen Netzwerk. OCR und Hintergrundentfernung laden beim ersten Mal ein Modell (das Bild wird im Browser verarbeitet). Video/Audio laden eine WASM-Engine. Optionale Dokumentkonvertierung kann die Datei an einen konfigurierten Worker senden, der Dateien nicht behalten soll. Live-Kurse fragen eine öffentliche FX-API oder dasselbe optionale Backend ab.',
            'Der Service Worker speichert die App-Hülle für Offline-Besuche. Er lädt deine Dokumente nicht hoch.',
          ],
        },
        {
          heading: 'Speicherung auf dem Gerät',
          paragraphs: [
            'Sprache (in der URL), Dunkelmodus und Region können in localStorage liegen. Das sind keine personenbezogenen Daten. Einzelne Tools können Entwürfe nur auf diesem Gerät speichern.',
            'Das Löschen der Website-Daten im Browser entfernt diese Einstellungen.',
          ],
        },
        {
          heading: 'Kein Tracking',
          paragraphs: [
            'Kein Kontosystem, kein Werbe-SDK, keine Absturztelemetrie. Fehler bleiben in der Browserkonsole.',
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      title: 'Terms of use',
      sections: [
        {
          heading: 'The service',
          paragraphs: [
            `${LEGAL_SITE} provides browser utilities operated by ${LEGAL_OPERATOR}. The tools are offered as-is, without a service-level agreement.`,
          ],
        },
        {
          heading: 'Estimates are not advice',
          paragraphs: [
            'Finance, tax, payroll, leave, and similar calculators are planning estimates. They are not tax, legal, accounting, or payroll advice and may use simplified or dated tables. Confirm figures with official sources or a qualified adviser before filing, paying, or contracting.',
          ],
        },
        {
          heading: 'Identity samples',
          paragraphs: [
            'Where a tool can generate an identity, tax, or bank-style number, the output is a TEST/QA sample that satisfies a checksum. It is not an official document. Do not present generated values as real identifiers.',
          ],
        },
        {
          heading: 'Your files',
          paragraphs: [
            'You are responsible for the files and data you process. Do not use the tools to break the law. Optional conversion workers process files you explicitly send; review the Privacy page.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'To the extent permitted by law, Zii is not liable for losses arising from use of these estimates or tools. If a mandatory consumer right applies in your country, it is not excluded.',
            `Contact: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    'zh-TW': {
      title: '使用條款',
      sections: [
        {
          heading: '服務內容',
          paragraphs: [
            `${LEGAL_SITE} 提供由 ${LEGAL_OPERATOR} 營運的瀏覽器工具，以現況提供，沒有服務水準協議。`,
          ],
        },
        {
          heading: '估算不是專業意見',
          paragraphs: [
            '財務、稅務、薪資、休假等計算機僅供規劃估算，並非稅務、法律、會計或薪資建議，且可能使用簡化或較舊的稅表。報稅、付款或簽約前請向官方來源或合格顧問確認。',
          ],
        },
        {
          heading: '身分範例',
          paragraphs: [
            '若工具可產生身分、稅籍或銀行類號碼，輸出為通過校驗的測試／品管範例，非正式文件。請勿當作真實證件使用。',
          ],
        },
        {
          heading: '你的檔案',
          paragraphs: [
            '你須自行負責所處理的檔案與資料，不得用於違法用途。可選轉檔工作器只處理你明確送出的檔案，詳見隱私權頁。',
          ],
        },
        {
          heading: '責任',
          paragraphs: [
            '在法律允許範圍內，Zii 不對使用這些估算或工具所生損害負責。若你所在地有強制性消費者權利，本條款不排除該權利。',
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
      ],
    },
    'zh-HK': {
      title: '使用條款',
      sections: [
        {
          heading: '服務內容',
          paragraphs: [
            `${LEGAL_SITE} 提供由 ${LEGAL_OPERATOR} 營運嘅瀏覽器工具，以現況提供，冇服務水準協議。`,
          ],
        },
        {
          heading: '估算唔係專業意見',
          paragraphs: [
            '財務、稅務、薪酬、假期等計算機只供規劃估算，並非稅務、法律、會計或薪酬意見，而且可能用簡化或較舊嘅稅表。報稅、付款或簽約前請向官方來源或合資格顧問確認。',
          ],
        },
        {
          heading: '身分範例',
          paragraphs: [
            '若工具可產生身分、稅務或銀行類號碼，輸出係通過校驗嘅測試／品管範例，唔係正式文件。唔好當真實證件使用。',
          ],
        },
        {
          heading: '你嘅檔案',
          paragraphs: [
            '你須自行負責所處理嘅檔案同資料，唔可用於違法用途。可選轉檔工作器只處理你明確送出嘅檔案，詳見私隱頁。',
          ],
        },
        {
          heading: '責任',
          paragraphs: [
            '在法律允許範圍內，Zii 唔對使用呢啲估算或工具所生損害負責。若你所在地有強制性消費者權利，本條款唔排除該權利。',
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
      ],
    },
    ja: {
      title: '利用規約',
      sections: [
        {
          heading: 'サービス',
          paragraphs: [
            `${LEGAL_SITE} は ${LEGAL_OPERATOR} が運営するブラウザ向けユーティリティです。現状有姿で提供し、SLA はありません。`,
          ],
        },
        {
          heading: '概算は助言ではありません',
          paragraphs: [
            '財務・税・給与・休暇などの計算機は計画用の概算です。税務・法務・会計・給与の助言ではなく、簡略化または日付の古い表を使うことがあります。申告・支払・契約の前に公式情報または専門家にご確認ください。',
          ],
        },
        {
          heading: 'ID サンプル',
          paragraphs: [
            '身分・税・口座形式の番号を生成できる場合、出力はチェックサムを満たすテスト／QA 用サンプルであり、正式書類ではありません。実在の識別子として使わないでください。',
          ],
        },
        {
          heading: 'ファイル',
          paragraphs: [
            '処理するファイルとデータの責任は利用者にあります。違法な用途に使わないでください。任意の変換ワーカーは明示的に送ったファイルだけを処理します。プライバシーページもご覧ください。',
          ],
        },
        {
          heading: '責任',
          paragraphs: [
            '法令で許される範囲で、Zii はこれらの概算やツールの利用から生じた損害について責任を負いません。強行規定としての消費者権利は排除しません。',
            `連絡先: ${LEGAL_CONTACT}。`,
          ],
        },
      ],
    },
    ko: {
      title: '이용약관',
      sections: [
        {
          heading: '서비스',
          paragraphs: [
            `${LEGAL_SITE}는 ${LEGAL_OPERATOR}가 운영하는 브라우저 유틸리티입니다. 있는 그대로 제공되며 SLA는 없습니다.`,
          ],
        },
        {
          heading: '추정은 자문이 아닙니다',
          paragraphs: [
            '재무·세금·급여·휴가 계산기는 계획용 추정치입니다. 세무·법률·회계·급여 자문이 아니며 단순화되었거나 날짜가 지난 표를 쓸 수 있습니다. 신고·납부·계약 전에 공식 출처 또는 전문가와 확인하세요.',
          ],
        },
        {
          heading: '신원 샘플',
          paragraphs: [
            '신원·세무·은행 형식 번호를 생성할 수 있는 경우, 결과는 체크섬을 만족하는 TEST/QA 샘플이며 공식 서류가 아닙니다. 실제 식별자로 제시하지 마세요.',
          ],
        },
        {
          heading: '파일',
          paragraphs: [
            '처리하는 파일과 데이터에 대한 책임은 이용자에게 있습니다. 불법 용도로 사용하지 마세요. 선택적 변환 워커는 명시적으로 보낸 파일만 처리합니다. 개인정보 페이지를 참고하세요.',
          ],
        },
        {
          heading: '책임',
          paragraphs: [
            '법이 허용하는 범위에서 Zii는 이러한 추정이나 도구 사용으로 인한 손실에 책임을 지지 않습니다. 해당 국가의 강행 소비자 권리는 배제되지 않습니다.',
            `문의: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    es: {
      title: 'Términos de uso',
      sections: [
        {
          heading: 'El servicio',
          paragraphs: [
            `${LEGAL_SITE} ofrece utilidades de navegador operadas por ${LEGAL_OPERATOR}. Se ofrecen tal cual, sin acuerdo de nivel de servicio.`,
          ],
        },
        {
          heading: 'Las estimaciones no son asesoramiento',
          paragraphs: [
            'Las calculadoras financieras, fiscales, laborales y similares son estimaciones para planificar. No son asesoramiento fiscal, legal, contable ni laboral y pueden usar tablas simplificadas o desactualizadas. Confirma las cifras con fuentes oficiales o un asesor cualificado antes de declarar, pagar o contratar.',
          ],
        },
        {
          heading: 'Muestras de identidad',
          paragraphs: [
            'Si una herramienta genera un número de identidad, fiscal o bancario, el resultado es una muestra de PRUEBA/QA que cumple un dígito de control. No es un documento oficial. No lo presentes como identificador real.',
          ],
        },
        {
          heading: 'Tus archivos',
          paragraphs: [
            'Eres responsable de los archivos y datos que procesas. No uses las herramientas para infringir la ley. Los workers de conversión opcionales procesan solo lo que envías expresamente; consulta Privacidad.',
          ],
        },
        {
          heading: 'Responsabilidad',
          paragraphs: [
            'En la medida permitida por la ley, Zii no responde de pérdidas derivadas del uso de estas estimaciones o herramientas. Si en tu país aplica un derecho de consumo imperativo, no se excluye.',
            `Contacto: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    fr: {
      title: 'Conditions d’utilisation',
      sections: [
        {
          heading: 'Le service',
          paragraphs: [
            `${LEGAL_SITE} propose des utilitaires navigateur exploités par ${LEGAL_OPERATOR}. Ils sont fournis en l’état, sans engagement de niveau de service.`,
          ],
        },
        {
          heading: 'Les estimations ne sont pas un conseil',
          paragraphs: [
            'Les calculateurs financiers, fiscaux, salariaux et similaires sont des estimations pour planifier. Ce n’est pas un conseil fiscal, juridique, comptable ou salarial ; les barèmes peuvent être simplifiés ou datés. Vérifiez auprès de sources officielles ou d’un conseiller avant toute déclaration, paiement ou contrat.',
          ],
        },
        {
          heading: 'Échantillons d’identité',
          paragraphs: [
            'Lorsqu’un outil génère un numéro d’identité, fiscal ou bancaire, le résultat est un échantillon de TEST/QA satisfaisant une clé de contrôle. Ce n’est pas un document officiel. Ne le présentez pas comme un identifiant réel.',
          ],
        },
        {
          heading: 'Vos fichiers',
          paragraphs: [
            'Vous êtes responsable des fichiers et données traités. N’utilisez pas les outils à des fins illégales. Les workers de conversion facultatifs ne traitent que ce que vous envoyez explicitement ; voir Confidentialité.',
          ],
        },
        {
          heading: 'Responsabilité',
          paragraphs: [
            'Dans la mesure permise par la loi, Zii n’est pas responsable des pertes liées à l’usage de ces estimations ou outils. Un droit de la consommation impératif applicable dans votre pays n’est pas écarté.',
            `Contact : ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    de: {
      title: 'Nutzungsbedingungen',
      sections: [
        {
          heading: 'Der Dienst',
          paragraphs: [
            `${LEGAL_SITE} stellt von ${LEGAL_OPERATOR} betriebene Browser-Werkzeuge bereit. Sie werden ohne Service-Level-Vereinbarung „wie besehen“ angeboten.`,
          ],
        },
        {
          heading: 'Schätzungen sind keine Beratung',
          paragraphs: [
            'Finanz-, Steuer-, Gehalts- und ähnliche Rechner sind Planungsschätzungen. Sie sind keine Steuer-, Rechts-, Buchhaltungs- oder Gehaltsberatung und können vereinfachte oder ältere Tabellen nutzen. Prüfe Zahlen vor Abgabe, Zahlung oder Vertrag anhand amtlicher Quellen oder mit einer Fachperson.',
          ],
        },
        {
          heading: 'Identitätsbeispiele',
          paragraphs: [
            'Kann ein Tool eine Ausweis-, Steuer- oder Banknummer erzeugen, ist die Ausgabe ein TEST-/QA-Beispiel mit gültiger Prüfziffer — kein amtliches Dokument. Nicht als echte Kennung verwenden.',
          ],
        },
        {
          heading: 'Deine Dateien',
          paragraphs: [
            'Du bist für verarbeitete Dateien und Daten verantwortlich. Nutze die Tools nicht rechtswidrig. Optionale Konvertierungs-Worker verarbeiten nur ausdrücklich gesendete Dateien; siehe Datenschutz.',
          ],
        },
        {
          heading: 'Haftung',
          paragraphs: [
            'Soweit gesetzlich zulässig haftet Zii nicht für Schäden aus der Nutzung dieser Schätzungen oder Tools. Zwingende Verbraucherrechte deines Landes bleiben unberührt.',
            `Kontakt: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
  },
  about: {
    en: {
      title: 'About',
      sections: [
        {
          heading: 'What Zii is',
          paragraphs: [
            'Zii is a privacy-first suite of everyday browser tools — files, PDFs, images, text, calculators, converters, dates, identity checks, finance estimates, and developer utilities.',
            'Most tools run on your device. A few download a model once or use an optional conversion worker. There is no account to create.',
          ],
        },
        {
          heading: 'Scale',
          paragraphs: [
            'The catalog covers on the order of three hundred tool screens, twenty country markets plus a global set, and eight interface languages.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            `Operator: ${LEGAL_OPERATOR}. Site: ${LEGAL_SITE}. Email: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    'zh-TW': {
      title: '關於',
      sections: [
        {
          heading: 'Zii 是什麼',
          paragraphs: [
            'Zii 是隱私優先的日常瀏覽器工具箱：檔案、PDF、圖片、文字、計算機、轉檔、日期、身分檢查、財務估算與開發者工具。',
            '多數工具在裝置上執行。少數會下載一次模型，或使用可選的轉檔工作器。無需註冊帳號。',
          ],
        },
        {
          heading: '規模',
          paragraphs: ['目錄約有三百個工具畫面、二十個國家市場加上全球組，以及八種介面語言。'],
        },
        {
          heading: '聯絡',
          paragraphs: [
            `營運者：${LEGAL_OPERATOR}。網站：${LEGAL_SITE}。電子郵件：${LEGAL_CONTACT}。`,
          ],
        },
      ],
    },
    'zh-HK': {
      title: '關於',
      sections: [
        {
          heading: 'Zii 係咩',
          paragraphs: [
            'Zii 係私隱優先嘅日常瀏覽器工具箱：檔案、PDF、圖片、文字、計算機、轉檔、日期、身分檢查、財務估算同開發者工具。',
            '多數工具喺裝置上執行。少數會下載一次模型，或使用可選嘅轉檔工作器。唔使註冊帳號。',
          ],
        },
        {
          heading: '規模',
          paragraphs: ['目錄大約有三百個工具畫面、二十個國家市場加全球組，同八種介面語言。'],
        },
        {
          heading: '聯絡',
          paragraphs: [`營運者：${LEGAL_OPERATOR}。網站：${LEGAL_SITE}。電郵：${LEGAL_CONTACT}。`],
        },
      ],
    },
    ja: {
      title: '概要',
      sections: [
        {
          heading: 'Zii とは',
          paragraphs: [
            'Zii はプライバシーを重視した日常のブラウザツール集です。ファイル、PDF、画像、テキスト、計算機、変換、日付、身分チェック、財務の概算、開発者向けユーティリティをまとめています。',
            '大半は端末内で動作します。一部は初回にモデルを取得するか、任意の変換ワーカーを使います。アカウントは不要です。',
          ],
        },
        {
          heading: '規模',
          paragraphs: [
            'カタログは約三百のツール画面、二十の国市場とグローバル、八つの UI 言語です。',
          ],
        },
        {
          heading: '連絡先',
          paragraphs: [
            `運営: ${LEGAL_OPERATOR}。サイト: ${LEGAL_SITE}。メール: ${LEGAL_CONTACT}。`,
          ],
        },
      ],
    },
    ko: {
      title: '소개',
      sections: [
        {
          heading: 'Zii란',
          paragraphs: [
            'Zii는 개인정보를 우선하는 일상 브라우저 도구 모음입니다. 파일, PDF, 이미지, 텍스트, 계산기, 변환, 날짜, 신원 확인, 재무 추정, 개발자 유틸리티를 담습니다.',
            '대부분은 기기에서 실행됩니다. 일부는 모델을 한 번 내려받거나 선택적 변환 워커를 사용합니다. 계정은 필요 없습니다.',
          ],
        },
        {
          heading: '규모',
          paragraphs: [
            '카탈로그는 약 삼백 개의 도구 화면, 스무 개 국가 시장과 글로벌 세트, 여덟 가지 인터페이스 언어입니다.',
          ],
        },
        {
          heading: '연락',
          paragraphs: [
            `운영자: ${LEGAL_OPERATOR}. 사이트: ${LEGAL_SITE}. 이메일: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    es: {
      title: 'Acerca de',
      sections: [
        {
          heading: 'Qué es Zii',
          paragraphs: [
            'Zii es un conjunto de herramientas de navegador que prioriza la privacidad: archivos, PDF, imágenes, texto, calculadoras, conversiones, fechas, comprobaciones de identidad, estimaciones financieras y utilidades para desarrollo.',
            'La mayoría se ejecuta en tu dispositivo. Unas pocas descargan un modelo una vez o usan un worker de conversión opcional. No hay que crear una cuenta.',
          ],
        },
        {
          heading: 'Escala',
          paragraphs: [
            'El catálogo ronda las trescientas pantallas de herramientas, veinte mercados nacionales más un conjunto global, y ocho idiomas de interfaz.',
          ],
        },
        {
          heading: 'Contacto',
          paragraphs: [
            `Operador: ${LEGAL_OPERATOR}. Sitio: ${LEGAL_SITE}. Correo: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    fr: {
      title: 'À propos',
      sections: [
        {
          heading: 'Qu’est-ce que Zii',
          paragraphs: [
            'Zii est une suite d’outils navigateur axée sur la vie privée : fichiers, PDF, images, texte, calculateurs, conversions, dates, contrôles d’identité, estimations financières et utilitaires développeur.',
            'La plupart s’exécutent sur votre appareil. Quelques-uns téléchargent un modèle une fois ou utilisent un worker de conversion facultatif. Aucun compte à créer.',
          ],
        },
        {
          heading: 'Échelle',
          paragraphs: [
            'Le catalogue compte de l’ordre de trois cents écrans d’outils, vingt marchés nationaux plus un ensemble mondial, et huit langues d’interface.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            `Éditeur : ${LEGAL_OPERATOR}. Site : ${LEGAL_SITE}. E-mail : ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
    de: {
      title: 'Über',
      sections: [
        {
          heading: 'Was Zii ist',
          paragraphs: [
            'Zii ist eine datenschutzorientierte Sammlung alltäglicher Browser-Tools — Dateien, PDFs, Bilder, Text, Rechner, Konverter, Daten, Identitätsprüfungen, Finanzschätzungen und Entwickler-Utilities.',
            'Die meisten laufen auf dem Gerät. Einige laden einmal ein Modell oder nutzen einen optionalen Konvertierungs-Worker. Es gibt kein Konto.',
          ],
        },
        {
          heading: 'Umfang',
          paragraphs: [
            'Der Katalog umfasst rund dreihundert Tool-Bildschirme, zwanzig Ländermärkte plus eine globale Gruppe und acht Oberflächensprachen.',
          ],
        },
        {
          heading: 'Kontakt',
          paragraphs: [
            `Betreiber: ${LEGAL_OPERATOR}. Website: ${LEGAL_SITE}. E-Mail: ${LEGAL_CONTACT}.`,
          ],
        },
      ],
    },
  },
  legal: {
    en: {
      title: 'Legal notice',
      sections: [
        {
          heading: 'Operator',
          paragraphs: [
            `This site is operated by ${LEGAL_OPERATOR}.`,
            `Website: ${LEGAL_SITE}.`,
            `Contact: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Address',
          paragraphs: [
            'No registered company street address is published. Zii is an independent operator of this website. For privacy or legal questions use the email above — we do not invent a postal address.',
          ],
        },
        {
          heading: 'Policies',
          paragraphs: [
            'Use of the site is subject to the Terms of use. How data is handled is described in Privacy.',
          ],
        },
      ],
    },
    'zh-TW': {
      title: '法律資訊',
      sections: [
        {
          heading: '營運者',
          paragraphs: [
            `本站由 ${LEGAL_OPERATOR} 營運。`,
            `網站：${LEGAL_SITE}。`,
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '地址',
          paragraphs: [
            '未公布註冊公司街道地址。Zii 為本網站的獨立營運者。隱私或法律問題請用上方電子郵件——我們不會虛構郵寄地址。',
          ],
        },
        {
          heading: '政策',
          paragraphs: ['使用本站須遵守使用條款。資料處理方式見隱私權頁。'],
        },
      ],
    },
    'zh-HK': {
      title: '法律資訊',
      sections: [
        {
          heading: '營運者',
          paragraphs: [
            `本站由 ${LEGAL_OPERATOR} 營運。`,
            `網站：${LEGAL_SITE}。`,
            `聯絡：${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '地址',
          paragraphs: [
            '未公布註冊公司街道地址。Zii 係本網站嘅獨立營運者。私隱或法律問題請用上方電郵——我哋唔會虛構郵寄地址。',
          ],
        },
        {
          heading: '政策',
          paragraphs: ['使用本站須遵守使用條款。資料處理方式見私隱頁。'],
        },
      ],
    },
    ja: {
      title: '法的情報',
      sections: [
        {
          heading: '運営者',
          paragraphs: [
            `本サイトの運営者は ${LEGAL_OPERATOR} です。`,
            `ウェブサイト: ${LEGAL_SITE}。`,
            `連絡先: ${LEGAL_CONTACT}。`,
          ],
        },
        {
          heading: '住所',
          paragraphs: [
            '登記上の会社所在地は公開していません。Zii は本サイトの独立した運営者です。プライバシーや法務の問い合わせは上記メールへ。架空の郵便住所は記載しません。',
          ],
        },
        {
          heading: 'ポリシー',
          paragraphs: [
            '本サイトの利用は利用規約に従います。データの扱いはプライバシーに記載しています。',
          ],
        },
      ],
    },
    ko: {
      title: '법적 고지',
      sections: [
        {
          heading: '운영자',
          paragraphs: [
            `이 사이트는 ${LEGAL_OPERATOR}가 운영합니다.`,
            `웹사이트: ${LEGAL_SITE}.`,
            `문의: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: '주소',
          paragraphs: [
            '등록된 회사 도로명 주소는 공개하지 않습니다. Zii는 이 웹사이트의 독립 운영자입니다. 개인정보 또는 법적 문의는 위 이메일을 사용하세요. 우편 주소를 지어내지 않습니다.',
          ],
        },
        {
          heading: '정책',
          paragraphs: [
            '사이트 이용은 이용약관의 적용을 받습니다. 데이터 처리는 개인정보 페이지에 설명되어 있습니다.',
          ],
        },
      ],
    },
    es: {
      title: 'Aviso legal',
      sections: [
        {
          heading: 'Operador',
          paragraphs: [
            `Este sitio lo opera ${LEGAL_OPERATOR}.`,
            `Sitio web: ${LEGAL_SITE}.`,
            `Contacto: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Dirección',
          paragraphs: [
            'No se publica una dirección postal de empresa registrada. Zii es un operador independiente de este sitio. Para privacidad o cuestiones legales use el correo anterior; no inventamos una dirección.',
          ],
        },
        {
          heading: 'Políticas',
          paragraphs: [
            'El uso del sitio se rige por los Términos. El tratamiento de datos se describe en Privacidad.',
          ],
        },
      ],
    },
    fr: {
      title: 'Mentions légales',
      sections: [
        {
          heading: 'Éditeur',
          paragraphs: [
            `Ce site est exploité par ${LEGAL_OPERATOR}.`,
            `Site : ${LEGAL_SITE}.`,
            `Contact : ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Adresse',
          paragraphs: [
            'Aucune adresse postale d’entreprise immatriculée n’est publiée. Zii est l’exploitant indépendant de ce site. Pour la confidentialité ou les questions juridiques, utilisez l’e-mail ci-dessus — nous n’inventons pas d’adresse.',
          ],
        },
        {
          heading: 'Politiques',
          paragraphs: [
            'L’utilisation du site est soumise aux Conditions. Le traitement des données est décrit dans Confidentialité.',
          ],
        },
      ],
    },
    de: {
      title: 'Impressum',
      sections: [
        {
          heading: 'Betreiber',
          paragraphs: [
            `Diese Website wird von ${LEGAL_OPERATOR} betrieben.`,
            `Website: ${LEGAL_SITE}.`,
            `Kontakt: ${LEGAL_CONTACT}.`,
          ],
        },
        {
          heading: 'Anschrift',
          paragraphs: [
            'Es wird keine eingetragene Firmenanschrift veröffentlicht. Zii ist unabhängiger Betreiber dieser Website. Für Datenschutz oder rechtliche Fragen die E-Mail oben nutzen — wir erfinden keine Postadresse.',
          ],
        },
        {
          heading: 'Regelungen',
          paragraphs: [
            'Die Nutzung unterliegt den Nutzungsbedingungen. Der Umgang mit Daten steht unter Datenschutz.',
          ],
        },
      ],
    },
  },
};

export function legalDoc(view: LegalView, lang: Lang): LegalDoc {
  return DOCS[view][lang] ?? DOCS[view].en;
}
