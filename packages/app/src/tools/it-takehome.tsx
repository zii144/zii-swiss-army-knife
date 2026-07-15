import { useState } from 'react';
import { itTakeHome, IT_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Italy take-home pay","desc":"Estimate net after employee INPS (~9.19%) and IRPEF (2026). On-device — not Agenzia delle Entrate.","gross":"Annual gross (€)","net":"Netto","irpef":"IRPEF","inps":"INPS"},
  it: {"title":"Stipendio netto","desc":"Stima del netto dopo INPS e IRPEF (2026). Sul dispositivo.","gross":"Lordo annuo (€)","net":"Netto","irpef":"IRPEF","inps":"INPS"},
};
const num = (n: number) =>
  n.toLocaleString("it-IT", { style: 'currency', currency: "EUR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(30000);
  const r = itTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{IT_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.irpef)}</span><span className="tool__stat-label">{t.irpef}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.inps)}</span><span className="tool__stat-label">{t.inps}</span></div>
      </div></div>
    </ToolPage>
  );
}
