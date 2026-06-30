import { useState } from 'react';
import { compressImage } from '@zii/compute-wasm/image';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Compress image',
    desc: 'Shrink JPEG/PNG/WebP images on your device by re-encoding at a chosen quality.',
    pick: 'Choose an image',
    quality: 'Quality',
    compress: 'Compress',
    compressing: 'Compressing…',
    none: 'Choose a PNG, JPEG or WebP image.',
    done: 'Compressed image ready.',
    download: 'Download',
    saved: (from: number, to: number, pct: number) =>
      `${fmt(from)} → ${fmt(to)} (${pct >= 0 ? '−' : '+'}${Math.abs(pct).toFixed(0)}%)`,
  },
  'zh-TW': {
    title: '影像壓縮',
    desc: '在裝置上以指定品質重新編碼，縮小 JPEG／PNG／WebP 影像。',
    pick: '選擇影像',
    quality: '品質',
    compress: '壓縮',
    compressing: '壓縮中…',
    none: '請選擇 PNG、JPEG 或 WebP 影像。',
    done: '壓縮完成。',
    download: '下載',
    saved: (from: number, to: number, pct: number) =>
      `${fmt(from)} → ${fmt(to)}（${pct >= 0 ? '−' : '+'}${Math.abs(pct).toFixed(0)}%）`,
  },
};

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCompressTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    try {
      const input = await readFileBytes(file);
      setOrigSize(input.byteLength);
      const out = await compressImage(input, { quality });
      setResult(out);
      setPreviewUrl(
        URL.createObjectURL(new Blob([out as unknown as BlobPart], { type: 'image/jpeg' })),
      );
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
      <label className="tool__field">
        <span>{t.pick}</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setResult(null);
          }}
        />
      </label>
      <label className="tool__field">
        <span>
          {t.quality}: {quality}
        </span>
        <input
          type="range"
          min={10}
          max={95}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      </label>

      <div className="tool__actions">
        <button type="button" className="tool__primary" disabled={!file || busy} onClick={run}>
          {busy ? t.compressing : t.compress}
        </button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <p>
            <strong>{t.saved(origSize, result.byteLength, pct)}</strong>
          </p>
          <img className="tool__preview" src={previewUrl} alt="compressed result" />
          <DownloadButton
            bytes={result}
            filename="compressed.jpg"
            mime="image/jpeg"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
