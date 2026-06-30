import { useState } from 'react';
import { scanQr } from '@zii/compute-wasm/qr';
import { ToolPage } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'QR code scanner',
    desc: 'Read the text or URL inside a QR code image, decoded on your device.',
    pick: 'Choose a QR image',
    scan: 'Scan',
    scanning: 'Scanning…',
    none: 'Choose an image containing a QR code.',
    found: (n: number) => `${n} code${n === 1 ? '' : 's'} found`,
    nothing: 'No QR code found in the image.',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: 'QR Code 掃描',
    desc: '讀取 QR Code 影像中的文字或網址，於裝置上解碼。',
    pick: '選擇 QR 影像',
    scan: '掃描',
    scanning: '掃描中…',
    none: '請選擇含有 QR Code 的影像。',
    found: (n: number) => `找到 ${n} 組`,
    nothing: '影像中找不到 QR Code。',
    copy: '複製',
    copied: '已複製',
  },
};

export default function QrScanTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const codes = await scanQr(await readFileBytes(file));
      setResults(codes.map((c) => c.text));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (i: number, value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(i);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
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
      <div className="tool__field">
        <span>{t.pick}</span>
        <FileField
          accept="image/png,image/jpeg,image/webp"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResults(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.scanning : t.scan}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {results ? (
        <div className="tool__result">
          <p className="tool__hint">{results.length === 0 ? t.nothing : t.found(results.length)}</p>
          <div className="tool__rows">
            {results.map((text, i) => (
              <div key={i} className="tool__row">
                <code className="tool__row-value tool__row-value--mono">{text}</code>
                <Button variant="ghost" onClick={() => copy(i, text)}>
                  {copied === i ? t.copied : t.copy}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
