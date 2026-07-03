import { useState } from 'react';
import { transposeGrid } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Transpose grid', desc: 'Swap rows and columns in a character grid.', input: 'Grid (one row per line)', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '轉置網格', desc: '將字元網格的行列互換。', input: '網格（每行一列）', copy: '複製', copied: '已複製' },
};

export default function TransposeGridTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('abc\ndef');
  const [copied, setCopied] = useState(false);
  const output = transposeGrid(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea mono rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
