import { validateBrPhone, generateBrPhone } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Brazilian phone number",
    desc: "Validate an 11-digit mobile (DDD + 9…), or generate a sample. On-device.",
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
      validate={validateBrPhone}
      generate={generateBrPhone}
      placeholder="11987654321"
      strings={{ input: t.input, ...c }}
    />
  );
}
