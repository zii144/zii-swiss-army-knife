import { validateUkPostcode, generateUkPostcode } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'UK postcode', desc: 'Check a UK postcode format (e.g. SW1A 1AA), or generate a sample. On-device.', input: 'Postcode' },
  'zh-TW': { title: '英國郵遞區號', desc: '檢查英國郵遞區號格式（例如 SW1A 1AA），或產生範例。於裝置上運算。', input: '郵遞區號' },
  'zh-HK': { title: '英國郵遞區號', desc: '檢查英國郵遞區號格式（例如 SW1A 1AA），或產生範例。於裝置上運算。', input: '郵遞區號' },
  ja: { title: '英国の郵便番号', desc: '英国の郵便番号形式（例：SW1A 1AA）を検証、またはサンプルを生成。端末上で動作。', input: '郵便番号' },
  ko: { title: '영국 우편번호', desc: '영국 우편번호 형식(예: SW1A 1AA)을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '우편번호' },
  es: { title: 'Código postal del Reino Unido', desc: 'Comprueba el formato de un código postal británico (p. ej. SW1A 1AA), o genera un ejemplo. En el dispositivo.', input: 'Código postal' },
  fr: { title: 'Code postal du Royaume-Uni', desc: 'Vérifie le format d’un code postal britannique (ex. SW1A 1AA), ou génère un exemple. Sur l’appareil.', input: 'Code postal' },
  de: { title: 'Britische Postleitzahl', desc: 'Prüft das Format einer britischen Postleitzahl (z. B. SW1A 1AA) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Postleitzahl' },
};

export default function UkPostcodeTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUkPostcode}
      generate={generateUkPostcode}
      placeholder="SW1A 1AA"
      strings={{ input: t.input, ...c }}
    />
  );
}
