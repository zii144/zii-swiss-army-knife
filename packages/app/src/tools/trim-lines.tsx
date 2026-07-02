import { useState } from 'react';
import { trimLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Trim lines', desc: 'Remove leading and trailing whitespace from each line.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '修剪行空白', desc: '移除每一行開頭與結尾的空白。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function TrimLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('  hello  \n  world  ');
  const [copied, setCopied] = useState(false);
  const output = trimLines(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={6} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
