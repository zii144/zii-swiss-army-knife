import { useState } from 'react';
import { repeatText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Repeat text', desc: 'Repeat a string a number of times with an optional separator.', input: 'Text', times: 'Times', sep: 'Separator', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '重複文字', desc: '將字串重複指定次數，可選分隔符。', input: '文字', times: '次數', sep: '分隔符', copy: '複製', copied: '已複製' },
};

export default function RepeatTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('line');
  const [times, setTimes] = useState(3);
  const [sep, setSep] = useState('\n');
  const [copied, setCopied] = useState(false);
  const output = repeatText(input, times, sep);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={3} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.times}</span><TextField type="number" min={0} value={times} onChange={(e) => setTimes(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.sep}</span><TextField value={sep} onChange={(e) => setSep(e.target.value)} /></label>
      </div>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
