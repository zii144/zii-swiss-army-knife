import { useState } from 'react';
import { luhnValid, validateIban, validateAbaRouting } from '@zii/id';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'luhn' | 'iban' | 'aba';

const VALIDATORS: Record<Mode, (v: string) => boolean> = {
  luhn: luhnValid,
  iban: validateIban,
  aba: validateAbaRouting,
};

const L = {
  en: {
    title: 'Checksum validator',
    desc: 'Check a credit-card number (Luhn), IBAN, or US ABA routing number. On-device.',
    mode: 'Type',
    luhn: 'Credit card (Luhn)',
    iban: 'IBAN',
    aba: 'ABA routing (US)',
    input: 'Number',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
  },
  'zh-TW': {
    title: '檢查碼驗證',
    desc: '驗證信用卡號（Luhn）、IBAN 或美國 ABA 銀行代碼，於裝置上處理。',
    mode: '類型',
    luhn: '信用卡（Luhn）',
    iban: 'IBAN',
    aba: 'ABA 代碼（美國）',
    input: '號碼',
    valid: '有效 ✓',
    invalid: '無效 ✗',
  },
};

export default function ChecksumValidateTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('luhn');
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const ok = trimmed ? VALIDATORS[mode](trimmed) : null;

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
            { value: 'luhn', label: t.luhn },
            { value: 'iban', label: t.iban },
            { value: 'aba', label: t.aba },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextField type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      {ok !== null ? (
        <div className="tool__result">
          <span
            className="app__badge"
            style={
              ok
                ? undefined
                : { background: '#f7c1c1', color: '#791f1f' }
            }
          >
            {ok ? t.valid : t.invalid}
          </span>
        </div>
      ) : null}
    </ToolPage>
  );
}
