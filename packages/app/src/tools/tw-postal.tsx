import { validateTwPostal, generateTwPostal } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Taiwan postal code', desc: 'Check a Taiwan postal code format (3, 3+2 or 3+3 digits), or generate a sample. On-device.', input: 'Postal code' },
  'zh-TW': { title: '台灣郵遞區號', desc: '檢查台灣郵遞區號格式（3 碼、3+2 或 3+3），或產生範例。於裝置上運算。', input: '郵遞區號' },
  'zh-HK': { title: '台灣郵遞區號', desc: '檢查台灣郵遞區號格式（3 碼、3+2 或 3+3），或產生範例。於裝置上運算。', input: '郵遞區號' },
  ja: { title: '台湾の郵便番号', desc: '台湾の郵便番号形式（3桁・3+2・3+3）を検証、またはサンプルを生成。端末上で動作。', input: '郵便番号' },
  ko: { title: '대만 우편번호', desc: '대만 우편번호 형식(3, 3+2, 3+3자리)을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '우편번호' },
  es: { title: 'Código postal de Taiwán', desc: 'Comprueba el formato de un código postal taiwanés (3, 3+2 o 3+3 dígitos), o genera un ejemplo. En el dispositivo.', input: 'Código postal' },
  fr: { title: 'Code postal de Taïwan', desc: 'Vérifie le format d’un code postal taïwanais (3, 3+2 ou 3+3 chiffres), ou génère un exemple. Sur l’appareil.', input: 'Code postal' },
  de: { title: 'Taiwanische Postleitzahl', desc: 'Prüft das Format einer taiwanischen Postleitzahl (3, 3+2 oder 3+3 Ziffern) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Postleitzahl' },
};

export default function TwPostalTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTwPostal}
      generate={generateTwPostal}
      placeholder="100058"
      strings={{ input: t.input, ...c }}
    />
  );
}
