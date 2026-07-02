import { validateTwUbn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Taiwan business number (統編)',
    desc: 'Validate a Taiwan Unified Business Number (統一編號). On-device.',
    input: 'Business number (8 digits)',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: '',
  },
  'zh-TW': {
    title: '統一編號驗證',
    desc: '驗證台灣公司統一編號（8 碼）。於裝置上運算。',
    input: '統一編號（8 碼）',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '',
  },
};

export default function TwUbnTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateTwUbn}
      placeholder="12345675"
      strings={t}
    />
  );
}
