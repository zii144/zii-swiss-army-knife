import { useState } from 'react';
import { canRunFfmpegWasm, extractAudio } from '@zii/compute-wasm/video';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const FORMATS = [
  { value: 'mp3', label: 'MP3', mime: 'audio/mpeg', ext: 'mp3' },
  { value: 'm4a', label: 'M4A (AAC)', mime: 'audio/mp4', ext: 'm4a' },
] as const;

const L = {
  en: {
    title: 'Extract audio',
    desc: 'Strip the video track and save audio from MP4/MOV/WebM on your device with ffmpeg.wasm.',
    pick: 'Choose a video',
    format: 'Output format',
    extract: 'Extract audio',
    extracting: 'Extracting…',
    none: 'Choose a video file.',
    done: 'Audio ready.',
    download: 'Download',
    unsupported:
      'Audio extraction needs a cross-origin-isolated browser (SharedArrayBuffer). Open this page from the production host or enable COOP/COEP headers locally.',
  },
  'zh-TW': {
    title: '擷取音訊',
    desc: '使用 ffmpeg.wasm 從 MP4/MOV/WebM 擷取音訊，完全不上傳。',
    pick: '選擇影片',
    format: '輸出格式',
    extract: '擷取音訊',
    extracting: '擷取中…',
    none: '請選擇影片檔案。',
    done: '音訊完成。',
    download: '下載',
    unsupported:
      '擷取音訊需要跨來源隔離的瀏覽器環境（SharedArrayBuffer）。請從正式網站開啟，或在本地啟用 COOP/COEP 標頭。',
  },
};

export default function AudioExtractTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('mp3');
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
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.mp4';
      const fmt = format === 'm4a' ? 'm4a' : 'mp3';
      setResult(
        await extractAudio(await readFileBytes(file), {
          inputName: `input${ext}`,
          format: fmt,
        }),
      );
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
          {busy ? t.extracting : t.extract}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton
            bytes={result}
            filename={`audio.${fmt.ext}`}
            mime={fmt.mime}
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
