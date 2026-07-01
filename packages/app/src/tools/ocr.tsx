import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { ToolPage } from '../components/ToolPage';
import { Button, FileField, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const LANGS = [
  { value: 'eng', label: 'English' },
  { value: 'chi_tra', label: '繁體中文' },
  { value: 'chi_sim', label: '简体中文' },
  { value: 'jpn', label: '日本語' },
  { value: 'kor', label: '한국어' },
];

const L = {
  en: {
    title: 'Image to text (OCR)',
    desc: 'Extract text from an image on your device. The recognition model downloads on first use (needs network once).',
    pick: 'Choose an image',
    lang: 'Language',
    run: 'Recognize',
    working: 'Recognizing… (first run downloads the model)',
    none: 'Choose an image with text.',
    result: 'Extracted text',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: '圖片轉文字（OCR）',
    desc: '在裝置上從圖片擷取文字。辨識模型於首次使用時下載（僅需一次網路）。',
    pick: '選擇圖片',
    lang: '語言',
    run: '辨識',
    working: '辨識中…（首次會下載模型）',
    none: '請選擇含文字的圖片。',
    result: '擷取的文字',
    copy: '複製',
    copied: '已複製',
  },
};

export default function OcrTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [ocrLang, setOcrLang] = useState('eng');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setText('');
    try {
      const worker = await createWorker(ocrLang);
      const { data } = await worker.recognize(file);
      setText(data.text.trim());
      await worker.terminate();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
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
            setText('');
          }}
        />
      </div>
      <div className="tool__field">
        <span>{t.lang}</span>
        <Select value={ocrLang} options={LANGS} onChange={setOcrLang} ariaLabel={t.lang} />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.working : t.run}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {text ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.result}</span>
            <TextArea rows={8} value={text} readOnly />
          </label>
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
