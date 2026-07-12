import { validateKoRrn, generateKoRrn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Korea RRN",
    desc: "Validate Korean resident registration number format and checksum only. Never stored. On-device.",
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
      validate={validateKoRrn}
      generate={generateKoRrn}
      placeholder="900101-1234567"
      strings={t}
    />
  );
}
