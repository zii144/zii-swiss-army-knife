import { useState } from 'react';
import { auLeaveAccrual, AU_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Australia leave accrual', desc: 'Estimate annual leave value and personal leave days from Fair Work minimums. On-device.', salary: 'Annual salary (AUD)', years: 'Years worked', annualDays: 'Annual leave days', value: 'Leave value', personal: 'Personal leave days' } };
const money = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [salary, setSalary] = useState(80_000);
  const [years, setYears] = useState(1);
  const r = auLeaveAccrual(salary, years);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{AU_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.salary}</span><TextField type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.years}</span><TextField type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{r.annualLeaveDays}</span><span className="tool__stat-label">{t.annualDays}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.annualLeaveValue)}</span><span className="tool__stat-label">{t.value}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{r.personalLeaveDays}</span><span className="tool__stat-label">{t.personal}</span></div>
      </div></div>
    </ToolPage>
  );
}
