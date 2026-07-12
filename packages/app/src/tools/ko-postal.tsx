import { validateKoPostal, generateKoPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Korea postal code",
    desc: "Validate a Korean 5-digit postal code (우편번호). On-device.",
    input: 'Value',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample',
  },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateKoPostal}
      generate={generateKoPostal}
      placeholder="06236"
      strings={t}
    />
  );
}
