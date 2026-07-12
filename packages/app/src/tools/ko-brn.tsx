import { validateKoBrn, generateKoBrn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Korea business number",
    desc: "Validate a Korean business registration number (사업자등록번호) checksum. On-device.",
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
      validate={validateKoBrn}
      generate={generateKoBrn}
      placeholder="123-45-67890"
      strings={t}
    />
  );
}
