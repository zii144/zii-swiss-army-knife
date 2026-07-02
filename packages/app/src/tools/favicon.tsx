import { useState } from 'react';
import { squareThumb } from '../lib/imagekit';
import { createZip, type ZipEntries } from '@zii/compute-wasm/archive';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

const L = {
  en: {
    title: 'Favicon generator',
    desc: 'Turn any square-ish image into a set of favicon/app-icon PNGs, zipped on your device.',
    pick: 'Choose an image',
    generate: 'Generate',
    generating: 'Generating…',
    none: 'Choose an image (square works best).',
    done: (n: number) => `${n} sizes ready.`,
    download: 'Download favicons.zip',
  },
  'zh-TW': {
    title: 'Favicon 產生器',
    desc: '在裝置上將圖片轉成一組 favicon／App 圖示 PNG 並打包成 ZIP。',
    pick: '選擇圖片',
    generate: '產生',
    generating: '產生中…',
    none: '請選擇圖片（方形最佳）。',
    done: (n: number) => `已產生 ${n} 種尺寸。`,
    download: '下載 favicons.zip',
  },
};

export default function FaviconTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [zip, setZip] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!bytes) return;
    setBusy(true);
    setError(null);
    setZip(null);
    try {
      const entries: ZipEntries = {};
      for (const s of SIZES) entries[`favicon-${s}x${s}.png`] = await squareThumb(bytes, s);
      setZip(createZip(entries));
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
            setZip(null);
            if (!f) {
              setBytes(null);
              return;
            }
            void readFileBytes(f).then(setBytes);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!bytes || busy} onClick={run}>
          {busy ? t.generating : t.generate}
        </Button>
        {!bytes ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {zip ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(SIZES.length)}</p>
          <DownloadButton bytes={zip} filename="favicons.zip" mime="application/zip" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
