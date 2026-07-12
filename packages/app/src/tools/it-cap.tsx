import { validateItCap, generateItCap } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Italian CAP",
    desc: "Validate a 5-digit CAP, or generate a sample. On-device.",
    input: "CAP",
  },
  it: { title: "CAP", desc: "Verifica un CAP a 5 cifre, o genera un esempio.", input: "CAP" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateItCap}
      generate={generateItCap}
      placeholder="00118"
      strings={{ input: t.input, ...c }}
    />
  );
}
