import { validateDeTaxId, generateDeTaxId } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "German tax ID",
    desc: "Validate a German Steuerliche Identifikationsnummer format. On-device.",
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
      validate={validateDeTaxId}
      generate={generateDeTaxId}
      placeholder="12345678901"
      strings={t}
    />
  );
}
