import { useState } from 'react';
import { deTakeHome, DE_2026, type DeTaxClass } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Germany take-home (Brutto-Netto)', desc: 'Estimate Netto from Brutto with Steuerklasse, KV-Zusatz and optional Kirchensteuer (2026 simplified). On-device — not BMF.', gross: 'Monthly gross (€)', taxClass: 'Tax class', zusatz: 'KV Zusatz (%)', church: 'Church tax', yes: 'Yes', no: 'No', net: 'Netto', wageTax: 'Lohnsteuer', social: 'Social total' }, de: { title: 'Brutto-Netto-Rechner', desc: 'Nettogehalt aus Brutto mit Steuerklasse, KV-Zusatzbeitrag und optionaler Kirchensteuer (2026, vereinfacht). Lokal — kein BMF.', gross: 'Brutto / Monat (€)', taxClass: 'Steuerklasse', zusatz: 'KV-Zusatz (%)', church: 'Kirchensteuer', yes: 'Ja', no: 'Nein', net: 'Netto', wageTax: 'Lohnsteuer', social: 'SV gesamt' } };
const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(4000);
  const [taxClass, setTaxClass] = useState('1');
  const [zusatz, setZusatz] = useState(2.9);
  const [church, setChurch] = useState('yes');
  const r = deTakeHome(gross, { taxClass: Number(taxClass) as DeTaxClass, zusatz: zusatz / 100, church: church === 'yes' });
  const social = r.pension + r.unemployment + r.health + r.care;
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{DE_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.taxClass}</span><Select value={taxClass} onChange={setTaxClass} options={[1,2,3,4,5,6].map((n) => ({ value: String(n), label: String(n) }))} ariaLabel={t.taxClass} /></label>
        <label className="tool__field"><span>{t.zusatz}</span><TextField type="number" value={zusatz} onChange={(e) => setZusatz(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.church}</span><Select value={church} onChange={setChurch} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} ariaLabel={t.church} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(r.wageTax)}</span><span className="tool__stat-label">{t.wageTax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{eur(social)}</span><span className="tool__stat-label">{t.social}</span></div>
      </div></div>
    </ToolPage>
  );
}
