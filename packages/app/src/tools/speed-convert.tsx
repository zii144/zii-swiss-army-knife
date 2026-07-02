import { useState } from 'react';
import { convert, type SpeedUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: SpeedUnit[] = ['kmh', 'mph', 'ms'];
const L = {
  en: { title: 'Speed converter', desc: 'Convert km/h, mph, and m/s on your device.', value: 'Value', from: 'From', to: 'To', result: (n: number) => `= ${n}` },
  'zh-TW': { title: '速度換算', desc: '換算 km/h、mph 與 m/s。', value: '數值', from: '從', to: '到', result: (n: number) => `= ${n}` },
};

export default function SpeedConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(100);
  const [from, setFrom] = useState<SpeedUnit>('kmh');
  const [to, setTo] = useState<SpeedUnit>('mph');
  const opts = UNITS.map((u) => ({ value: u, label: u }));
  let result: number | null = null;
  let error: string | null = null;
  try { result = convert(value, from, to); } catch (e) { error = e instanceof Error ? e.message : String(e); }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.value}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      <div className="tool__inline">
        <div className="tool__field"><span>{t.from}</span><Select value={from} options={opts} onChange={(v) => setFrom(v as SpeedUnit)} ariaLabel={t.from} /></div>
        <div className="tool__field"><span>{t.to}</span><Select value={to} options={opts} onChange={(v) => setTo(v as SpeedUnit)} ariaLabel={t.to} /></div>
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result !== null && !error ? <p className="tool__hint"><strong>{t.result(result)}</strong></p> : null}
    </ToolPage>
  );
}
