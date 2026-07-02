import { useEffect, useState } from 'react';
import { totpCode } from '@zii/compute';
import { ToolPage } from '../components/ToolPage';
import { Button, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'TOTP code',
    desc: 'Generate a 6-digit authenticator code from a base32 secret on your device. Nothing is sent anywhere.',
    secret: 'Base32 secret',
    code: 'Current code',
    copy: 'Copy',
    copied: 'Copied',
    refresh: 'Refresh',
    invalid: 'Invalid secret',
  },
  'zh-TW': {
    title: 'TOTP 驗證碼',
    desc: '以 Base32 密鑰在裝置上產生 6 位數驗證碼，完全不上傳。',
    secret: 'Base32 密鑰',
    code: '目前驗證碼',
    copy: '複製',
    copied: '已複製',
    refresh: '重新整理',
    invalid: '密鑰無效',
  },
};

export default function TotpTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = (): void => {
    setError(null);
    void totpCode(secret)
      .then(setCode)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  };

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(id);
  }, [secret]);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.secret}</span><TextField value={secret} onChange={(e) => setSecret(e.target.value.trim())} /></label>
      <div className="tool__actions"><Button variant="primary" onClick={refresh}>{t.refresh}</Button></div>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {code ? (
        <div className="tool__result">
          <p className="tool__hint">{t.code}</p>
          <p><strong style={{ fontSize: '2rem', letterSpacing: '0.2em' }}>{code}</strong></p>
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
