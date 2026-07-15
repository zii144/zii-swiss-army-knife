import { useState } from 'react';
import { koAnnualLeaveDays, koAnnualLeavePay, KO_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Korea annual leave', desc: 'Estimate 연차 days (Labor Standards Act §60) and pay for unused days. On-device.', years: 'Years of service', unused: 'Unused days', daily: 'Daily ordinary wage (₩)', days: 'Entitled days', pay: 'Leave pay' }, ko: { title: '연차·연차수당', desc: '근로기준법 제60조 기준 연차 일수와 미사용 수당. 단말기 계산.', years: '근속연수', unused: '미사용 일수', daily: '1일 통상임금 (원)', days: '발생 일수', pay: '연차수당' } };
const won = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [years, setYears] = useState(3);
  const [unused, setUnused] = useState(5);
  const [daily, setDaily] = useState(140_000);
  const days = koAnnualLeaveDays(years);
  const pay = koAnnualLeavePay(daily, unused);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{KO_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.years}</span><TextField type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.unused}</span><TextField type="number" value={unused} onChange={(e) => setUnused(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.daily}</span><TextField type="number" value={daily} onChange={(e) => setDaily(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{days}</span><span className="tool__stat-label">{t.days}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(pay)}</span><span className="tool__stat-label">{t.pay}</span></div>
      </div></div>
    </ToolPage>
  );
}
