import { useState } from 'react';
import { heicToJpg } from '@zii/compute-wasm/heic';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'HEIC → JPG',
    desc: 'Convert iPhone HEIC/HEIF photos to JPG, right on your device. Nothing is uploaded.',
    pick: 'Choose a HEIC photo',
    convert: 'Convert',
    converting: 'Converting…',
    none: 'Choose a .heic or .heif photo.',
    done: 'JPG ready.',
    download: 'Download .jpg',
  },
  'zh-TW': {
    title: 'HEIC → JPG',
    desc: '在裝置上將 iPhone 的 HEIC／HEIF 相片轉為 JPG，完全不上傳。',
    pick: '選擇 HEIC 相片',
    convert: '轉換',
    converting: '轉換中…',
    none: '請選擇 .heic 或 .heif 相片。',
    done: 'JPG 完成。',
    download: '下載 .jpg',
  },
};

export default function HeicConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
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
      const out = await heicToJpg(await readFileBytes(file));
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
          accept=".heic,.heif,image/heic,image/heif"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.converting : t.convert}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <img className="tool__preview" src={previewUrl} alt="converted result" />
          <DownloadButton
            bytes={result}
            filename="photo.jpg"
            mime="image/jpeg"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
