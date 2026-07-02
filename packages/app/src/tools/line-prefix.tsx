import { useState } from 'react';
import { affixLines } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Line prefix / suffix', desc: 'Add the same prefix and/or suffix to every line.', input: 'Lines', prefix: 'Prefix', suffix: 'Suffix', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: '行前後綴', desc: '為每一行加上相同的前綴或後綴。', input: '行', prefix: '前綴', suffix: '後綴', copy: '複製', copied: '已複製' },
};

export default function LinePrefixTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('apple\nbanana');
  const [prefix, setPrefix] = useState('- ');
  const [suffix, setSuffix] = useState('');
  const [copied, setCopied] = useState(false);
  const output = affixLines(input, prefix, suffix);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.prefix}</span><TextField value={prefix} onChange={(e) => setPrefix(e.target.value)} /></label>
        <label className="tool__field"><span>{t.suffix}</span><TextField value={suffix} onChange={(e) => setSuffix(e.target.value)} /></label>
      </div>
      <TextArea mono rows={5} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
