import { useState } from 'react';
import { koSeverance, KO_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Korea severance (퇴직금)', desc: 'Estimate 퇴직금 = average daily wage × 30 × (service days ÷ 365). On-device.', daily: 'Average daily wage (₩)', days: 'Service days', amount: 'Severance' }, ko: { title: '퇴직금 계산', desc: '평균임금 × 30일 × (재직일수 ÷ 365). 단말기 계산.', daily: '1일 평균임금 (원)', days: '재직일수', amount: '퇴직금' } };
const won = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [daily, setDaily] = useState(150_000);
  const [days, setDays] = useState(365);
  const amount = koSeverance(daily, days);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{KO_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.daily}</span><TextField type="number" value={daily} onChange={(e) => setDaily(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.days}</span><TextField type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{won(amount)}</span><span className="tool__stat-label">{t.amount}</span></div>
      </div></div>
    </ToolPage>
  );
}
