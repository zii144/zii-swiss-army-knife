import { useState } from 'react';
import { extractIpv4 } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Extract IPv4', desc: 'Find IPv4 addresses in text.', input: 'Text', none: 'No IPv4 addresses found', copy: 'Copy all', copied: 'Copied' },
  'zh-TW': { title: '擷取 IPv4', desc: '從文字中找出 IPv4 位址。', input: '文字', none: '未找到 IPv4', copy: '全部複製', copied: '已複製' },
};

export default function ExtractIpv4Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Server 192.168.1.1 and backup 10.0.0.5');
  const [copied, setCopied] = useState(false);
  const ips = extractIpv4(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {ips.length ? (
        <>
          <div className="tool__rows">{ips.map((ip) => <div key={ip} className="tool__row"><span className="tool__row-value">{ip}</span></div>)}</div>
          <Button variant="ghost" onClick={async () => { await navigator.clipboard.writeText(ips.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? t.copied : t.copy}</Button>
        </>
      ) : <p className="tool__hint">{t.none}</p>}
    </ToolPage>
  );
}
