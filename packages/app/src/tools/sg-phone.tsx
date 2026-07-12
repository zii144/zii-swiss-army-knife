import { validateSgPhone, generateSgPhone } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Singapore phone number",
    desc: "Validate an 8-digit mobile/landline number, or generate a sample. On-device.",
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
      validate={validateSgPhone}
      generate={generateSgPhone}
      placeholder="91234567"
      strings={{ input: t.input, ...c }}
    />
  );
}
