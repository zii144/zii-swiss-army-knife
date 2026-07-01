import { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Remove background',
    desc: 'Cut out the background of a photo, leaving a transparent PNG. Runs on your device; the model downloads on first use (needs network once).',
    pick: 'Choose an image',
    run: 'Remove background',
    working: 'Processing… (first run downloads the model)',
    none: 'Choose a photo.',
    done: 'Background removed.',
    download: 'Download PNG',
  },
  'zh-TW': {
    title: '去背',
    desc: '去除相片背景，輸出透明 PNG。於裝置上運算；模型於首次使用時下載（僅需一次網路）。',
    pick: '選擇圖片',
    run: '去背',
    working: '處理中…（首次會下載模型）',
    none: '請選擇相片。',
    done: '去背完成。',
    download: '下載 PNG',
  },
};

export default function BgRemoveTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      const blob = await removeBackground(file);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      setResult(bytes);
      setPreviewUrl(URL.createObjectURL(blob));
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
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.working : t.run}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <img className="tool__preview" src={previewUrl} alt="cut-out result" style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px' }} />
          <DownloadButton bytes={result} filename="cutout.png" mime="image/png" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
