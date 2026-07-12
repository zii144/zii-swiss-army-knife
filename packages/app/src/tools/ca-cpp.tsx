import { useState } from 'react';
import { caCppEmployee, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canada CPP',
    desc: 'Estimate CPP + CPP2 employee contributions (2026). On-device.',
    earnings: 'Pensionable earnings (CAD)',
    cpp: 'CPP',
    cpp2: 'CPP2',
    total: 'Total',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [earnings, setEarnings] = useState(70_000);
  const r = caCppEmployee(earnings);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <label className="tool__field"><span>{t.earnings}</span><TextField type="number" value={earnings} onChange={(e) => setEarnings(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.cpp)}</span><span className="tool__stat-label">{t.cpp}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.cpp2)}</span><span className="tool__stat-label">{t.cpp2}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.total)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
