import type { Lang } from './i18n';

export type DisclaimerKind = 'finance' | 'id';

const COPY: Record<DisclaimerKind, Record<Lang, string>> = {
  finance: {
    en: 'Planning estimate only — not tax, legal, or payroll advice. Confirm with official sources before filing or paying.',
    'zh-TW': '僅供規劃估算，並非稅務、法律或薪資建議。報稅或付款前請向官方來源確認。',
    'zh-HK': '只供規劃估算，並非稅務、法律或薪酬意見。報稅或付款前請向官方來源確認。',
    ja: '計画用の概算であり、税務・法務・給与の助言ではありません。申告や支払の前に公式情報をご確認ください。',
    ko: '계획용 추정치이며 세무·법률·급여 자문이 아닙니다. 신고나 납부 전에 공식 출처를 확인하세요.',
    es: 'Solo una estimación — no es asesoramiento fiscal, legal ni laboral. Confirma con fuentes oficiales antes de declarar o pagar.',
    fr: 'Estimation indicative — ce n’est pas un conseil fiscal, juridique ou salarial. Vérifiez auprès de sources officielles.',
    de: 'Nur eine Planungsschätzung — keine Steuer-, Rechts- oder Gehaltsberatung. Vor Abgabe oder Zahlung amtliche Quellen prüfen.',
  },
  id: {
    en: 'Generated values are TEST/QA samples, not official documents. Do not present them as real IDs.',
    'zh-TW': '產生的號碼為測試／品管範例，非正式證件。請勿當作真實身分使用。',
    'zh-HK': '產生嘅號碼係測試／品管範例，唔係正式證件。唔好當真實身分使用。',
    ja: '生成値はテスト／QA用サンプルであり、正式な証明書ではありません。実在のIDとして使用しないでください。',
    ko: '생성된 값은 TEST/QA 샘플이며 공식 서류가 아닙니다. 실제 신분증으로 사용하지 마세요.',
    es: 'Los valores generados son muestras de PRUEBA/QA, no documentos oficiales. No los uses como identificaciones reales.',
    fr: 'Les valeurs générées sont des échantillons de TEST/QA, pas des documents officiels.',
    de: 'Erzeugte Werte sind TEST-/QA-Beispiele, keine amtlichen Dokumente. Nicht als echte Ausweise verwenden.',
  },
};

export function disclaimerFor(kind: DisclaimerKind, lang: Lang): string {
  return COPY[kind][lang] ?? COPY[kind].en;
}
