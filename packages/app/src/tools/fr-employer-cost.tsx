import { useState } from 'react';
import { frEmployerCost, FR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'France employer cost', desc: 'Approximate coût employeur (~42% charges patronales). On-device estimate.', brut: 'Monthly brut (€)', charges: 'Employer charges', total: 'Total cost' }, fr: { title: 'Coût employeur', desc: 'Estimation du coût employeur (~42 % charges patronales). Local.', brut: 'Brut mensuel (€)', charges: 'Charges patronales', total: 'Coût total' } };
const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [brut, setBrut] = useState(3000);
  const r = frEmployerCost(brut);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{FR_2026.label}</span>
      <label className="tool__field"><span>{t.brut}</span><TextField type="number" value={brut} onChange={(e) => setBrut(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.employerCharges)}</span><span className="tool__stat-label">{t.charges}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.totalCost)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
