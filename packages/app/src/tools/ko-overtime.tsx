import { useState } from 'react';
import { koOvertimePay, KO_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Korea overtime pay', desc: 'Estimate 연장·야간·휴일 가산수당 (50%/50%/100%). On-device.', hourly: 'Hourly ordinary (₩)', weekday: 'Weekday OT hours', night: 'Night hours', holiday: 'Holiday hours', total: 'Total pay' }, ko: { title: '연장·야간·휴일 수당', desc: '연장 50%·야간 50%·휴일 100% 가산. 단말기 계산.', hourly: '통상시급 (원)', weekday: '연장 시간', night: '야간 시간', holiday: '휴일 시간', total: '수당 합계' } };
const won = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [hourly, setHourly] = useState(15_000);
  const [weekday, setWeekday] = useState(10);
  const [night, setNight] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const r = koOvertimePay(hourly, { weekday, night, holiday });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{KO_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.hourly}</span><TextField type="number" value={hourly} onChange={(e) => setHourly(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.weekday}</span><TextField type="number" value={weekday} onChange={(e) => setWeekday(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.night}</span><TextField type="number" value={night} onChange={(e) => setNight(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.holiday}</span><TextField type="number" value={holiday} onChange={(e) => setHoliday(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{won(r.total)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
