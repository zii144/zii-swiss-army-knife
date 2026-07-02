import { useState } from 'react';
import { atbash } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Atbash cipher', desc: 'Encode or decode letters with the Atbash cipher.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: 'Atbash 密碼', desc: '以 Atbash 密碼編碼或解碼字母。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function AtbashCipherTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Hello');
  const [copied, setCopied] = useState(false);
  const output = atbash(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
