import { useState } from 'react';
import { deSeveranceTax, DE_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Germany severance tax', desc: 'Rough Abfindung tax using the one-fifth rule. Estimate only — not tax advice.', severance: 'Severance (€)', other: 'Other taxable (€ / year)', tax: 'Estimated tax', net: 'Net after tax' }, de: { title: 'Abfindung Steuer', desc: 'Grobe Abfindungssteuer nach Fünftelregelung. Nur Schätzung — keine Steuerberatung.', severance: 'Abfindung (€)', other: 'Sonstiges zvE (€ / Jahr)', tax: 'Steuer (Schätzung)', net: 'Netto' } };
const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [severance, setSeverance] = useState(50_000);
  const [other, setOther] = useState(40_000);
  const r = deSeveranceTax(severance, other);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{DE_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.severance}</span><TextField type="number" value={severance} onChange={(e) => setSeverance(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.other}</span><TextField type="number" value={other} onChange={(e) => setOther(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.estimatedTax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
      </div></div>
    </ToolPage>
  );
}
