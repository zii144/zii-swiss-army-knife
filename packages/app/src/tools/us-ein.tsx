import { validateUsEin, generateUsEin } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'US Employer ID Number (EIN)', desc: 'Check a US EIN format and IRS prefix, or generate a sample. On-device.', input: 'EIN (XX-XXXXXXX)' },
  'zh-TW': { title: '美國雇主識別號 (EIN)', desc: '檢查美國 EIN 格式與 IRS 前綴，或產生範例。於裝置上運算。', input: 'EIN（XX-XXXXXXX）' },
  'zh-HK': { title: '美國雇主識別號 (EIN)', desc: '檢查美國 EIN 格式與 IRS 前綴，或產生範例。於裝置上運算。', input: 'EIN（XX-XXXXXXX）' },
  ja: { title: '米国雇用者番号 (EIN)', desc: '米国 EIN の形式と IRS プレフィックスを検証、またはサンプルを生成。端末上で動作。', input: 'EIN（XX-XXXXXXX）' },
  ko: { title: '미국 고용주 식별번호 (EIN)', desc: '미국 EIN 형식과 IRS 접두어를 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: 'EIN (XX-XXXXXXX)' },
  es: { title: 'Número de empleador (EIN, EE. UU.)', desc: 'Comprueba el formato y el prefijo IRS de un EIN de EE. UU., o genera un ejemplo. En el dispositivo.', input: 'EIN (XX-XXXXXXX)' },
  fr: { title: 'Numéro d’employeur (EIN, USA)', desc: 'Vérifie le format et le préfixe IRS d’un EIN américain, ou génère un exemple. Sur l’appareil.', input: 'EIN (XX-XXXXXXX)' },
  de: { title: 'US-Arbeitgebernummer (EIN)', desc: 'Prüft Format und IRS-Präfix einer US-EIN oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'EIN (XX-XXXXXXX)' },
};

export default function UsEinTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUsEin}
      generate={generateUsEin}
      placeholder="12-3456789"
      strings={{ input: t.input, ...c }}
    />
  );
}
