import { useState } from 'react';
import { mxImssEmployee, MX_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Mexico IMSS","desc":"Estimate employee IMSS share (~2.75% simplified). On-device.","input":"Annual gross (MXN)","out":"Employee IMSS"},
};
const num = (n: number) =>
  n.toLocaleString("es-MX", { style: 'currency', currency: "MXN", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(240000);
  const r = { out: mxImssEmployee(value) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{MX_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.input}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.out)}</span><span className="tool__stat-label">{t.out}</span></div>
      </div></div>
    </ToolPage>
  );
}
