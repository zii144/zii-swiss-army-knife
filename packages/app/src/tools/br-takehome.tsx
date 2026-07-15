import { useState } from 'react';
import { brTakeHome, BR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Brazil take-home pay","desc":"Estimate net after INSS and IRPF brackets (2026 simplified). On-device — not Receita.","gross":"Annual gross (R$)","net":"Net","irpf":"IRPF","inss":"INSS"},
};
const num = (n: number) =>
  n.toLocaleString("pt-BR", { style: 'currency', currency: "BRL", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(60000);
  const r = brTakeHome(gross);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{BR_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.irpf)}</span><span className="tool__stat-label">{t.irpf}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.inss)}</span><span className="tool__stat-label">{t.inss}</span></div>
      </div></div>
    </ToolPage>
  );
}
