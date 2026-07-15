import { validateNzPhone, generateNzPhone } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "New Zealand phone number",
    desc: "Validate a NZ local phone number, or generate a sample. On-device.",
    input: "Phone",
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
      validate={validateNzPhone}
      generate={generateNzPhone}
      placeholder="211234567"
      strings={{ input: t.input, ...c }}
    />
  );
}
