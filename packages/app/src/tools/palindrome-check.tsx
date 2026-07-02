import { useState } from 'react';
import { isPalindrome } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Palindrome checker', desc: 'Check if text reads the same forwards and backwards.', input: 'Text', yes: 'Palindrome', no: 'Not a palindrome' },
  'zh-TW': { title: '回文檢查', desc: '檢查文字是否正讀反讀相同。', input: '文字', yes: '是回文', no: '不是回文' },
};

export default function PalindromeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('racecar');
  const ok = input.length > 0 && isPalindrome(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextField value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {input ? <p className="tool__hint"><strong>{ok ? t.yes : t.no}</strong></p> : null}
    </ToolPage>
  );
}
