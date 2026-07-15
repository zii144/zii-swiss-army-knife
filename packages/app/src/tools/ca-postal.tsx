import { validateCaPostal, generateCaPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canadian postal code',
    desc: 'Validate a Canadian postal code (A1A 1A1), or generate a sample. On-device.',
    input: 'Postal code',
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
      validate={validateCaPostal}
      generate={generateCaPostal}
      placeholder="K1A 0B1"
      strings={{ input: t.input, ...c }}
    />
  );
}
