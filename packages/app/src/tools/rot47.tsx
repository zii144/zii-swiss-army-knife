import { useState } from 'react';
import { rot47 } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'ROT47', desc: 'Encode or decode printable ASCII with ROT47.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: 'ROT47', desc: '以 ROT47 編碼或解碼可列印 ASCII。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function Rot47Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Hello, World!');
  const [copied, setCopied] = useState(false);
  const output = rot47(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
