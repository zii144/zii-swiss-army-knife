import { useState } from 'react';
import { caesarCipher } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, RangeSlider, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: { title: 'Caesar cipher', desc: 'Shift letters by a chosen amount (1–25).', mode: 'Mode', encode: 'Encode', decode: 'Decode', shift: 'Shift', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '凱薩密碼', desc: '將字母位移指定格數（1–25）。', mode: '模式', encode: '編碼', decode: '解碼', shift: '位移', input: '文字', copy: '複製', copied: '已複製' },
};

export default function CaesarCipherTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [shift, setShift] = useState(3);
  const [input, setInput] = useState('Hello World');
  const [copied, setCopied] = useState(false);
  const output = caesarCipher(input, shift, mode === 'decode');

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'encode', label: t.encode }, { value: 'decode', label: t.decode }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <label className="tool__field"><span>{t.shift}: {shift}</span><RangeSlider min={1} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} /></label>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
