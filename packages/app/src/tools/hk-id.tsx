import { validateHkid, generateHkid } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Hong Kong ID (HKID)',
    desc: 'Validate a Hong Kong Identity Card number, or generate a sample. On-device.',
    input: 'HKID',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '香港身份證驗證',
    desc: '驗證香港身份證號碼，或產生範例。於裝置上運算。',
    input: '身份證號碼',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function HkIdTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateHkid}
      generate={generateHkid}
      placeholder="A123456(3)"
      strings={t}
    />
  );
}
