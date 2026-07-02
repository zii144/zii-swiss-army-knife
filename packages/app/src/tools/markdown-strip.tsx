import { useState } from 'react';
import { stripMarkdown } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Strip Markdown', desc: 'Convert Markdown to plain text.', input: 'Markdown', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '移除 Markdown', desc: '將 Markdown 轉為純文字。', input: 'Markdown', copy: '複製', copied: '已複製' },
};

export default function MarkdownStripTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('# Hello\n\nThis is **bold** and [a link](https://example.com).');
  const [copied, setCopied] = useState(false);
  const output = stripMarkdown(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea rows={6} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
