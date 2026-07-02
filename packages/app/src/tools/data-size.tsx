import { useState } from 'react';
import { convert, type DataUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const UNITS: DataUnit[] = ['B', 'KB', 'MB', 'GB', 'KiB', 'MiB', 'GiB'];

const L = {
  en: {
    title: 'Data size converter',
    desc: 'Convert bytes using decimal (KB/MB/GB) or binary (KiB/MiB/GiB) prefixes.',
    value: 'Value',
    from: 'From',
    to: 'To',
    result: (n: number) => `= ${n}`,
  },
  'zh-TW': {
    title: '資料大小換算',
    desc: '以十進位（KB/MB/GB）或二進位（KiB/MiB/GiB）換算位元組大小。',
    value: '數值',
    from: '從',
    to: '到',
    result: (n: number) => `= ${n}`,
  },
};

export default function DataSizeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<DataUnit>('MiB');
  const [to, setTo] = useState<DataUnit>('MB');

  const unitOptions = UNITS.map((u) => ({ value: u, label: u }));

  let result: number | null = null;
  let error: string | null = null;
  try {
    result = convert(value, from, to);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field">
        <span>{t.value}</span>
        <TextField type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </label>
      <div className="tool__inline">
        <div className="tool__field">
          <span>{t.from}</span>
          <Select value={from} options={unitOptions} onChange={(v) => setFrom(v as DataUnit)} ariaLabel={t.from} />
        </div>
        <div className="tool__field">
          <span>{t.to}</span>
          <Select value={to} options={unitOptions} onChange={(v) => setTo(v as DataUnit)} ariaLabel={t.to} />
        </div>
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result !== null && !error ? (
        <p className="tool__hint">
          <strong>{t.result(result)}</strong>
        </p>
      ) : null}
    </ToolPage>
  );
}
