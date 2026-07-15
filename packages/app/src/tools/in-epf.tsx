import { useState } from 'react';
import { inEpfEmployee, IN_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"India EPF","desc":"Estimate employee EPF at 12% on wages capped at ₹15,000/month. On-device.","gross":"Annual gross (₹)","epf":"Employee EPF / year"},
};
const num = (n: number) =>
  n.toLocaleString("en-IN", { style: 'currency', currency: "INR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(900000);
  const r = { epf: inEpfEmployee(gross) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{IN_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.epf)}</span><span className="tool__stat-label">{t.epf}</span></div>
      </div></div>
    </ToolPage>
  );
}
