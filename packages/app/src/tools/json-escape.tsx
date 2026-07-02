import { useState } from 'react';
import { jsonEscapeString, jsonUnescapeString } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'escape' | 'unescape';
const L = {
  en: { title: 'JSON string escape', desc: 'Escape or unescape a string for use inside JSON on your device.', mode: 'Mode', escape: 'Escape', unescape: 'Unescape', input: 'Input', output: 'Output', copy: 'Copy', copied: 'Copied', invalid: 'Invalid escape sequence' },
  'zh-TW': { title: 'JSON 字串跳脫', desc: '將字串跳脫或還原以便嵌入 JSON，於裝置上處理。', mode: '模式', escape: '跳脫', unescape: '還原', input: '輸入', output: '輸出', copy: '複製', copied: '已複製', invalid: '跳脫序列無效' },
};

export default function JsonEscapeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('escape');
  const [input, setInput] = useState('line\n"quote"');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try { output = input ? (mode === 'escape' ? jsonEscapeString(input) : jsonUnescapeString(input)) : ''; } catch (e) { error = e instanceof Error ? e.message : String(e); }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__field"><span>{t.mode}</span><Select value={mode} options={[{ value: 'escape', label: t.escape }, { value: 'unescape', label: t.unescape }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} /></div>
      <label className="tool__field"><span>{t.input}</span><TextArea mono rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {output ? (
        <div className="tool__result">
          <TextArea mono rows={5} value={output} readOnly />
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
