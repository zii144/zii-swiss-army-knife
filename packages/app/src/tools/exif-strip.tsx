import { useState } from 'react';
import { reencode, type RasterResult } from '../lib/imagekit';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const L = {
  en: {
    title: 'Strip image metadata',
    desc: 'Remove EXIF/GPS and other metadata by re-encoding the image on your device. Great before sharing.',
    pick: 'Choose an image',
    strip: 'Strip metadata',
    working: 'Working…',
    none: 'Choose a JPEG/PNG/WebP image.',
    done: (from: number, to: number) => `Cleaned · ${fmt(from)} → ${fmt(to)}`,
    download: 'Download clean.jpg',
  },
  'zh-TW': {
    title: '移除影像中繼資料',
    desc: '在裝置上重新編碼影像以移除 EXIF／GPS 等中繼資料，分享前很實用。',
    pick: '選擇影像',
    strip: '移除中繼資料',
    working: '處理中…',
    none: '請選擇 JPEG／PNG／WebP 影像。',
    done: (from: number, to: number) => `已清除 · ${fmt(from)} → ${fmt(to)}`,
    download: '下載 clean.jpg',
  },
};

export default function ExifStripTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [result, setResult] = useState<RasterResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!bytes) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await reencode(bytes, 'image/jpeg', 0.92));
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
      <div className="tool__field">
        <span>{t.pick}</span>
        <FileField
          accept="image/*"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            const f = fs[0] ?? null;
            setResult(null);
            if (!f) {
              setBytes(null);
              return;
            }
            void readFileBytes(f).then((b) => {
              setBytes(b);
              setOrigSize(b.byteLength);
            });
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!bytes || busy} onClick={run}>
          {busy ? t.working : t.strip}
        </Button>
        {!bytes ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(origSize, result.bytes.byteLength)}</p>
          <DownloadButton bytes={result.bytes} filename="clean.jpg" mime="image/jpeg" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
