import { validateHkPhone, generateHkPhone } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Hong Kong phone number', desc: 'Check an 8-digit Hong Kong phone number format, or generate a sample. On-device.', input: 'Phone number (8 digits)' },
  'zh-TW': { title: '香港電話號碼', desc: '檢查香港 8 位電話號碼格式，或產生範例。於裝置上運算。', input: '電話號碼（8 位）' },
  'zh-HK': { title: '香港電話號碼', desc: '檢查香港 8 位電話號碼格式，或產生範例。於裝置上運算。', input: '電話號碼（8 位）' },
  ja: { title: '香港の電話番号', desc: '香港の 8 桁電話番号の形式を検証、またはサンプルを生成。端末上で動作。', input: '電話番号（8桁）' },
  ko: { title: '홍콩 전화번호', desc: '홍콩 8자리 전화번호 형식을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '전화번호 (8자리)' },
  es: { title: 'Número de teléfono de Hong Kong', desc: 'Comprueba el formato de un número de teléfono de Hong Kong de 8 dígitos, o genera un ejemplo. En el dispositivo.', input: 'Teléfono (8 dígitos)' },
  fr: { title: 'Numéro de téléphone de Hong Kong', desc: 'Vérifie le format d’un numéro de téléphone de Hong Kong à 8 chiffres, ou génère un exemple. Sur l’appareil.', input: 'Téléphone (8 chiffres)' },
  de: { title: 'Hongkong-Telefonnummer', desc: 'Prüft das Format einer 8-stelligen Hongkong-Telefonnummer oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Telefonnummer (8 Ziffern)' },
};

export default function HkPhoneTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateHkPhone}
      generate={generateHkPhone}
      placeholder="2345 6789"
      strings={{ input: t.input, ...c }}
    />
  );
}
