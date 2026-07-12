import { validateCaPostal, generateCaPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Canadian postal code",
    desc: "Validate a Canadian postal code (A1A 1A1). On-device.",
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
      validate={validateCaPostal}
      generate={generateCaPostal}
      placeholder="K1A 0B1"
      strings={t}
    />
  );
}
