import { useState } from 'react';
import { deIncomeTaxAnnual, DE_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Germany income tax', desc: 'Rough Einkommensteuer on taxable annual income (2026 simplified brackets). On-device.', taxable: 'Taxable income (€ / year)', tax: 'Estimated tax' }, de: { title: 'Einkommensteuer', desc: 'Vereinfachte Einkommensteuer auf zu versteuerndes Einkommen (2026). Lokal.', taxable: 'zvE (€ / Jahr)', tax: 'Steuer (Schätzung)' } };
const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [taxable, setTaxable] = useState(50_000);
  const tax = deIncomeTaxAnnual(taxable);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{DE_2026.label}</span>
      <label className="tool__field"><span>{t.taxable}</span><TextField type="number" value={taxable} onChange={(e) => setTaxable(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
      </div></div>
    </ToolPage>
  );
}
