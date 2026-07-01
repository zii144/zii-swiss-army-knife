import { validateJpPostal, generateJpPostal } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Japan postal code', desc: 'Check a Japanese postal code format (〒NNN-NNNN), or generate a sample. On-device.', input: 'Postal code (NNN-NNNN)' },
  'zh-TW': { title: '日本郵遞區號', desc: '檢查日本郵遞區號格式（〒NNN-NNNN），或產生範例。於裝置上運算。', input: '郵遞區號（NNN-NNNN）' },
  'zh-HK': { title: '日本郵遞區號', desc: '檢查日本郵遞區號格式（〒NNN-NNNN），或產生範例。於裝置上運算。', input: '郵遞區號（NNN-NNNN）' },
  ja: { title: '日本の郵便番号', desc: '郵便番号の形式（〒NNN-NNNN）を検証、またはサンプルを生成。端末上で動作。', input: '郵便番号（NNN-NNNN）' },
  ko: { title: '일본 우편번호', desc: '일본 우편번호 형식(〒NNN-NNNN)을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '우편번호 (NNN-NNNN)' },
  es: { title: 'Código postal de Japón', desc: 'Comprueba el formato de un código postal japonés (〒NNN-NNNN), o genera un ejemplo. En el dispositivo.', input: 'Código postal (NNN-NNNN)' },
  fr: { title: 'Code postal japonais', desc: 'Vérifie le format d’un code postal japonais (〒NNN-NNNN), ou génère un exemple. Sur l’appareil.', input: 'Code postal (NNN-NNNN)' },
  de: { title: 'Japanische Postleitzahl', desc: 'Prüft das Format einer japanischen Postleitzahl (〒NNN-NNNN) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Postleitzahl (NNN-NNNN)' },
};

export default function JpPostalTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateJpPostal}
      generate={generateJpPostal}
      placeholder="100-0001"
      strings={{ input: t.input, ...c }}
    />
  );
}
