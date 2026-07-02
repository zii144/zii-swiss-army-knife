import { useState } from 'react';
import { unicodeEscape, unicodeUnescape } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: { title: 'Unicode escape', desc: 'Escape non-ASCII characters as \\uXXXX sequences.', mode: 'Mode', encode: 'Escape', decode: 'Unescape', input: 'Input', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: 'Unicode 跳脫', desc: '將非 ASCII 字元跳脫為 \\uXXXX。', mode: '模式', encode: '跳脫', decode: '還原', input: '輸入', copy: '複製', copied: '已複製' },
};

export default function UnicodeEscapeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('café');
  const [copied, setCopied] = useState(false);
  const output = mode === 'encode' ? unicodeEscape(input) : unicodeUnescape(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'encode', label: t.encode }, { value: 'decode', label: t.decode }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={4} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
