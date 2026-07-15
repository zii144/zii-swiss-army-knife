import { useState } from 'react';
import { plVacationDays, PL_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Poland vacation days","desc":"Statutory vacation: 20 days (<10 years) or 26 days. On-device.","years":"Years of service","days":"Days"},
};
export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [years, setYears] = useState(5);
  const r = { days: plVacationDays(years) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{PL_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.years}</span><TextField type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{r.days}</span><span className="tool__stat-label">{t.days}</span></div>
      </div></div>
    </ToolPage>
  );
}
