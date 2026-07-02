import { validateHkBr, generateHkBr } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Hong Kong BR number',
    desc: 'Validate a Hong Kong Business Registration Number (8 digits), or generate a sample. On-device.',
    input: 'BR number',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '香港商業登記號碼',
    desc: '驗證香港商業登記號碼（8 碼），或產生範例。於裝置上運算。',
    input: '商業登記號碼',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function HkBrTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateHkBr}
      generate={generateHkBr}
      placeholder="36780058"
      strings={t}
    />
  );
}
