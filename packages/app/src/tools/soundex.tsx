import { useState } from 'react';
import { soundex } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Soundex', desc: 'Compute the American Soundex phonetic code for a name.', input: 'Name', result: (c: string) => `Code: ${c}` },
  'zh-TW': { title: 'Soundex', desc: '計算美式 Soundex 語音編碼。', input: '名稱', result: (c: string) => `編碼：${c}` },
};

export default function SoundexTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Robert');
  const code = soundex(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextField value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {code ? <p className="tool__hint"><strong>{t.result(code)}</strong></p> : null}
    </ToolPage>
  );
}
