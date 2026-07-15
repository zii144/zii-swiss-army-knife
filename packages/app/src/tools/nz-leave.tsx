import { useState } from 'react';
import { nzLeaveDays, NZ_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"New Zealand annual leave","desc":"Statutory minimum annual leave (4 weeks / 20 days). On-device.","fullTime":"Full-time","days":"Days"},
};
export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [fullTime, setFullTime] = useState(true);
  const r = { days: nzLeaveDays(fullTime) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{NZ_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__check"><input type="checkbox" checked={fullTime} onChange={() => setFullTime((v) => !v)} />{t.fullTime}</label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{r.days}</span><span className="tool__stat-label">{t.days}</span></div>
      </div></div>
    </ToolPage>
  );
}
