import { validateUsRouting, generateUsRouting } from '../lib/regionkit';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'US bank routing number (ABA)', desc: 'Validate a US ABA routing transit number (weighted mod-10 checksum), or generate a sample. On-device.', input: 'Routing number (9 digits)' },
  'zh-TW': { title: '美國銀行路由號碼 (ABA)', desc: '驗證美國 ABA 路由號碼（加權 mod-10 檢查碼），或產生範例。於裝置上運算。', input: '路由號碼（9 碼）' },
  'zh-HK': { title: '美國銀行路由號碼 (ABA)', desc: '驗證美國 ABA 路由號碼（加權 mod-10 檢查碼），或產生範例。於裝置上運算。', input: '路由號碼（9 碼）' },
  ja: { title: '米国銀行ルーティング番号 (ABA)', desc: '米国 ABA ルーティング番号（加重 mod-10 チェックサム）を検証、またはサンプルを生成。端末上で動作。', input: 'ルーティング番号（9桁）' },
  ko: { title: '미국 은행 라우팅 번호 (ABA)', desc: '미국 ABA 라우팅 번호(가중 mod-10 체크섬)를 검증하거나 샘플을 생성합니다. 기기에서 실행.', input: '라우팅 번호 (9자리)' },
  es: { title: 'Número de ruta bancaria (ABA, EE. UU.)', desc: 'Valida un número de ruta ABA de EE. UU. (suma de control mod-10 ponderada), o genera un ejemplo. En el dispositivo.', input: 'Número de ruta (9 dígitos)' },
  fr: { title: 'Numéro de routage bancaire (ABA, USA)', desc: 'Valide un numéro de routage ABA américain (somme de contrôle mod-10 pondérée), ou génère un exemple. Sur l’appareil.', input: 'Numéro de routage (9 chiffres)' },
  de: { title: 'US-Bankleitzahl (ABA)', desc: 'Validiert eine US-ABA-Routing-Nummer (gewichtete Mod-10-Prüfsumme) oder erzeugt ein Beispiel. Auf dem Gerät.', input: 'Routing-Nummer (9 Ziffern)' },
};

export default function UsRoutingTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateUsRouting}
      generate={generateUsRouting}
      placeholder="021000021"
      strings={{ input: t.input, ...c }}
    />
  );
}
