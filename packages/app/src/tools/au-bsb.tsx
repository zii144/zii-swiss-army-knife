import { validateBsb, generateBsb } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Australian BSB",
    desc: "Validate a 6-digit bank BSB. On-device.",
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
      validate={validateBsb}
      generate={generateBsb}
      placeholder="062-000"
      strings={t}
    />
  );
}
