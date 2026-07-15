import { useState } from 'react';
import { mxTakeHome, MX_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Mexico take-home pay","desc":"Estimate net after IMSS employee share and ISR brackets (2026 simplified). On-device — not SAT.","gross":"Annual gross (MXN)","net":"Net","isr":"ISR","imss":"IMSS"},
};
const num = (n: number) =>
  n.toLocaleString("es-MX", { style: 'currency', currency: "MXN", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(240000);
  const r = mxTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{MX_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.isr)}</span><span className="tool__stat-label">{t.isr}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.imss)}</span><span className="tool__stat-label">{t.imss}</span></div>
      </div></div>
    </ToolPage>
  );
}
