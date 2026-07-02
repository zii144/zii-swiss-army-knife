import { useState } from 'react';
import { convert, type EnergyUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: EnergyUnit[] = ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'BTU'];

const L = {
  en: { title: 'Energy converter', desc: 'Convert joules, calories, watt-hours, and BTU.', value: 'Value', from: 'From', to: 'To' },
  'zh-TW': { title: '能量換算', desc: '換算焦耳、卡路里、瓦時與 BTU。', value: '數值', from: '從', to: '到' },
};

export default function EnergyConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<EnergyUnit>('kWh');
  const [to, setTo] = useState<EnergyUnit>('J');
  const opts = UNITS.map((u) => ({ value: u, label: u }));

  let result: number | null = null;
  let error: string | null = null;
  try {
    result = convert(value, from, to);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.value}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      <div className="tool__inline">
        <div className="tool__field"><span>{t.from}</span><Select value={from} options={opts} onChange={(v) => setFrom(v as EnergyUnit)} ariaLabel={t.from} /></div>
        <div className="tool__field"><span>{t.to}</span><Select value={to} options={opts} onChange={(v) => setTo(v as EnergyUnit)} ariaLabel={t.to} /></div>
      </div>
      {error ? <p className="tool__error">{error}</p> : result !== null ? (
        <p className="tool__hint"><strong>{value} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}</strong></p>
      ) : null}
    </ToolPage>
  );
}
