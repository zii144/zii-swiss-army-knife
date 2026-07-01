import { validateUkNino, generateUkNino } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'UK National Insurance number', desc: 'Check a UK National Insurance number format and prefix, or generate a sample. On-device.', input: 'NI number (AB 12 34 56 C)' },
  'zh-TW': { title: '英國國民保險號碼 (NINO)', desc: '檢查英國國民保險號碼格式與前綴，或產生範例。於裝置上運算。', input: 'NI 號碼（AB 12 34 56 C）' },
  'zh-HK': { title: '英國國民保險號碼 (NINO)', desc: '檢查英國國民保險號碼格式與前綴，或產生範例。於裝置上運算。', input: 'NI 號碼（AB 12 34 56 C）' },
  ja: { title: '英国国民保険番号 (NINO)', desc: '英国国民保険番号の形式とプレフィックスを検証、またはサンプルを生成。端末上で動作。', input: 'NI 番号（AB 12 34 56 C）' },
  ko: { title: '영국 국민보험번호 (NINO)', desc: '영국 국민보험번호 형식과 접두어를 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: 'NI 번호 (AB 12 34 56 C)' },
  es: { title: 'Número de Seguro Nacional (Reino Unido)', desc: 'Comprueba el formato y el prefijo de un número de Seguro Nacional británico, o genera un ejemplo. En el dispositivo.', input: 'NI (AB 12 34 56 C)' },
  fr: { title: 'Numéro d’assurance nationale (Royaume-Uni)', desc: 'Vérifie le format et le préfixe d’un numéro d’assurance nationale britannique, ou génère un exemple. Sur l’appareil.', input: 'NI (AB 12 34 56 C)' },
  de: { title: 'Britische Sozialversicherungsnummer (NINO)', desc: 'Prüft Format und Präfix einer britischen NI-Nummer oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'NI-Nummer (AB 12 34 56 C)' },
};

export default function UkNinoTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUkNino}
      generate={generateUkNino}
      placeholder="AB 12 34 56 C"
      strings={{ input: t.input, ...c }}
    />
  );
}
