import { useState } from 'react';
import { rot13 } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'ROT13', desc: 'Encode or decode text with ROT13 on your device.', input: 'Text', placeholder: 'Hello World', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: 'ROT13', desc: '在裝置上以 ROT13 編碼或解碼文字。', input: '文字', placeholder: 'Hello World', copy: '複製', copied: '已複製' },
};

export default function Rot13Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Hello World');
  const [copied, setCopied] = useState(false);
  const output = rot13(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} placeholder={t.placeholder} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
