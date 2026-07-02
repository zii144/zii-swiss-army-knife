import { useState } from 'react';
import { grepLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Grep lines', desc: 'Keep lines matching a regular expression.', input: 'Text', pattern: 'Pattern', invert: 'Invert (exclude matches)', copy: 'Copy', copied: 'Copied', error: 'Invalid pattern' },
  'zh-TW': { title: '篩選行', desc: '保留符合正則表達式的行。', input: '文字', pattern: '模式', invert: '反選（排除符合）', copy: '複製', copied: '已複製', error: '無效的模式' },
};

export default function GrepLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('error: disk full\ninfo: started\nerror: timeout');
  const [pattern, setPattern] = useState('error');
  const [invert, setInvert] = useState(false);
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = grepLines(input, pattern, 'i', invert);
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.pattern}</span><TextField value={pattern} onChange={(e) => setPattern(e.target.value)} /></label>
      <label className="tool__check"><input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} /> {t.invert}</label>
      {error ? <p className="tool__error">{error}</p> : <TextArea mono rows={5} value={output} readOnly />}
      {!error ? <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button> : null}
    </ToolPage>
  );
}
