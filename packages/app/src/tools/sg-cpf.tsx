import { useState } from 'react';
import { sgCpf, SG_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Singapore CPF","desc":"Estimate employee (~20%) and employer (~17%) CPF on ordinary wages (capped). On-device.","gross":"Annual gross (S$)","employee":"Employee","employer":"Employer","total":"Total"},
};
const num = (n: number) =>
  n.toLocaleString("en-SG", { style: 'currency', currency: "SGD", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(60000);
  const r = sgCpf(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{SG_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.employee)}</span><span className="tool__stat-label">{t.employee}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.employer)}</span><span className="tool__stat-label">{t.employer}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.total)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
