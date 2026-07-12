import { validateCaTransit, generateCaTransit } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canadian transit number',
    desc: 'Validate a Canadian bank transit (5) + institution (3) number, or generate a sample. On-device.',
    input: 'Transit-Institution',
  },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateCaTransit}
      generate={generateCaTransit}
      placeholder="12345-001"
      strings={{ input: t.input, ...c }}
    />
  );
}
