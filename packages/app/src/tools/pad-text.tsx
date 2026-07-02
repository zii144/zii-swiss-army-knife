import { useState } from 'react';
import { padText, type PadAlign } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Pad text', desc: 'Pad text to a minimum width with a fill character.', input: 'Text', width: 'Width', align: 'Align', left: 'Left', right: 'Right', center: 'Center', fill: 'Fill char', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '補齊文字', desc: '以填充字元將文字補齊至指定寬度。', input: '文字', width: '寬度', align: '對齊', left: '左', right: '右', center: '置中', fill: '填充字元', copy: '複製', copied: '已複製' },
};

export default function PadTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('42');
  const [width, setWidth] = useState(8);
  const [align, setAlign] = useState<PadAlign>('right');
  const [fill, setFill] = useState('0');
  const [copied, setCopied] = useState(false);
  let output = input;
  let error: string | null = null;
  try {
    output = padText(input, width, align, fill || ' ');
  } catch {
    error = 'Invalid fill character';
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={2} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.width}</span><TextField type="number" min={0} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.fill}</span><TextField value={fill} maxLength={1} onChange={(e) => setFill(e.target.value)} /></label>
      </div>
      <Select value={align} options={[{ value: 'left', label: t.left }, { value: 'right', label: t.right }, { value: 'center', label: t.center }]} onChange={(v) => setAlign(v as PadAlign)} ariaLabel={t.align} />
      {error ? <p className="tool__error">{error}</p> : (
        <>
          <TextArea mono rows={2} value={output} readOnly />
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </>
      )}
    </ToolPage>
  );
}
