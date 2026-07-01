import { validateMyNumber, generateMyNumber } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Japan My Number',
    desc: 'Validate a Japanese My Number (マイナンバー), or generate a sample. On-device.',
    input: 'My Number (12 digits)',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
  'zh-TW': {
    title: '日本 My Number 驗證',
    desc: '驗證日本個人編號（マイナンバー），或產生範例。於裝置上運算。',
    input: 'My Number（12 碼）',
    valid: '有效 ✓',
    invalid: '無效 ✗',
    generate: '產生範例',
  },
  ja: {
    title: 'マイナンバー検証',
    desc: 'マイナンバー（12桁）を検証、またはサンプルを生成。端末上で動作。',
    input: 'マイナンバー（12桁）',
    valid: '有効 ✓',
    invalid: '無効 ✗',
    generate: 'サンプル生成',
  },
};

export default function JpMyNumberTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateMyNumber}
      generate={generateMyNumber}
      placeholder="123456789018"
      strings={t}
    />
  );
}
