import { useState } from 'react';
import { testRegex } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Regex tester',
    desc: 'Test a regular expression against text and see every match. Runs locally.',
    pattern: 'Pattern',
    flags: 'Flags',
    text: 'Test text',
    placeholder: 'The quick brown fox jumps over the lazy dog.',
    matches: (n: number) => `${n} match${n === 1 ? '' : 'es'}`,
    noMatch: 'No matches.',
    at: 'at',
    groups: 'groups',
  },
  'zh-TW': {
    title: '正規表達式測試',
    desc: '以文字測試正規表達式並檢視所有比對結果，於本機執行。',
    pattern: '表達式',
    flags: '旗標',
    text: '測試文字',
    placeholder: 'The quick brown fox jumps over the lazy dog.',
    matches: (n: number) => `${n} 個比對`,
    noMatch: '沒有比對結果。',
    at: '位置',
    groups: '群組',
  },
};

export default function RegexTesterTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [pattern, setPattern] = useState('\\b\\w{5}\\b');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');

  const result = testRegex(pattern, text, flags);

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field" style={{ flex: 1 }}>
          <span>{t.pattern}</span>
          <TextField type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </label>
        <label className="tool__field">
          <span>{t.flags}</span>
          <TextField
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            style={{ maxWidth: '6rem' }}
          />
        </label>
      </div>
      <label className="tool__field">
        <span>{t.text}</span>
        <TextArea
          rows={5}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => setText(e.target.value)}
        />
      </label>

      {!result.valid ? (
        <p className="tool__error">{result.error}</p>
      ) : (
        <div className="tool__result">
          <p className="tool__hint">
            {result.matches.length === 0 ? t.noMatch : t.matches(result.matches.length)}
          </p>
          {result.matches.length > 0 ? (
            <div className="tool__rows">
              {result.matches.slice(0, 200).map((m, i) => (
                <div key={i} className="tool__row">
                  <code className="tool__row-value">{m.match || '∅'}</code>
                  <span className="tool__row-label">
                    {t.at} {m.index}
                    {m.groups.length > 0 ? ` · ${t.groups}: ${m.groups.join(', ')}` : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </ToolPage>
  );
}
