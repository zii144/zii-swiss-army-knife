import { validateInPincode, generateInPincode } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Indian PIN code",
    desc: "Validate a 6-digit PIN code, or generate a sample. On-device.",
    input: "PIN code",
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
      validate={validateInPincode}
      generate={generateInPincode}
      placeholder="110001"
      strings={{ input: t.input, ...c }}
    />
  );
}
