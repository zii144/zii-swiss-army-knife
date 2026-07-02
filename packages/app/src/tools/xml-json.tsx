import { useState } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Dir = 'xml2json' | 'json2xml';

const SAMPLE = '<note>\n  <to>Zii</to>\n  <tags><tag>a</tag><tag>b</tag></tags>\n</note>';

const L = {
  en: {
    title: 'XML ↔ JSON',
    desc: 'Convert between XML and JSON on your device.',
    direction: 'Direction',
    x2j: 'XML → JSON',
    j2x: 'JSON → XML',
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    download: 'Download',
  },
  'zh-TW': {
    title: 'XML ↔ JSON',
    desc: '在裝置上於 XML 與 JSON 之間轉換。',
    direction: '方向',
    x2j: 'XML → JSON',
    j2x: 'JSON → XML',
    input: '輸入',
    output: '輸出',
    convert: '轉換',
    download: '下載',
  },
};

export default function XmlJsonTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [dir, setDir] = useState<Dir>('xml2json');
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      if (dir === 'xml2json') {
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
        setOutput(JSON.stringify(parser.parse(input), null, 2));
      } else {
        const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: true });
        setOutput(builder.build(JSON.parse(input)));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const outName = dir === 'xml2json' ? 'data.json' : 'data.xml';
  const outMime = dir === 'xml2json' ? 'application/json' : 'application/xml';

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.direction}</span>
        <Select
          value={dir}
          options={[
            { value: 'xml2json', label: t.x2j },
            { value: 'json2xml', label: t.j2x },
          ]}
          onChange={(v) => {
            setDir(v as Dir);
            setOutput('');
            setError(null);
          }}
          ariaLabel={t.direction}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <button type="button" className="ui-btn ui-btn--primary" onClick={run}>
          {t.convert}
        </button>
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={8} value={output} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(output)}
            filename={outName}
            mime={outMime}
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
