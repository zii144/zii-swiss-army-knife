import { useState } from 'react';
import { convert, type AngleUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: AngleUnit[] = ['deg', 'rad', 'grad'];

const L = {
  en: { title: 'Angle converter', desc: 'Convert degrees, radians, and gradians.', value: 'Value', from: 'From', to: 'To' },
  'zh-TW': { title: '角度換算', desc: '換算度、弧度與百分度。', value: '數值', from: '從', to: '到' },
};

export default function AngleConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(180);
  const [from, setFrom] = useState<AngleUnit>('deg');
  const [to, setTo] = useState<AngleUnit>('rad');
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
        <div className="tool__field"><span>{t.from}</span><Select value={from} options={opts} onChange={(v) => setFrom(v as AngleUnit)} ariaLabel={t.from} /></div>
        <div className="tool__field"><span>{t.to}</span><Select value={to} options={opts} onChange={(v) => setTo(v as AngleUnit)} ariaLabel={t.to} /></div>
      </div>
      {error ? <p className="tool__error">{error}</p> : result !== null ? (
        <p className="tool__hint"><strong>{value} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {to}</strong></p>
      ) : null}
    </ToolPage>
  );
}
