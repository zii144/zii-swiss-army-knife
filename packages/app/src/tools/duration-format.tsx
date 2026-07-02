import { useState } from 'react';
import { formatDuration, parseDuration } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'format' | 'parse';

const L = {
  en: { title: 'Duration format', desc: 'Convert seconds to M:SS / H:MM:SS and back.', mode: 'Direction', format: 'Seconds → duration', parse: 'Duration → seconds', input: 'Input', output: 'Output', copy: 'Copy', copied: 'Copied', error: 'Invalid input' },
  'zh-TW': { title: '時間長度格式', desc: '在秒數與 M:SS / H:MM:SS 之間轉換。', mode: '方向', format: '秒 → 時長', parse: '時長 → 秒', input: '輸入', output: '輸出', copy: '複製', copied: '已複製', error: '無效輸入' },
};

export default function DurationFormatTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('3661');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = mode === 'format' ? formatDuration(Number(input)) : String(parseDuration(input));
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'format', label: t.format }, { value: 'parse', label: t.parse }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <label className="tool__field"><span>{t.input}</span><TextField value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {error ? <p className="tool__error">{error}</p> : (
        <>
          <label className="tool__field"><span>{t.output}</span><TextArea mono rows={2} value={output} readOnly /></label>
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </>
      )}
    </ToolPage>
  );
}
