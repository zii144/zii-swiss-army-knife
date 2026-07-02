import { useState } from 'react';
import { splitToLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Split to lines', desc: 'Split text by a delimiter into separate lines.', input: 'Text', sep: 'Delimiter', copy: 'Copy', copied: 'Copied', error: 'Delimiter required' },
  'zh-TW': { title: '分割成行', desc: '依分隔符將文字分割成多行。', input: '文字', sep: '分隔符', copy: '複製', copied: '已複製', error: '需要分隔符' },
};

export default function SplitTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('a,b,c');
  const [sep, setSep] = useState(',');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = splitToLines(input, sep);
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={3} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.sep}</span><TextField value={sep} onChange={(e) => setSep(e.target.value)} /></label>
      {error ? <p className="tool__error">{error}</p> : <TextArea mono rows={5} value={output} readOnly />}
      {!error ? <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button> : null}
    </ToolPage>
  );
}
