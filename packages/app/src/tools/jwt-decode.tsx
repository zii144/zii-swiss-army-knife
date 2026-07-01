import { useState } from 'react';
import { decodeJwt } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'JWT decoder',
    desc: 'Decode a JSON Web Token to read its header and payload. Decode only — no signature check. On-device.',
    input: 'Token',
    placeholder: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.…',
    header: 'Header',
    payload: 'Payload',
  },
  'zh-TW': {
    title: 'JWT 解碼',
    desc: '解碼 JSON Web Token 以檢視其標頭與內容。僅解碼，不驗證簽章。於裝置上處理。',
    input: 'Token',
    placeholder: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.…',
    header: '標頭',
    payload: '內容',
  },
};

export default function JwtDecodeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [token, setToken] = useState('');

  let header = '';
  let payload = '';
  let error: string | null = null;
  if (token.trim()) {
    try {
      const d = decodeJwt(token);
      header = JSON.stringify(d.header, null, 2);
      payload = JSON.stringify(d.payload, null, 2);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea
          mono
          rows={4}
          value={token}
          placeholder={t.placeholder}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
      {error ? <p className="tool__error">{error}</p> : null}
      {header ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.header}</span>
            <TextArea mono rows={4} value={header} readOnly />
          </label>
          <label className="tool__field">
            <span>{t.payload}</span>
            <TextArea mono rows={8} value={payload} readOnly />
          </label>
        </div>
      ) : null}
    </ToolPage>
  );
}
