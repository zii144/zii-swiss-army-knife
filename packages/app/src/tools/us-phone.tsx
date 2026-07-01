import { validateUsPhone, generateUsPhone } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'US phone number', desc: 'Check a North American (NANP) phone number format, or generate a sample. On-device.', input: 'Phone number (10 digits)' },
  'zh-TW': { title: '美國電話號碼', desc: '檢查北美 (NANP) 電話號碼格式，或產生範例。於裝置上運算。', input: '電話號碼（10 碼）' },
  'zh-HK': { title: '美國電話號碼', desc: '檢查北美 (NANP) 電話號碼格式，或產生範例。於裝置上運算。', input: '電話號碼（10 碼）' },
  ja: { title: '米国の電話番号', desc: '北米 (NANP) の電話番号形式を検証、またはサンプルを生成。端末上で動作。', input: '電話番号（10桁）' },
  ko: { title: '미국 전화번호', desc: '북미(NANP) 전화번호 형식을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '전화번호 (10자리)' },
  es: { title: 'Número de teléfono de EE. UU.', desc: 'Comprueba el formato de un número de teléfono norteamericano (NANP), o genera un ejemplo. En el dispositivo.', input: 'Teléfono (10 dígitos)' },
  fr: { title: 'Numéro de téléphone (USA)', desc: 'Vérifie le format d’un numéro nord-américain (NANP), ou génère un exemple. Sur l’appareil.', input: 'Téléphone (10 chiffres)' },
  de: { title: 'US-Telefonnummer', desc: 'Prüft das Format einer nordamerikanischen (NANP) Telefonnummer oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Telefonnummer (10 Ziffern)' },
};

export default function UsPhoneTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUsPhone}
      generate={generateUsPhone}
      placeholder="(212) 555-0182"
      strings={{ input: t.input, ...c }}
    />
  );
}
