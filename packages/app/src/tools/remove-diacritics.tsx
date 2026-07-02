import { useState } from 'react';
import { removeDiacritics } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Remove diacritics', desc: 'Strip accents and diacritic marks from text.', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '移除變音符', desc: '移除文字中的重音與變音符號。', input: '文字', copy: '複製', copied: '已複製' },
};

export default function RemoveDiacriticsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('café résumé naïve');
  const [copied, setCopied] = useState(false);
  const output = removeDiacritics(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
