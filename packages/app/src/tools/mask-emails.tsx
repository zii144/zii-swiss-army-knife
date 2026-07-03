import { useState } from 'react';
import { maskEmailsInText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Mask emails', desc: 'Redact email addresses in text for sharing.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '遮蔽 Email', desc: '遮蔽文字中的 Email 以便分享。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function MaskEmailsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Contact alice@example.com or bob@test.org');
  const [copied, setCopied] = useState(false);
  const output = maskEmailsInText(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
