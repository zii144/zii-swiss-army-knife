import { useEffect, useState } from 'react';
import { hmacSha256Hex, hmacSha512Hex, type HmacAlgorithm } from '@zii/compute';
import { ToolPage } from '../components/ToolPage';
import { Button, Select, TextArea, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'HMAC generator',
    desc: 'Compute HMAC-SHA256 or HMAC-SHA512 of a message with a secret key on your device.',
    secret: 'Secret key',
    message: 'Message',
    algorithm: 'Algorithm',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: 'HMAC 產生器',
    desc: '使用密鑰在裝置上計算訊息的 HMAC-SHA256 或 HMAC-SHA512。',
    secret: '密鑰',
    message: '訊息',
    algorithm: '演算法',
    copy: '複製',
    copied: '已複製',
  },
};

export default function HmacTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [secret, setSecret] = useState('key');
  const [message, setMessage] = useState('The quick brown fox');
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const [digest, setDigest] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const hex =
        algorithm === 'SHA-512'
          ? await hmacSha512Hex(secret, message)
          : await hmacSha256Hex(secret, message);
      if (active) setDigest(hex);
    })();
    return () => {
      active = false;
    };
  }, [secret, message, algorithm]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__field">
        <span>{t.algorithm}</span>
        <Select
          value={algorithm}
          options={[
            { value: 'SHA-256', label: 'HMAC-SHA-256' },
            { value: 'SHA-512', label: 'HMAC-SHA-512' },
          ]}
          onChange={(v) => setAlgorithm(v as HmacAlgorithm)}
          ariaLabel={t.algorithm}
        />
      </div>
      <label className="tool__field">
        <span>{t.secret}</span>
        <TextField type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
      </label>
      <label className="tool__field">
        <span>{t.message}</span>
        <TextArea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <div className="tool__row">
        <code className="tool__row-value tool__row-value--mono">{digest}</code>
        <Button variant="ghost" onClick={copy}>
          {copied ? t.copied : t.copy}
        </Button>
      </div>
    </ToolPage>
  );
}
