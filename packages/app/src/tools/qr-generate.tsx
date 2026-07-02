import { useState } from 'react';
import { generateQr } from '@zii/compute-wasm/qr';
import {
  eventQrPayload,
  vcardQrPayload,
  wifiQrPayload,
  type WifiSecurity,
} from '../lib/qr-payloads';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type QrMode = 'text' | 'wifi' | 'vcard' | 'event';

const L = {
  en: {
    title: 'QR code generator',
    desc: 'Generate QR codes for text, URLs, Wi-Fi, contacts, or calendar events on your device.',
    mode: 'Type',
    text: 'Text / URL',
    wifi: 'Wi-Fi',
    vcard: 'Contact (vCard)',
    event: 'Calendar event',
    label: 'Text or URL',
    placeholder: 'https://zii.app',
    ssid: 'Network name (SSID)',
    password: 'Password',
    security: 'Security',
    hidden: 'Hidden network',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    org: 'Organization',
    summary: 'Event title',
    start: 'Start',
    end: 'End',
    location: 'Location',
    generate: 'Generate',
    generating: 'Generating…',
    done: 'QR code ready.',
    download: 'Download qr.png',
  },
  'zh-TW': {
    title: 'QR Code 產生器',
    desc: '產生文字、網址、Wi-Fi、聯絡人或行事曆活動的 QR Code，於裝置上運算。',
    mode: '類型',
    text: '文字／網址',
    wifi: 'Wi-Fi',
    vcard: '聯絡人（vCard）',
    event: '行事曆活動',
    label: '文字或網址',
    placeholder: 'https://zii.app',
    ssid: '網路名稱（SSID）',
    password: '密碼',
    security: '安全性',
    hidden: '隱藏網路',
    name: '姓名',
    phone: '電話',
    email: 'Email',
    org: '組織',
    summary: '活動標題',
    start: '開始',
    end: '結束',
    location: '地點',
    generate: '產生',
    generating: '產生中…',
    done: 'QR Code 完成。',
    download: '下載 qr.png',
  },
};

export default function QrGenerateTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<QrMode>('text');
  const [text, setText] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState<WifiSecurity>('WPA');
  const [hidden, setHidden] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [summary, setSummary] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPayload = (): string => {
    switch (mode) {
      case 'text':
        return text;
      case 'wifi':
        return wifiQrPayload({ ssid, password, security, hidden });
      case 'vcard':
        return vcardQrPayload({ fullName: name, phone, email, org });
      case 'event':
        return eventQrPayload({ summary, start, end, location });
    }
  };

  const canGenerate =
    mode === 'text'
      ? text.trim().length > 0
      : mode === 'wifi'
        ? ssid.trim().length > 0
        : mode === 'vcard'
          ? name.trim().length > 0
          : summary.trim().length > 0 && start !== '' && end !== '';

  const run = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    try {
      const png = await generateQr(buildPayload());
      setResult(png);
      setPreviewUrl(
        URL.createObjectURL(new Blob([png as unknown as BlobPart], { type: 'image/png' })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const modeOptions = [
    { value: 'text', label: t.text },
    { value: 'wifi', label: t.wifi },
    { value: 'vcard', label: t.vcard },
    { value: 'event', label: t.event },
  ];

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.mode}</span>
        <Select
          value={mode}
          options={modeOptions}
          onChange={(v) => {
            setMode(v as QrMode);
            setResult(null);
          }}
          ariaLabel={t.mode}
        />
      </div>

      {mode === 'text' ? (
        <label className="tool__field">
          <span>{t.label}</span>
          <TextField
            type="text"
            value={text}
            placeholder={t.placeholder}
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
            }}
          />
        </label>
      ) : null}

      {mode === 'wifi' ? (
        <>
          <label className="tool__field">
            <span>{t.ssid}</span>
            <TextField value={ssid} onChange={(e) => setSsid(e.target.value)} />
          </label>
          <label className="tool__field">
            <span>{t.password}</span>
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="tool__field">
            <span>{t.security}</span>
            <Select
              value={security}
              options={[
                { value: 'WPA', label: 'WPA/WPA2' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: 'Open' },
              ]}
              onChange={(v) => setSecurity(v as WifiSecurity)}
              ariaLabel={t.security}
            />
          </div>
          <label className="tool__check">
            <input type="checkbox" checked={hidden} onChange={() => setHidden((v) => !v)} />
            {t.hidden}
          </label>
        </>
      ) : null}

      {mode === 'vcard' ? (
        <>
          <label className="tool__field">
            <span>{t.name}</span>
            <TextField value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="tool__field">
            <span>{t.phone}</span>
            <TextField value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="tool__field">
            <span>{t.email}</span>
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="tool__field">
            <span>{t.org}</span>
            <TextField value={org} onChange={(e) => setOrg(e.target.value)} />
          </label>
        </>
      ) : null}

      {mode === 'event' ? (
        <>
          <label className="tool__field">
            <span>{t.summary}</span>
            <TextField value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
          <div className="tool__inline">
            <label className="tool__field">
              <span>{t.start}</span>
              <TextField type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label className="tool__field">
              <span>{t.end}</span>
              <TextField type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </label>
          </div>
          <label className="tool__field">
            <span>{t.location}</span>
            <TextField value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
        </>
      ) : null}

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!canGenerate || busy} onClick={run}>
          {busy ? t.generating : t.generate}
        </Button>
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <img className="tool__preview tool__preview--qr" src={previewUrl} alt="QR code" />
          <DownloadButton bytes={result} filename="qr.png" mime="image/png" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
