import { useState } from 'react';
import { plZusEmployee, PL_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"Poland ZUS","desc":"Estimate employee ZUS (~13.71% simplified). On-device.","input":"Annual gross (PLN)","out":"Employee ZUS"},
};
const num = (n: number) =>
  n.toLocaleString("pl-PL", { style: 'currency', currency: "PLN", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(80000);
  const r = { out: plZusEmployee(value) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{PL_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.input}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.out)}</span><span className="tool__stat-label">{t.out}</span></div>
      </div></div>
    </ToolPage>
  );
}
