import { validateSin, generateSin } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canadian SIN',
    desc: 'Validate a Canadian Social Insurance Number (Luhn check), or generate a sample. On-device.',
    input: 'SIN',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '加拿大 SIN',
    desc: '驗證加拿大社會保險號碼（Luhn），或產生範例。於裝置上運算。',
    input: 'SIN',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function CaSinTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateSin}
      generate={generateSin}
      placeholder="046-454-286"
      strings={t}
    />
  );
}
