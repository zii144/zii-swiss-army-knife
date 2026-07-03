import { useState } from 'react';
import { convert, type LengthUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: LengthUnit[] = ['m', 'km', 'mi', 'ft', 'in', 'yd'];

const L = {
  en: { title: 'Length converter', desc: 'Convert metres, kilometres, miles, feet, and more.', value: 'Value', from: 'From', to: 'To' },
  'zh-TW': { title: '長度換算', desc: '換算公尺、公里、英里、英尺等。', value: '數值', from: '從', to: '到' },
};

export default function LengthConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<LengthUnit>('m');
  const [to, setTo] = useState<LengthUnit>('ft');
  const opts = UNITS.map((u) => ({ value: u, label: u }));
  let result: number | null = null;
  let error: string | null = null;
  try { result = convert(value, from, to); } catch (e) { error = e instanceof Error ? e.message : String(e); }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.value}</span><TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
      <div className="tool__inline">
        <div className="tool__field"><span>{t.from}</span><Select value={from} options={opts} onChange={(v) => setFrom(v as LengthUnit)} ariaLabel={t.from} /></div>
        <div className="tool__field"><span>{t.to}</span><Select value={to} options={opts} onChange={(v) => setTo(v as LengthUnit)} ariaLabel={t.to} /></div>
      </div>
      {error ? <p className="tool__error">{error}</p> : result !== null ? <p className="tool__hint"><strong>{value} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}</strong></p> : null}
    </ToolPage>
  );
}
