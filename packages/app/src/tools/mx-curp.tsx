import { validateCurp, generateCurp } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Mexican CURP",
    desc: "Validate CURP format, or generate a sample. On-device.",
    input: "CURP",
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
      validate={validateCurp}
      generate={generateCurp}
      placeholder="GARC850101HDFRRN09"
      strings={{ input: t.input, ...c }}
    />
  );
}
