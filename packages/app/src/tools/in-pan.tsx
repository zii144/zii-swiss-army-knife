import { validatePan, generatePan } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Indian PAN",
    desc: "Validate a Permanent Account Number format (AAAAA9999A), or generate a sample. On-device.",
    input: "PAN",
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
      validate={validatePan}
      generate={generatePan}
      placeholder="ABCDE1234F"
      strings={{ input: t.input, ...c }}
    />
  );
}
