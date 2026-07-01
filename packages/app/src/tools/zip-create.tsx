import { useState } from 'react';
import { createZip, type ZipEntries } from '@zii/compute-wasm/archive';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Create ZIP',
    desc: 'Bundle several files into one ZIP archive, on your device. Nothing is uploaded.',
    pick: 'Choose files',
    zip: 'Create ZIP',
    zipping: 'Zipping…',
    none: 'Choose one or more files.',
    selected: (n: number) => `${n} file${n === 1 ? '' : 's'} selected`,
    done: 'Archive ready.',
    download: 'Download archive.zip',
  },
  'zh-TW': {
    title: '建立 ZIP',
    desc: '在裝置上將多個檔案打包成一個 ZIP 壓縮檔，完全不上傳。',
    pick: '選擇檔案',
    zip: '建立 ZIP',
    zipping: '壓縮中…',
    none: '請選擇一個以上的檔案。',
    selected: (n: number) => `已選擇 ${n} 個檔案`,
    done: '壓縮完成。',
    download: '下載 archive.zip',
  },
};

export default function ZipCreateTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const entries: ZipEntries = {};
      for (const f of files) entries[f.name] = await readFileBytes(f);
      setResult(createZip(entries));
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
          multiple
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFiles(fs);
            setResult(null);
          }}
        />
      </div>
      {files.length > 0 ? <p className="tool__hint">{t.selected(files.length)}</p> : null}

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={files.length === 0 || busy} onClick={run}>
          {busy ? t.zipping : t.zip}
        </Button>
        {files.length === 0 ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton
            bytes={result}
            filename="archive.zip"
            mime="application/zip"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
