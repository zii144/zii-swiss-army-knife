import { useState } from 'react';
import { FR_HOLIDAYS_2026, FR_HOLIDAYS_ALSACE_EXTRA, FR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'France public holidays', desc: 'Jours fériés 2026 (métropole). Optionally include Alsace-Moselle extras. On-device.', region: 'Region', metro: 'Métropole', alsace: 'Alsace-Moselle' }, fr: { title: 'Jours fériés', desc: 'Jours fériés 2026 (métropole), avec option Alsace-Moselle. Local.', region: 'Région', metro: 'Métropole', alsace: 'Alsace-Moselle' } };

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [region, setRegion] = useState('metro');
  const list = region === 'alsace' ? [...FR_HOLIDAYS_2026, ...FR_HOLIDAYS_ALSACE_EXTRA].sort((a, b) => a.date.localeCompare(b.date)) : FR_HOLIDAYS_2026;
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{FR_2026.label}</span>
      <label className="tool__field"><span>{t.region}</span><Select value={region} onChange={setRegion} options={[{ value: 'metro', label: t.metro }, { value: 'alsace', label: t.alsace }]} ariaLabel={t.region} /></label>
      <ul className="tool__list">{list.map((h) => <li key={h.date + h.name}><strong>{h.date}</strong> — {h.name}</li>)}</ul>
    </ToolPage>
  );
}
