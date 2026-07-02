import { validateTfn, generateTfn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Australian TFN',
    desc: 'Validate an Australian Tax File Number (mod-11 check), or generate a sample. On-device.',
    input: 'TFN',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '澳洲 TFN',
    desc: '驗證澳洲稅務檔案號碼（mod-11），或產生範例。於裝置上運算。',
    input: 'TFN',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function AuTfnTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTfn}
      generate={generateTfn}
      placeholder="123 456 782"
      strings={t}
    />
  );
}
