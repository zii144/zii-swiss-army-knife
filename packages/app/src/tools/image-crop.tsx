import { useState } from 'react';
import { cropImage, imageSize, type RasterResult } from '../lib/imagekit';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Crop image',
    desc: 'Cut a rectangle out of an image by pixel coordinates, on your device.',
    pick: 'Choose an image',
    size: (w: number, h: number) => `Source: ${w} × ${h}px`,
    x: 'X',
    y: 'Y',
    w: 'Width',
    h: 'Height',
    crop: 'Crop',
    cropping: 'Cropping…',
    none: 'Choose an image to crop.',
    done: (w: number, h: number) => `Result: ${w} × ${h}px`,
    download: 'Download',
  },
  'zh-TW': {
    title: '影像裁切',
    desc: '依像素座標從影像裁下一塊矩形，於裝置上處理。',
    pick: '選擇影像',
    size: (w: number, h: number) => `來源：${w} × ${h}px`,
    x: 'X',
    y: 'Y',
    w: '寬',
    h: '高',
    crop: '裁切',
    cropping: '裁切中…',
    none: '請選擇要裁切的影像。',
    done: (w: number, h: number) => `結果：${w} × ${h}px`,
    download: '下載',
  },
};

export default function ImageCropTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(100);
  const [h, setH] = useState(100);
  const [result, setResult] = useState<RasterResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | null): Promise<void> => {
    setResult(null);
    setDims(null);
    if (!file) {
      setBytes(null);
      return;
    }
    const b = await readFileBytes(file);
    setBytes(b);
    try {
      const d = await imageSize(b);
      setDims(d);
      setX(0);
      setY(0);
      setW(Math.round(d.width / 2));
      setH(Math.round(d.height / 2));
    } catch {
      /* ignore */
    }
  };

  const run = async (): Promise<void> => {
    if (!bytes) return;
    setBusy(true);
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    try {
      const out = await cropImage(bytes, x, y, w, h, 'image/png');
      setResult(out);
      setPreviewUrl(
        URL.createObjectURL(new Blob([out.bytes as unknown as BlobPart], { type: 'image/png' })),
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
          accept="image/*"
          buttonLabel={t.pick}
          onFiles={(fs) => void onFile(fs[0] ?? null)}
        />
      </div>
      {dims ? <p className="tool__hint">{t.size(dims.width, dims.height)}</p> : null}
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.x}</span>
          <TextField type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.y}</span>
          <TextField type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.w}</span>
          <TextField type="number" value={w} onChange={(e) => setW(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.h}</span>
          <TextField type="number" value={h} onChange={(e) => setH(Number(e.target.value))} />
        </label>
      </div>

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!bytes || busy} onClick={run}>
          {busy ? t.cropping : t.crop}
        </Button>
        {!bytes ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(result.width, result.height)}</p>
          <img className="tool__preview" src={previewUrl} alt="cropped result" />
          <DownloadButton bytes={result.bytes} filename="cropped.png" mime="image/png" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
