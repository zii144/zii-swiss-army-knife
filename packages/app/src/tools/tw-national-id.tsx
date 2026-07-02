import { validateTwNationalId, generateTwNationalId } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Taiwan National ID',
    desc: 'Validate a Taiwan National ID number (中華民國身分證), or generate a sample. On-device.',
    input: 'ID number',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '身分證字號驗證',
    desc: '驗證中華民國身分證字號，或產生範例。於裝置上運算。',
    input: '身分證字號',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
};

export default function TwNationalIdTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTwNationalId}
      generate={generateTwNationalId}
      placeholder="A123456789"
      strings={t}
    />
  );
}
