import { validateUkSortCode, generateUkSortCode } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'UK bank sort code', desc: 'Check a UK sort code format (XX-XX-XX), or generate a sample. On-device.', input: 'Sort code (XX-XX-XX)' },
  'zh-TW': { title: '英國銀行分行代碼', desc: '檢查英國分行代碼格式（XX-XX-XX），或產生範例。於裝置上運算。', input: '分行代碼（XX-XX-XX）' },
  'zh-HK': { title: '英國銀行分行代碼', desc: '檢查英國分行代碼格式（XX-XX-XX），或產生範例。於裝置上運算。', input: '分行代碼（XX-XX-XX）' },
  ja: { title: '英国銀行ソートコード', desc: '英国のソートコード形式（XX-XX-XX）を検証、またはサンプルを生成。端末上で動作。', input: 'ソートコード（XX-XX-XX）' },
  ko: { title: '영국 은행 소트 코드', desc: '영국 소트 코드 형식(XX-XX-XX)을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '소트 코드 (XX-XX-XX)' },
  es: { title: 'Código bancario (sort code, Reino Unido)', desc: 'Comprueba el formato de un sort code británico (XX-XX-XX), o genera un ejemplo. En el dispositivo.', input: 'Sort code (XX-XX-XX)' },
  fr: { title: 'Code guichet bancaire (sort code, Royaume-Uni)', desc: 'Vérifie le format d’un sort code britannique (XX-XX-XX), ou génère un exemple. Sur l’appareil.', input: 'Sort code (XX-XX-XX)' },
  de: { title: 'Britische Bankleitzahl (Sort Code)', desc: 'Prüft das Format eines britischen Sort Codes (XX-XX-XX) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Sort Code (XX-XX-XX)' },
};

export default function UkSortCodeTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUkSortCode}
      generate={generateUkSortCode}
      placeholder="12-34-56"
      strings={{ input: t.input, ...c }}
    />
  );
}
