import { useState } from 'react';
import { convertImage, type ImageFormat } from '@zii/compute-wasm/image';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const FORMATS: ImageFormat[] = ['png', 'jpeg', 'webp'];
const MIME: Record<ImageFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const L = {
  en: {
    title: 'Convert image',
    desc: 'Convert between PNG, JPEG and WebP on your device. Source format is detected automatically.',
    pick: 'Choose an image',
    to: 'Convert to',
    convert: 'Convert',
    converting: 'Converting…',
    none: 'Choose a PNG, JPEG or WebP image.',
    done: 'Converted image ready.',
    download: (f: string) => `Download .${f}`,
  },
  'zh-TW': {
    title: '影像轉檔',
    desc: '在裝置上於 PNG、JPEG、WebP 之間轉換，來源格式自動辨識。',
    pick: '選擇影像',
    to: '轉換成',
    convert: '轉換',
    converting: '轉換中…',
    none: '請選擇 PNG、JPEG 或 WebP 影像。',
    done: '轉換完成。',
    download: (f: string) => `下載 .${f}`,
  },
};

export default function ImageConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [to, setTo] = useState<ImageFormat>('jpeg');
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
      const out = await convertImage(await readFileBytes(file), { to });
      setResult(out);
      setPreviewUrl(URL.createObjectURL(new Blob([out as unknown as BlobPart], { type: MIME[to] })));
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
          accept="image/png,image/jpeg,image/webp"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__field">
        <span>{t.to}</span>
        <Select
          value={to}
          options={FORMATS.map((f) => ({ value: f, label: f.toUpperCase() }))}
          onChange={(v) => setTo(v as ImageFormat)}
          ariaLabel={t.to}
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
            filename={`converted.${to}`}
            mime={MIME[to]}
            label={t.download(to)}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
