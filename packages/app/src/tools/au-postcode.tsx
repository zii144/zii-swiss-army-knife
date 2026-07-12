import { validateAuPostcode, generateAuPostcode } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Australian postcode',
    desc: 'Validate a 4-digit Australian postcode (0200–9999), or generate a sample. On-device.',
    input: 'Postcode',
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
      validate={validateAuPostcode}
      generate={generateAuPostcode}
      placeholder="2000"
      strings={{ input: t.input, ...c }}
    />
  );
}
