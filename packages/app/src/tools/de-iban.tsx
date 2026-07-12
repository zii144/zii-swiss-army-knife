import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "German IBAN",
    desc: "Validate a German (or SEPA) IBAN checksum. On-device.",
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
      validate={validateIban}
      
      placeholder="DE89 3704 0044 0532 0130 00"
      strings={t}
    />
  );
}
