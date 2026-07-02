import { useState } from 'react';
import { truncateText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Truncate text', desc: 'Shorten text to a maximum length with an ellipsis.', input: 'Text', max: 'Max length', ellipsis: 'Ellipsis', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '截斷文字', desc: '將文字縮短至最大長度並加上省略符號。', input: '文字', max: '最大長度', ellipsis: '省略符', copy: '複製', copied: '已複製' },
};

export default function TruncateTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog.');
  const [max, setMax] = useState(20);
  const [ellipsis, setEllipsis] = useState('…');
  const [copied, setCopied] = useState(false);
  const output = truncateText(input, max, ellipsis);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={3} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.max}</span><TextField type="number" min={0} value={max} onChange={(e) => setMax(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.ellipsis}</span><TextField value={ellipsis} onChange={(e) => setEllipsis(e.target.value)} /></label>
      </div>
      <TextArea rows={2} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
