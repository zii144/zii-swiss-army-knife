import { useMemo, useState } from 'react';
import { extractEmails, extractUrls } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Extract emails & URLs', desc: 'Pull email addresses and http(s) links from text on your device.', input: 'Text', extract: 'Extract', emails: 'Emails', urls: 'URLs', copy: 'Copy', copied: 'Copied', none: 'Nothing found.' },
  'zh-TW': { title: '擷取 Email 與網址', desc: '從文字中擷取 Email 與 http(s) 連結，於裝置上處理。', input: '文字', extract: '擷取', emails: 'Email', urls: '網址', copy: '複製', copied: '已複製', none: '找不到項目。' },
};

export default function ExtractUrlsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Contact us@zii.app or visit https://zii.app/docs');
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const emails = useMemo(() => (show ? extractEmails(input) : []), [input, show]);
  const urls = useMemo(() => (show ? extractUrls(input) : []), [input, show]);

  const copy = async (key: string, lines: string[]): Promise<void> => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch { /* ignore */ }
  };

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={6} value={input} onChange={(e) => { setInput(e.target.value); setShow(false); }} /></label>
      <div className="tool__actions"><Button variant="primary" onClick={() => setShow(true)}>{t.extract}</Button></div>
      {show && emails.length === 0 && urls.length === 0 ? <p className="tool__hint">{t.none}</p> : null}
      {emails.length > 0 ? (
        <div className="tool__result">
          <p><strong>{t.emails}</strong></p>
          <TextArea mono rows={4} value={emails.join('\n')} readOnly />
          <Button variant="ghost" onClick={() => copy('emails', emails)}>{copied === 'emails' ? t.copied : t.copy}</Button>
        </div>
      ) : null}
      {urls.length > 0 ? (
        <div className="tool__result">
          <p><strong>{t.urls}</strong></p>
          <TextArea mono rows={4} value={urls.join('\n')} readOnly />
          <Button variant="ghost" onClick={() => copy('urls', urls)}>{copied === 'urls' ? t.copied : t.copy}</Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
