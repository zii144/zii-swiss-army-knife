import { useState } from 'react';
import { esSsEmployee, ES_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Spain social security","desc":"Estimate employee Seguridad Social (~6.35% of gross). On-device.","gross":"Annual gross (€)","ss":"Employee SS"},
  es: {"title":"Seguridad Social","desc":"Cotización del trabajador (~6,35 %). Local.","gross":"Bruto anual (€)","ss":"SS trabajador"},
};
const num = (n: number) =>
  n.toLocaleString("es-ES", { style: 'currency', currency: "EUR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(30000);
  const r = { ss: esSsEmployee(gross) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{ES_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.ss)}</span><span className="tool__stat-label">{t.ss}</span></div>
      </div></div>
    </ToolPage>
  );
}
