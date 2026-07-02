import { useState } from 'react';
import { removeZeroWidth, findZeroWidth } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Remove zero-width chars', desc: 'Strip invisible zero-width and formatting characters.', input: 'Text', found: (n: string[]) => n.length ? `Found: ${n.join(', ')}` : 'No zero-width characters detected', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '移除零寬字元', desc: '移除不可見的零寬與格式字元。', input: '文字', found: (n: string[]) => n.length ? `發現：${n.join('、')}` : '未偵測到零寬字元', copy: '複製', copied: '已複製' },
};

export default function ZeroWidthCleanTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('hello\u200Bworld');
  const [copied, setCopied] = useState(false);
  const output = removeZeroWidth(input);
  const found = findZeroWidth(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <p className="tool__hint">{t.found(found)}</p>
      <TextArea rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
