import { useState } from 'react';
import { compressPdf } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const L = {
  en: {
    title: 'Compress PDF',
    desc: 'Reduce a PDF file size on your device. Nothing is uploaded.',
    pick: 'Choose a PDF',
    compress: 'Compress',
    compressing: 'Compressing…',
    none: 'Choose a PDF to compress.',
    done: 'Compressed PDF ready.',
    download: 'Download',
    saved: (from: number, to: number, pct: number) =>
      `${fmt(from)} → ${fmt(to)} (${pct >= 0 ? '−' : '+'}${Math.abs(pct).toFixed(0)}%)`,
  },
  'zh-TW': {
    title: '壓縮 PDF',
    desc: '在裝置上縮小 PDF 檔案大小，完全不上傳。',
    pick: '選擇 PDF',
    compress: '壓縮',
    compressing: '壓縮中…',
    none: '請選擇要壓縮的 PDF。',
    done: '壓縮完成。',
    download: '下載',
    saved: (from: number, to: number, pct: number) =>
      `${fmt(from)} → ${fmt(to)}（${pct >= 0 ? '−' : '+'}${Math.abs(pct).toFixed(0)}%）`,
  },
};

export default function PdfCompressTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const input = await readFileBytes(file);
      setOrigSize(input.byteLength);
      setResult(await compressPdf(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const pct = result && origSize > 0 ? (1 - result.byteLength / origSize) * 100 : 0;

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
          accept="application/pdf,.pdf"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.compressing : t.compress}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <p>
            <strong>{t.saved(origSize, result.byteLength, pct)}</strong>
          </p>
          <DownloadButton
            bytes={result}
            filename="compressed.pdf"
            mime="application/pdf"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
