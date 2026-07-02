import { useState } from 'react';
import { joinLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Join lines', desc: 'Join multiple lines with a custom delimiter.', input: 'Lines', sep: 'Delimiter', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '合併行', desc: '以自訂分隔符合併多行。', input: '行', sep: '分隔符', copy: '複製', copied: '已複製' },
};

export default function JoinLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('apple\nbanana\ncherry');
  const [sep, setSep] = useState(', ');
  const [copied, setCopied] = useState(false);
  const output = joinLines(input, sep);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.sep}</span><TextField value={sep} onChange={(e) => setSep(e.target.value)} /></label>
      <TextArea mono rows={3} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
