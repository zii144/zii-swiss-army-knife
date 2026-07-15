import { useState } from 'react';
import { frBrutNet, FR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'France brut → net', desc: 'Estimate salaire net from brut (~22% cotisations) with optional PAS rate or taux neutre (2026). On-device — not URSSAF.', brut: 'Monthly brut (€)', pas: 'PAS rate % (blank = neutre)', netBefore: 'Net before PAS', pasAmt: 'PAS', netAfter: 'Net after PAS' }, fr: { title: 'Salaire brut / net', desc: 'Estimation du net depuis le brut (~22 % cotisations) avec PAS ou taux neutre (2026). Local — pas URSSAF officiel.', brut: 'Brut mensuel (€)', pas: 'Taux PAS % (vide = neutre)', netBefore: 'Net avant PAS', pasAmt: 'PAS', netAfter: 'Net après PAS' } };
const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [brut, setBrut] = useState(3000);
  const [pas, setPas] = useState('');
  const rate = pas === '' ? undefined : Number(pas) / 100;
  const r = frBrutNet(brut, rate);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{FR_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.brut}</span><TextField type="number" value={brut} onChange={(e) => setBrut(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.pas}</span><TextField value={pas} onChange={(e) => setPas(e.target.value)} placeholder="e.g. 8" /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.netBeforePas)}</span><span className="tool__stat-label">{t.netBefore}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.pas)}</span><span className="tool__stat-label">{t.pasAmt}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.netAfterPas)}</span><span className="tool__stat-label">{t.netAfter}</span></div>
      </div></div>
    </ToolPage>
  );
}
