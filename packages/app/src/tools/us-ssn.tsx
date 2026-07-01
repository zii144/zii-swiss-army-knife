import { validateUsSsn, generateUsSsn } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'US Social Security Number', desc: 'Check that a US SSN is structurally valid (format and reserved ranges), or generate a sample. On-device.', input: 'SSN (AAA-GG-SSSS)' },
  'zh-TW': { title: '美國社會安全碼 (SSN)', desc: '檢查美國 SSN 的格式與保留範圍是否有效，或產生範例。於裝置上運算。', input: 'SSN（AAA-GG-SSSS）' },
  'zh-HK': { title: '美國社會安全號碼 (SSN)', desc: '檢查美國 SSN 的格式與保留範圍是否有效，或產生範例。於裝置上運算。', input: 'SSN（AAA-GG-SSSS）' },
  ja: { title: '米国社会保障番号 (SSN)', desc: '米国 SSN の形式と予約範囲が有効か検証、またはサンプルを生成。端末上で動作。', input: 'SSN（AAA-GG-SSSS）' },
  ko: { title: '미국 사회보장번호 (SSN)', desc: '미국 SSN의 형식과 예약 범위가 유효한지 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: 'SSN (AAA-GG-SSSS)' },
  es: { title: 'Número de Seguro Social de EE. UU.', desc: 'Comprueba si un SSN de EE. UU. tiene un formato y rangos válidos, o genera un ejemplo. En el dispositivo.', input: 'SSN (AAA-GG-SSSS)' },
  fr: { title: 'Numéro de sécurité sociale (USA)', desc: 'Vérifie la validité du format et des plages d’un SSN américain, ou génère un exemple. Sur l’appareil.', input: 'SSN (AAA-GG-SSSS)' },
  de: { title: 'US-Sozialversicherungsnummer (SSN)', desc: 'Prüft Format und reservierte Bereiche einer US-SSN oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'SSN (AAA-GG-SSSS)' },
};

export default function UsSsnTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUsSsn}
      generate={generateUsSsn}
      placeholder="123-45-6789"
      strings={{ input: t.input, ...c }}
    />
  );
}
