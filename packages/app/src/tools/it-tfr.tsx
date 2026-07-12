import { useState } from 'react';
import { itTfr, IT_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Italy TFR","desc":"Rough TFR (trattamento di fine rapporto) accrual. On-device — estimate only.","gross":"Annual gross (€)","years":"Years of service","tfr":"Estimated TFR"},
};
const num = (n: number) =>
  n.toLocaleString("it-IT", { style: 'currency', currency: "EUR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(30000);
  const [years, setYears] = useState(5);
  const r = { tfr: itTfr(gross, years) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{IT_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.years}</span><TextField type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.tfr)}</span><span className="tool__stat-label">{t.tfr}</span></div>
      </div></div>
    </ToolPage>
  );
}
