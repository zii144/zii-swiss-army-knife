import { validateTwArc, generateTwArc } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Taiwan ARC (統一證號)',
    desc: 'Validate a new-format Alien Resident Certificate number, or generate a sample. On-device.',
    input: 'ARC number',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '外來人口統一證號驗證',
    desc: '驗證新式外來人口統一證號，或產生範例。於裝置上運算。',
    input: '統一證號',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function TwArcTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTwArc}
      generate={generateTwArc}
      placeholder="A800000014"
      strings={t}
    />
  );
}
