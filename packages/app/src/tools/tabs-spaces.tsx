import { useState } from 'react';
import { tabsToSpaces, spacesToTabs } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, TextField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'to-spaces' | 'to-tabs';

const L = {
  en: { title: 'Tabs ↔ spaces', desc: 'Convert between tab characters and spaces.', mode: 'Direction', toSpaces: 'Tabs → spaces', toTabs: 'Spaces → tabs', width: 'Tab width', input: 'Text', copy: 'Copy', copied: 'Copied' },
  'zh-TW': { title: 'Tab ↔ 空格', desc: '在 Tab 字元與空格之間轉換。', mode: '方向', toSpaces: 'Tab → 空格', toTabs: '空格 → Tab', width: 'Tab 寬度', input: '文字', copy: '複製', copied: '已複製' },
};

export default function TabsSpacesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('to-spaces');
  const [width, setWidth] = useState(4);
  const [input, setInput] = useState('if (true) {\n\treturn 1;\n}');
  const [copied, setCopied] = useState(false);
  const output = mode === 'to-spaces' ? tabsToSpaces(input, width) : spacesToTabs(input, width);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <Select value={mode} options={[{ value: 'to-spaces', label: t.toSpaces }, { value: 'to-tabs', label: t.toTabs }]} onChange={(v) => setMode(v as Mode)} ariaLabel={t.mode} />
      <label className="tool__field"><span>{t.width}</span><TextField type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
      <label className="tool__field"><span>{t.input}</span><TextArea mono rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <TextArea mono rows={6} value={output} readOnly />
      <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
    </ToolPage>
  );
}
