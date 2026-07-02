import { useState } from 'react';
import { removeEmptyLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Remove empty lines', desc: 'Delete blank or whitespace-only lines from text.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '移除空行', desc: '刪除空白或只有空格的行。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function RemoveEmptyLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('line one\n\n\nline two\n   \nline three');
  const [copied, setCopied] = useState(false);
  const output = removeEmptyLines(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={6} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
