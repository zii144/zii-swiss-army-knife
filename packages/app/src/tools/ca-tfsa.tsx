import { useState } from 'react';
import { caTfsaRoom, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canada TFSA room',
    desc: 'Estimate remaining TFSA contribution room from unused room and activity. On-device.',
    unused: 'Unused room (CAD)',
    contrib: 'Contributions this year',
    withdraw: 'Withdrawals last year',
    room: 'Estimated room',
    limit: 'Annual limit',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [unused, setUnused] = useState(20_000);
  const [contrib, setContrib] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const r = caTfsaRoom({ unusedRoom: unused, contributionsThisYear: contrib, withdrawalsLastYear: withdraw });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.unused}</span><TextField type="number" value={unused} onChange={(e) => setUnused(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.contrib}</span><TextField type="number" value={contrib} onChange={(e) => setContrib(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.withdraw}</span><TextField type="number" value={withdraw} onChange={(e) => setWithdraw(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.room)}</span><span className="tool__stat-label">{t.room}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.annualLimit)}</span><span className="tool__stat-label">{t.limit}</span></div>
      </div></div>
    </ToolPage>
  );
}
