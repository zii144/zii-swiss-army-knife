import { useState } from 'react';
import { numberLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Number lines', desc: 'Prefix each line with a line number.', input: 'Text', start: 'Start at', sep: 'Separator', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '行號', desc: '為每一行加上行號前綴。', input: '文字', start: '起始', sep: '分隔符', copy: '複製', copied: '已複製' },
};

export default function NumberLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('alpha\nbeta\ngamma');
  const [start, setStart] = useState(1);
  const [sep, setSep] = useState(': ');
  const [copied, setCopied] = useState(false);
  const output = numberLines(input, start, sep);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.start}</span><TextField type="number" value={start} onChange={(e) => setStart(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.sep}</span><TextField value={sep} onChange={(e) => setSep(e.target.value)} /></label>
      </div>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
