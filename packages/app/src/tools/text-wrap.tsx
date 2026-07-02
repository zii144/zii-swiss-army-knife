import { useState } from 'react';
import { wrapText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, RangeSlider, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Word wrap', desc: 'Wrap text to a maximum line width.', input: 'Text', width: 'Width (characters)', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '自動換行', desc: '依字元寬度自動換行。', input: '文字', width: '寬度（字元）', copy: '複製', copied: '已複製' },
};

export default function TextWrapTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog.');
  const [width, setWidth] = useState(20);
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = wrapText(input, width);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.width}: {width}</span><RangeSlider min={10} max={120} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
      {error ? <p className="tool__error">{error}</p> : <TextArea mono rows={6} value={output} readOnly />}
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
