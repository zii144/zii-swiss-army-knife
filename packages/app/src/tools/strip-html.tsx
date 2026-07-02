import { useState } from 'react';
import { stripHtml } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Strip HTML', desc: 'Remove HTML tags and decode entities to plain text.', input: 'HTML', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '移除 HTML', desc: '移除 HTML 標籤並解碼實體為純文字。', input: 'HTML', copy: '複製', copied: '已複製' },
};

export default function StripHtmlTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('<p>Hello <strong>world</strong>!</p>');
  const [copied, setCopied] = useState(false);
  const output = stripHtml(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
