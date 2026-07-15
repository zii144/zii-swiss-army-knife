import { validateAbn, generateAbn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Australian ABN',
    desc: 'Validate an Australian Business Number (mod-89), or generate a sample. On-device.',
    input: 'ABN',
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
      validate={validateAbn}
      generate={generateAbn}
      placeholder="51 824 753 556"
      strings={{ input: t.input, ...c }}
    />
  );
}
