import { useState } from 'react';
import { deVacationDays, DE_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Germany vacation days', desc: 'Statutory minimum Urlaub (20 days at 5-day week) plus optional extra weeks. On-device.', full: 'Full-time', yes: 'Yes', no: 'No (half)', extra: 'Extra weeks', days: 'Vacation days' }, de: { title: 'Urlaubsanspruch', desc: 'Gesetzlicher Mindesturlaub (20 Tage bei 5-Tage-Woche) plus optionale Zusatzwochen. Lokal.', full: 'Vollzeit', yes: 'Ja', no: 'Nein (hälftig)', extra: 'Zusatzwochen', days: 'Urlaubstage' } };

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [full, setFull] = useState('yes');
  const [extra, setExtra] = useState(0);
  const days = deVacationDays(full === 'yes', extra);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{DE_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.full}</span><Select value={full} onChange={setFull} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} ariaLabel={t.full} /></label>
        <label className="tool__field"><span>{t.extra}</span><TextField type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{days}</span><span className="tool__stat-label">{t.days}</span></div>
      </div></div>
    </ToolPage>
  );
}
