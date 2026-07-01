import { validateTwMobile, generateTwMobile } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Taiwan mobile number', desc: 'Check a Taiwan mobile number format (09XXXXXXXX), or generate a sample. On-device.', input: 'Mobile number (09XXXXXXXX)' },
  'zh-TW': { title: '台灣手機號碼', desc: '檢查台灣手機號碼格式（09XXXXXXXX），或產生範例。於裝置上運算。', input: '手機號碼（09XXXXXXXX）' },
  'zh-HK': { title: '台灣手機號碼', desc: '檢查台灣手機號碼格式（09XXXXXXXX），或產生範例。於裝置上運算。', input: '手機號碼（09XXXXXXXX）' },
  ja: { title: '台湾の携帯電話番号', desc: '台湾の携帯番号形式（09XXXXXXXX）を検証、またはサンプルを生成。端末上で動作。', input: '携帯番号（09XXXXXXXX）' },
  ko: { title: '대만 휴대폰 번호', desc: '대만 휴대폰 번호 형식(09XXXXXXXX)을 확인하거나 샘플을 생성합니다. 기기에서 실행.', input: '휴대폰 번호 (09XXXXXXXX)' },
  es: { title: 'Número de móvil de Taiwán', desc: 'Comprueba el formato de un número de móvil de Taiwán (09XXXXXXXX), o genera un ejemplo. En el dispositivo.', input: 'Móvil (09XXXXXXXX)' },
  fr: { title: 'Numéro de mobile de Taïwan', desc: 'Vérifie le format d’un numéro de mobile taïwanais (09XXXXXXXX), ou génère un exemple. Sur l’appareil.', input: 'Mobile (09XXXXXXXX)' },
  de: { title: 'Taiwanische Handynummer', desc: 'Prüft das Format einer taiwanischen Handynummer (09XXXXXXXX) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Handynummer (09XXXXXXXX)' },
};

export default function TwMobileTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTwMobile}
      generate={generateTwMobile}
      placeholder="0912345678"
      strings={{ input: t.input, ...c }}
    />
  );
}
