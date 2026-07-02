import { useState } from 'react';
import { loremIpsum } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, RangeSlider, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Lorem ipsum',
    desc: 'Generate placeholder paragraphs for mockups and layouts on your device.',
    paragraphs: 'Paragraphs',
    words: 'Words per paragraph',
    generate: 'Generate',
    output: 'Text',
    download: 'Download .txt',
  },
  'zh-TW': {
    title: 'Lorem ipsum',
    desc: '在裝置上產生排版用的假文段落。',
    paragraphs: '段落數',
    words: '每段字數',
    generate: '產生',
    output: '文字',
    download: '下載 .txt',
  },
};

export default function LoremIpsumTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(40);
  const [output, setOutput] = useState('');

  const run = (): void => setOutput(loremIpsum(paragraphs, words));

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field">
        <span>
          {t.paragraphs}: {paragraphs}
        </span>
        <RangeSlider min={1} max={10} value={paragraphs} onChange={(e) => setParagraphs(Number(e.target.value))} />
      </label>
      <label className="tool__field">
        <span>
          {t.words}: {words}
        </span>
        <RangeSlider min={10} max={100} value={words} onChange={(e) => setWords(Number(e.target.value))} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.generate}
        </Button>
      </div>
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea rows={10} value={output} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(output)}
            filename="lorem.txt"
            mime="text/plain"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
