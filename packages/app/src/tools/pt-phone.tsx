import { validatePtPhone, generatePtPhone } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Portuguese phone number",
    desc: "Validate a 9-digit PT phone (mobile/landline), or generate a sample. On-device.",
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
      validate={validatePtPhone}
      generate={generatePtPhone}
      placeholder="912345678"
      strings={{ input: t.input, ...c }}
    />
  );
}
