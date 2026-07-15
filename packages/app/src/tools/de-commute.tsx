import { useState } from 'react';
import { deCommuteAllowance, DE_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Germany commute allowance', desc: 'Pendlerpauschale: €0.30/km for first 20 km, €0.38 beyond, per work day. On-device estimate.', km: 'One-way km', days: 'Work days / year', amount: 'Allowance' }, de: { title: 'Pendlerpauschale', desc: '0,30 €/km bis 20 km, danach 0,38 €/km je Arbeitstag. Lokale Schätzung.', km: 'Einfache Entfernung (km)', days: 'Arbeitstage / Jahr', amount: 'Pauschale' } };
const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [km, setKm] = useState(30);
  const [days, setDays] = useState(220);
  const amount = deCommuteAllowance(km, days);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{DE_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.km}</span><TextField type="number" value={km} onChange={(e) => setKm(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.days}</span><TextField type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(amount)}</span><span className="tool__stat-label">{t.amount}</span></div>
      </div></div>
    </ToolPage>
  );
}
