import { useState } from 'react';
import { reverseWords } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Reverse words', desc: 'Reverse the order of words in text.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '反轉詞序', desc: '反轉文字中詞語的順序。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function ReverseWordsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('The quick brown fox');
  const [copied, setCopied] = useState(false);
  const output = reverseWords(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={3} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea rows={3} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
