import { validateCorporateNumber, validateInvoiceNumber } from '@zii/id';
import { useState } from 'react';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'corp' | 'invoice';

const L = {
  en: {
    title: 'Japan Corporate / Invoice number',
    desc: 'Validate a Japanese Corporate Number (法人番号) or qualified Invoice number (T…). On-device.',
    mode: 'Type',
    corp: 'Corporate Number (法人番号)',
    invoice: 'Invoice Number (T…)',
    input: 'Number',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
  },
  'zh-TW': {
    title: '日本法人番號／發票番號',
    desc: '驗證日本法人番號（13 碼）或合格發票番號（T 開頭 14 碼）。於裝置上運算。',
    mode: '類型',
    corp: '法人番號（13 碼）',
    invoice: '發票番號（T…）',
    input: '號碼',
    valid: '有效 ✓',
    invalid: '無效 ✗',
  },
  ja: {
    title: '法人番号・インボイス番号検証',
    desc: '法人番号（13桁）または適格請求書発行事業者番号（T…）を検証。端末上で動作。',
    mode: '種類',
    corp: '法人番号（13桁）',
    invoice: 'インボイス番号（T…）',
    input: '番号',
    valid: '有効 ✓',
    invalid: '無効 ✗',
  },
};

export default function JpCorpNumberTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('corp');
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const ok = trimmed ? (mode === 'corp' ? validateCorporateNumber(trimmed) : validateInvoiceNumber(trimmed)) : null;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.mode}</span>
        <Select
          value={mode}
          options={[
            { value: 'corp', label: t.corp },
            { value: 'invoice', label: t.invoice },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextField
          type="text"
          value={value}
          placeholder={mode === 'corp' ? '1234567890123' : 'T1234567890123'}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      {ok !== null ? (
        <div className="tool__result">
          <span
            className="app__badge"
            style={ok ? undefined : { background: '#f7c1c1', color: '#791f1f' }}
          >
            {ok ? t.valid : t.invalid}
          </span>
        </div>
      ) : null}
    </ToolPage>
  );
}
