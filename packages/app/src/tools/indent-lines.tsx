import { useState } from 'react';
import { indentLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Indent lines', desc: 'Add spaces to indent lines, or use a negative value to outdent.', input: 'Text', spaces: 'Spaces (+ indent, − outdent)', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '縮排行', desc: '增加空格縮排，或使用負值減少縮排。', input: '文字', spaces: '空格（正=縮排，負=減排）', copy: '複製', copied: '已複製' },
};

export default function IndentLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('function() {\nreturn true;\n}');
  const [spaces, setSpaces] = useState(2);
  const [copied, setCopied] = useState(false);
  const output = indentLines(input, spaces);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.spaces}</span><TextField type="number" value={spaces} onChange={(e) => setSpaces(Number(e.target.value))} /></label>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
