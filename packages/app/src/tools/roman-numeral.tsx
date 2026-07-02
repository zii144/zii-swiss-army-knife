import { useState } from 'react';
import { toRoman, fromRoman } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'to' | 'from';

const L = {
  en: {
    title: 'Roman numerals',
    desc: 'Convert integers 1–3999 to Roman numerals and back on your device.',
    mode: 'Direction',
    toRoman: 'Number → Roman',
    fromRoman: 'Roman → Number',
    input: 'Input',
    convert: 'Convert',
    output: 'Result',
    invalid: 'Invalid input',
  },
  'zh-TW': {
    title: '羅馬數字',
    desc: '在裝置上將 1–3999 的整數與羅馬數字互相轉換。',
    mode: '方向',
    toRoman: '數字 → 羅馬',
    fromRoman: '羅馬 → 數字',
    input: '輸入',
    convert: '轉換',
    output: '結果',
    invalid: '輸入無效',
  },
};

export default function RomanNumeralTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('to');
  const [input, setInput] = useState('2024');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      if (mode === 'to') {
        const n = Number(input);
        if (!Number.isInteger(n)) throw new Error('integer required');
        setOutput(toRoman(n));
      } else {
        setOutput(String(fromRoman(input)));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__field">
        <span>{t.mode}</span>
        <Select
          value={mode}
          options={[
            { value: 'to', label: t.toRoman },
            { value: 'from', label: t.fromRoman },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextField value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.convert}
        </Button>
      </div>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {output ? (
        <div className="tool__result">
          <p>
            <strong>{output}</strong>
          </p>
        </div>
      ) : null}
    </ToolPage>
  );
}
