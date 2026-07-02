import { useEffect, useState } from 'react';
import { nanoid } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, RangeSlider, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'NanoID generator', desc: 'Generate compact URL-safe IDs on your device.', count: 'How many', length: 'Length', regenerate: 'Regenerate', copy: 'Copy all', copied: 'Copied' },
  'zh-TW': { title: 'NanoID 產生器', desc: '在裝置上產生精簡的 URL 安全 ID。', count: '數量', length: '長度', regenerate: '重新產生', copy: '全部複製', copied: '已複製' },
};

export default function NanoidTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [count, setCount] = useState(5);
  const [length, setLength] = useState(21);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const gen = (): void => setIds(Array.from({ length: count }, () => nanoid(length)));
  useEffect(gen, [count, length]);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.count}: {count}</span><RangeSlider min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} /></label>
      <label className="tool__field"><span>{t.length}: {length}</span><RangeSlider min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} /></label>
      <div className="tool__actions">
        <Button variant="primary" onClick={gen}>{t.regenerate}</Button>
        <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(ids.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
      </div>
      <TextArea mono rows={6} value={ids.join('\n')} readOnly />
    </ToolPage>
  );
}
