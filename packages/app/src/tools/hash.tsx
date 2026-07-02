import { useEffect, useState } from 'react';
import { sha256Hex, sha1Hex, sha512Hex, md5Hex } from '@zii/compute';
import { ToolPage } from '../components/ToolPage';
import { Button, TextArea, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Hash (MD5 / SHA)',
    desc: 'Compute MD5, SHA-1, SHA-256, and SHA-512 digests of text or files on your device. Nothing leaves your browser.',
    text: 'Text',
    file: 'File',
    placeholder: 'Type or paste text…',
    pick: 'Choose a file',
    copy: 'Copy',
    copied: 'Copied',
    hashing: 'Hashing file…',
  },
  'zh-TW': {
    title: '雜湊（MD5 / SHA）',
    desc: '在裝置上計算文字或檔案的 MD5、SHA-1、SHA-256、SHA-512 雜湊值，資料不離開瀏覽器。',
    text: '文字',
    file: '檔案',
    placeholder: '輸入或貼上文字…',
    pick: '選擇檔案',
    copy: '複製',
    copied: '已複製',
    hashing: '計算檔案雜湊中…',
  },
};

export default function HashTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [text, setText] = useState('');
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');
  const [md5, setMd5] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const source = fileBytes ?? text;

  useEffect(() => {
    let active = true;
    void (async () => {
      if (fileBytes) setBusy(true);
      const [a, b, c, d] = await Promise.all([
        sha256Hex(source),
        sha512Hex(source),
        sha1Hex(source),
        Promise.resolve(md5Hex(source)),
      ]);
      if (active) {
        setSha256(a);
        setSha512(b);
        setSha1(c);
        setMd5(d);
        setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [source, fileBytes]);

  const onFile = async (file: File | null): Promise<void> => {
    if (!file) {
      setFileBytes(null);
      setFileName(null);
      return;
    }
    setFileBytes(await readFileBytes(file));
    setFileName(file.name);
  };

  const copy = async (key: string, value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const row = (label: string, value: string) => (
    <div className="tool__row">
      <span className="tool__row-label">{label}</span>
      <code className="tool__row-value tool__row-value--mono">{value}</code>
      <Button variant="ghost" onClick={() => copy(label, value)}>
        {copied === label ? t.copied : t.copy}
      </Button>
    </div>
  );

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.text}</span>
        <TextArea
          rows={5}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setFileBytes(null);
            setFileName(null);
          }}
        />
      </label>
      <div className="tool__field">
        <span>{t.file}</span>
        <FileField buttonLabel={t.pick} onFiles={(fs) => void onFile(fs[0] ?? null)} />
        {fileName ? <p className="tool__hint">{fileName}</p> : null}
        {busy ? <p className="tool__hint">{t.hashing}</p> : null}
      </div>
      <div className="tool__rows">
        {row('MD5', md5)}
        {row('SHA-1', sha1)}
        {row('SHA-256', sha256)}
        {row('SHA-512', sha512)}
      </div>
    </ToolPage>
  );
}
