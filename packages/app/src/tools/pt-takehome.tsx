import { useState } from 'react';
import { ptTakeHome, PT_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Portugal take-home pay","desc":"Estimate net after employee SS (~11%) and IRS brackets (2026). On-device — not AT.","gross":"Annual gross (€)","net":"Net","irs":"IRS","ss":"SS"},
};
const num = (n: number) =>
  n.toLocaleString("pt-PT", { style: 'currency', currency: "EUR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(25000);
  const r = ptTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{PT_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.irs)}</span><span className="tool__stat-label">{t.irs}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.ss)}</span><span className="tool__stat-label">{t.ss}</span></div>
      </div></div>
    </ToolPage>
  );
}
