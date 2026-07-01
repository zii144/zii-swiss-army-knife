import { useState } from 'react';
import { convertBase } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const BASES = [
  { value: '2', label: 'Binary (2)' },
  { value: '8', label: 'Octal (8)' },
  { value: '10', label: 'Decimal (10)' },
  { value: '16', label: 'Hex (16)' },
];

const L = {
  en: {
    title: 'Number base converter',
    desc: 'Convert integers between binary, octal, decimal and hexadecimal. On-device.',
    value: 'Value',
    from: 'From base',
    to: 'To base',
    result: 'Result',
  },
  'zh-TW': {
    title: '進位轉換',
    desc: '在二進位、八進位、十進位與十六進位之間轉換整數，於裝置上運算。',
    value: '數值',
    from: '來源進位',
    to: '目標進位',
    result: '結果',
  },
};

export default function BaseConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [value, setValue] = useState('255');
  const [from, setFrom] = useState('10');
  const [to, setTo] = useState('16');

  let result = '';
  let error: string | null = null;
  try {
    result = value.trim() ? convertBase(value, Number(from), Number(to)) : '';
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.value}</span>
        <TextField type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <div className="tool__inline">
        <div className="tool__field">
          <span>{t.from}</span>
          <Select value={from} options={BASES} onChange={setFrom} ariaLabel={t.from} />
        </div>
        <div className="tool__field">
          <span>{t.to}</span>
          <Select value={to} options={BASES} onChange={setTo} ariaLabel={t.to} />
        </div>
      </div>
      {error ? (
        <p className="tool__error">{error}</p>
      ) : result ? (
        <div className="tool__result">
          <p>
            {t.result}:{' '}
            <code className="tool__row-value tool__row-value--mono" style={{ fontSize: '1.1rem' }}>
              {result}
            </code>
          </p>
        </div>
      ) : null}
    </ToolPage>
  );
}
