import { useState } from 'react';
import { nlHolidayAllowance, NL_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Netherlands holiday allowance","desc":"Estimate statutory 8% holiday allowance (vakantiegeld). On-device.","gross":"Annual gross (€)","amount":"Vakantiegeld"},
};
const num = (n: number) =>
  n.toLocaleString("nl-NL", { style: 'currency', currency: "EUR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(40000);
  const r = { amount: nlHolidayAllowance(gross) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{NL_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.amount)}</span><span className="tool__stat-label">{t.amount}</span></div>
      </div></div>
    </ToolPage>
  );
}
