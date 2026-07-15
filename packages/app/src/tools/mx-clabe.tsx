import { validateClabe, generateClabe } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Mexican CLABE",
    desc: "Validate an 18-digit CLABE check digit, or generate a sample. On-device.",
    input: "CLABE",
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
      validate={validateClabe}
      generate={generateClabe}
      placeholder="002010077777777771"
      strings={{ input: t.input, ...c }}
    />
  );
}
