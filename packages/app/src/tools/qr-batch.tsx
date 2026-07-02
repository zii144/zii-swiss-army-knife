import { useState } from 'react';
import { generateQr } from '@zii/compute-wasm/qr';
import { createZip } from '@zii/compute-wasm/archive';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = 'https://zii.app\nhttps://example.com/page\nHello world';

const L = {
  en: {
    title: 'Batch QR codes',
    desc: 'Generate one QR PNG per line (text or URL) and download them as a ZIP on your device.',
    input: 'One payload per line',
    placeholder: 'https://example.com\nWi-Fi network name\nContact info…',
    generate: 'Generate ZIP',
    generating: 'Generating…',
    none: 'Enter at least one non-empty line.',
    done: (n: number) => `${n} QR code${n === 1 ? '' : 's'} ready.`,
    download: 'Download qr-codes.zip',
    lines: (n: number) => `${n} line${n === 1 ? '' : 's'}`,
  },
  'zh-TW': {
    title: '批次 QR Code',
    desc: '每行一個文字或網址，在裝置上產生 QR PNG 並打包成 ZIP 下載。',
    input: '每行一個內容',
    placeholder: 'https://example.com\nWi-Fi 名稱\n聯絡資訊…',
    generate: '產生 ZIP',
    generating: '產生中…',
    none: '請輸入至少一行非空白內容。',
    done: (n: number) => `${n} 個 QR Code 完成。`,
    download: '下載 qr-codes.zip',
    lines: (n: number) => `${n} 行`,
  },
};

function safeFilename(line: string, index: number): string {
  const slug = line
    .trim()
    .slice(0, 40)
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `qr-${index + 1}${slug ? `-${slug}` : ''}.png`;
}

export default function QrBatchTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const run = async (): Promise<void> => {
    if (lines.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const entries: Record<string, Uint8Array> = {};
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]!;
        entries[safeFilename(line, i)] = await generateQr(line);
      }
      setCount(lines.length);
      setResult(createZip(entries));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea
          mono
          rows={10}
          value={input}
          placeholder={t.placeholder}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
        />
      </label>
      {lines.length > 0 ? <p className="tool__hint">{t.lines(lines.length)}</p> : null}

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={lines.length === 0 || busy} onClick={run}>
          {busy ? t.generating : t.generate}
        </Button>
        {lines.length === 0 ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(count)}</p>
          <DownloadButton
            bytes={result}
            filename="qr-codes.zip"
            mime="application/zip"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
