import { useState } from 'react';
import { unixToIso, isoToUnix, parseUnixTimestamp, nowUnix, type UnixUnit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'unix-to-iso' | 'iso-to-unix';

const L = {
  en: {
    title: 'Unix timestamp',
    desc: 'Convert between Unix timestamps and ISO 8601 dates.',
    mode: 'Direction',
    toIso: 'Unix → ISO',
    toUnix: 'ISO → Unix',
    unit: 'Unit',
    seconds: 'Seconds',
    milliseconds: 'Milliseconds',
    input: 'Input',
    output: 'Output',
    now: 'Use now',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Invalid input',
  },
  'zh-TW': {
    title: 'Unix 時間戳',
    desc: '在 Unix 時間戳與 ISO 8601 日期之間轉換。',
    mode: '方向',
    toIso: 'Unix → ISO',
    toUnix: 'ISO → Unix',
    unit: '單位',
    seconds: '秒',
    milliseconds: '毫秒',
    input: '輸入',
    output: '輸出',
    now: '使用現在',
    copy: '複製',
    copied: '已複製',
    error: '無效輸入',
  },
};

export default function TimestampConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('unix-to-iso');
  const [unit, setUnit] = useState<UnixUnit>('ms');
  const [input, setInput] = useState('0');
  const [copied, setCopied] = useState(false);

  let output = '';
  let error: string | null = null;
  try {
    if (mode === 'unix-to-iso') {
      const ms = unit === 'ms' ? parseUnixTimestamp(input, 'ms') : parseUnixTimestamp(input, 's') * 1000;
      output = unixToIso(ms, 'ms');
    } else {
      output = String(isoToUnix(input, unit));
    }
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'unix-to-iso', label: t.toIso }, { value: 'iso-to-unix', label: t.toUnix }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <Select value={unit} options={[{ value: 's', label: t.seconds }, { value: 'ms', label: t.milliseconds }]} onChange={(v) => setUnit(v as UnixUnit)} ariaLabel={t.unit} />
      <label className="tool__field"><span>{t.input}</span><TextField value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <Button variant="ghost" onClick={() => setInput(String(nowUnix(unit)))}>{t.now}</Button>
      {error ? <p className="tool__error">{error}</p> : (
        <>
          <label className="tool__field"><span>{t.output}</span><TextArea mono rows={2} value={output} readOnly /></label>
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </>
      )}
    </ToolPage>
  );
}
