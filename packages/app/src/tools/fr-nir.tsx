import { validateNir, generateNir } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "French NIR",
    desc: "Validate numéro de sécurité sociale format and key (97). Masked, on-device.",
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
      validate={validateNir}
      generate={generateNir}
      placeholder="1 89 05 75 123 456 78"
      strings={t}
    />
  );
}
