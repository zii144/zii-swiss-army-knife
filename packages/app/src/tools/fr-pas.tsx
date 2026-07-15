import { useState } from 'react';
import { frPasAmount, FR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'France PAS calculator', desc: 'Apply prélèvement à la source rate to net before tax. On-device.', net: 'Net before PAS (€)', rate: 'PAS rate (%)', amount: 'PAS amount', after: 'Net after PAS' }, fr: { title: 'Prélèvement à la source', desc: 'Appliquer le taux de PAS au net avant impôt. Local.', net: 'Net avant PAS (€)', rate: 'Taux PAS (%)', amount: 'Montant PAS', after: 'Net après PAS' } };
const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [net, setNet] = useState(2300);
  const [rate, setRate] = useState(8);
  const amount = frPasAmount(net, rate);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{FR_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.net}</span><TextField type="number" value={net} onChange={(e) => setNet(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.rate}</span><TextField type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(amount)}</span><span className="tool__stat-label">{t.amount}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(net - amount)}</span><span className="tool__stat-label">{t.after}</span></div>
      </div></div>
    </ToolPage>
  );
}
