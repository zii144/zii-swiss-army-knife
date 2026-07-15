import { useState } from 'react';
import { esVacationDays, ES_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Spain vacation days","desc":"Statutory minimum vacation (30 calendar days). On-device.","fullTime":"Full-time","days":"Vacation days"},
  es: {"title":"Vacaciones","desc":"Mínimo legal (30 días naturales). Local.","fullTime":"Jornada completa","days":"Días de vacaciones"},
};
export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [fullTime, setFullTime] = useState(true);
  const r = { days: esVacationDays(fullTime) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{ES_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__check"><input type="checkbox" checked={fullTime} onChange={() => setFullTime((v) => !v)} />{t.fullTime}</label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{r.days}</span><span className="tool__stat-label">{t.days}</span></div>
      </div></div>
    </ToolPage>
  );
}
