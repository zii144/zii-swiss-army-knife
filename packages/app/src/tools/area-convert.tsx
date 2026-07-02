import { useState } from 'react';
import { convert, type AreaUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: AreaUnit[] = ['m2', 'ft2', 'acre', 'ha'];
const L = {
  en: { title: 'Area converter', desc: 'Convert square metres, square feet, acres and hectares.', value: 'Value', from: 'From', to: 'To', result: (n: number) => `= ${n}` },
  'zh-TW': { title: '面積換算', desc: '換算平方公尺、平方英尺、英畝與公頃。', value: '數值', from: '從', to: '到', result: (n: number) => `= ${n}` },
};

export default function AreaConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<AreaUnit>('m2');
  const [to, setTo] = useState<AreaUnit>('ft2');
  const opts = UNITS.map((u) => ({ value: u, label: u }));
  let result: number | null = null;
  let error: string | null = null;
  try { result = convert(value, from, to); } catch (e) { error = e instanceof Error ? e.message : String(e); }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.value}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      <div className="tool__inline">
        <div className="tool__field"><span>{t.from}</span><Select value={from} options={opts} onChange={(v) => setFrom(v as AreaUnit)} ariaLabel={t.from} /></div>
        <div className="tool__field"><span>{t.to}</span><Select value={to} options={opts} onChange={(v) => setTo(v as AreaUnit)} ariaLabel={t.to} /></div>
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result !== null && !error ? <p className="tool__hint"><strong>{t.result(result)}</strong></p> : null}
    </ToolPage>
  );
}
