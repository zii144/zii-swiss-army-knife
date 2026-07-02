import { useState } from 'react';
import { canRunFfmpegWasm, convertVideo } from '@zii/compute-wasm/video';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const FORMATS = [
  { value: 'mp4', label: 'MP4', mime: 'video/mp4' },
  { value: 'webm', label: 'WebM', mime: 'video/webm' },
] as const;

const L = {
  en: {
    title: 'Convert video',
    desc: 'Transcode a video file on your device with ffmpeg.wasm. Nothing is uploaded.',
    pick: 'Choose a video',
    format: 'Output format',
    convert: 'Convert',
    converting: 'Converting…',
    none: 'Choose a video file.',
    done: 'Video ready.',
    download: 'Download',
    unsupported:
      'Video conversion needs a cross-origin-isolated browser (SharedArrayBuffer). Open this page from the production host or enable COOP/COEP headers locally.',
  },
  'zh-TW': {
    title: '影片轉檔',
    desc: '使用 ffmpeg.wasm 在裝置上轉換影片，完全不上傳。',
    pick: '選擇影片',
    format: '輸出格式',
    convert: '轉換',
    converting: '轉換中…',
    none: '請選擇影片檔案。',
    done: '影片完成。',
    download: '下載',
    unsupported:
      '影片轉檔需要跨來源隔離的瀏覽器環境（SharedArrayBuffer）。請從正式網站開啟，或在本地啟用 COOP/COEP 標頭。',
  },
};

export default function VideoConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('mp4');
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = canRunFfmpegWasm();

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.mov';
      const out = await convertVideo(await readFileBytes(file), {
        to: format,
        inputName: `input${ext}`,
      });
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const fmt = FORMATS.find((f) => f.value === format) ?? FORMATS[0];
  const formatOptions = FORMATS.map((f) => ({ value: f.value, label: f.label }));

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
      offline={false}
    >
      {!supported ? <p className="tool__error">{t.unsupported}</p> : null}
      <div className="tool__field">
        <span>{t.pick}</span>
        <FileField
          accept="video/*,.mp4,.mov,.webm,.mkv,.avi"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__field">
        <span>{t.format}</span>
        <Select value={format} options={formatOptions} onChange={setFormat} ariaLabel={t.format} />
      </div>
      <div className="tool__actions">
        <Button
          variant="primary"
          loading={busy}
          disabled={!file || busy || !supported}
          onClick={run}
        >
          {busy ? t.converting : t.convert}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton
            bytes={result}
            filename={`converted.${fmt.value}`}
            mime={fmt.mime}
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
