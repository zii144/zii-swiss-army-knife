import { useState } from 'react';
import { nzTakeHome, NZ_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"New Zealand take-home pay","desc":"Estimate net after KiwiSaver (3%) and PAYE brackets (2026 simplified). On-device — not IRD.","gross":"Annual gross (NZ$)","net":"Net","incomeTax":"PAYE","kiwiSaver":"KiwiSaver"},
};
const num = (n: number) =>
  n.toLocaleString("en-NZ", { style: 'currency', currency: "NZD", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(70000);
  const r = nzTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{NZ_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.incomeTax)}</span><span className="tool__stat-label">{t.incomeTax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.kiwiSaver)}</span><span className="tool__stat-label">{t.kiwiSaver}</span></div>
      </div></div>
    </ToolPage>
  );
}
