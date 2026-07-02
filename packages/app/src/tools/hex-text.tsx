import { useState } from 'react';
import { textToHex, hexToText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: { title: 'Text ↔ hex', desc: 'Convert text to hexadecimal and back.', mode: 'Mode', encode: 'Text → hex', decode: 'Hex → text', input: 'Input', copy: 'Copy', copied: 'Copied', error: 'Invalid hex' },
  'zh-TW': { title: '文字 ↔ 十六進位', desc: '將文字轉為十六進位或還原。', mode: '模式', encode: '文字 → hex', decode: 'Hex → 文字', input: '輸入', copy: '複製', copied: '已複製', error: '無效的 hex' },
};

export default function HexTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('Hi');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = mode === 'encode' ? textToHex(input, ' ') : hexToText(input);
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'encode', label: t.encode }, { value: 'decode', label: t.decode }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {error ? <p className="tool__error">{error}</p> : <TextArea mono rows={4} value={output} readOnly />}
      {!error ? <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button> : null}
    </ToolPage>
  );
}
