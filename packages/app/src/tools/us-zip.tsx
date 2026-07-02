import { validateUsZip, generateUsZip } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'US ZIP code', desc: 'Check a US ZIP or ZIP+4 code format, or generate a sample. On-device.', input: 'ZIP (12345 or 12345-6789)' },
  'zh-TW': { title: '美國郵遞區號 (ZIP)', desc: '檢查美國 ZIP 或 ZIP+4 格式，或產生範例。於裝置上運算。', input: 'ZIP（12345 或 12345-6789）' },
  'zh-HK': { title: '美國郵遞區號 (ZIP)', desc: '檢查美國 ZIP 或 ZIP+4 格式，或產生範例。於裝置上運算。', input: 'ZIP（12345 或 12345-6789）' },
  ja: { title: '米国 ZIP コード', desc: '米国 ZIP または ZIP+4 の形式を検証、またはサンプルを生成。端末上で動作。', input: 'ZIP（12345 または 12345-6789）' },
  ko: { title: '미국 우편번호 (ZIP)', desc: '미국 ZIP 또는 ZIP+4 형식을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: 'ZIP (12345 또는 12345-6789)' },
  es: { title: 'Código ZIP de EE. UU.', desc: 'Comprueba el formato de un código ZIP o ZIP+4 de EE. UU., o genera un ejemplo. En el dispositivo.', input: 'ZIP (12345 o 12345-6789)' },
  fr: { title: 'Code ZIP (USA)', desc: 'Vérifie le format d’un code ZIP ou ZIP+4 américain, ou génère un exemple. Sur l’appareil.', input: 'ZIP (12345 ou 12345-6789)' },
  de: { title: 'US-ZIP-Code', desc: 'Prüft das Format eines US-ZIP- oder ZIP+4-Codes oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'ZIP (12345 oder 12345-6789)' },
};

export default function UsZipTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUsZip}
      generate={generateUsZip}
      placeholder="90210"
      strings={{ input: t.input, ...c }}
    />
  );
}
