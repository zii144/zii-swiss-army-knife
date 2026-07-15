import { useState } from 'react';
import { plTakeHome, PL_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Poland take-home pay","desc":"Estimate net after ZUS employee share and PIT brackets (2026 simplified). On-device — not KAS.","gross":"Annual gross (PLN)","net":"Net","pit":"PIT","zus":"ZUS"},
};
const num = (n: number) =>
  n.toLocaleString("pl-PL", { style: 'currency', currency: "PLN", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(80000);
  const r = plTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{PL_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.pit)}</span><span className="tool__stat-label">{t.pit}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.zus)}</span><span className="tool__stat-label">{t.zus}</span></div>
      </div></div>
    </ToolPage>
  );
}
