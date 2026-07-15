import { useState } from 'react';
import { sgTakeHome, SG_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Singapore take-home pay","desc":"Estimate net after employee CPF (~20% capped) and resident income tax (2026). On-device — not IRAS.","gross":"Annual gross (S$)","net":"Net","tax":"Income tax","cpf":"CPF employee"},
};
const num = (n: number) =>
  n.toLocaleString("en-SG", { style: 'currency', currency: "SGD", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(60000);
  const r = sgTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{SG_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.incomeTax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.cpfEmployee)}</span><span className="tool__stat-label">{t.cpf}</span></div>
      </div></div>
    </ToolPage>
  );
}
