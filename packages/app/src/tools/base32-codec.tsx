import { useState } from 'react';
import { base32EncodeText, base32DecodeText } from '@zii/compute';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: { title: 'Base32 encode / decode', desc: 'Convert text to RFC 4648 base32 and back.', mode: 'Mode', encode: 'Encode', decode: 'Decode', input: 'Input', copy: 'Copy', copied: 'Copied', error: 'Invalid base32' },
  'zh-TW': { title: 'Base32 編碼／解碼', desc: '將文字轉為 RFC 4648 Base32 或還原。', mode: '模式', encode: '編碼', decode: '解碼', input: '輸入', copy: '複製', copied: '已複製', error: '無效的 Base32' },
};

export default function Base32CodecTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('Hello!');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error: string | null = null;
  try {
    output = mode === 'encode' ? base32EncodeText(input) : base32DecodeText(input);
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
