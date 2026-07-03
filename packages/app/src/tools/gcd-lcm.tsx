import { useState } from 'react';
import { gcd, lcm } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'GCD & LCM', desc: 'Greatest common divisor and least common multiple.', a: 'A', b: 'B', gcd: (n: number) => `GCD: ${n}`, lcm: (n: number) => `LCM: ${n}` },
  'zh-TW': { title: 'GCD 與 LCM', desc: '最大公因數與最小公倍數。', a: 'A', b: 'B', gcd: (n: number) => `GCD：${n}`, lcm: (n: number) => `LCM：${n}` },
};

export default function GcdLcmTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.a}</span><TextField type="number" value={a} onChange={(e) => setA(Number(e.target.value))} /></label>
      <label className="tool__field"><span>{t.b}</span><TextField type="number" value={b} onChange={(e) => setB(Number(e.target.value))} /></label>
      <p className="tool__hint"><strong>{t.gcd(gcd(a, b))}</strong></p>
      <p className="tool__hint"><strong>{t.lcm(lcm(a, b))}</strong></p>
    </ToolPage>
  );
}
