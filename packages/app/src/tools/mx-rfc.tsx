import { validateRfc, generateRfc } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Mexican RFC",
    desc: "Validate RFC format (persona física/moral), or generate a sample. On-device.",
    input: "RFC",
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
      validate={validateRfc}
      generate={generateRfc}
      placeholder="XAXX010101000"
      strings={{ input: t.input, ...c }}
    />
  );
}
