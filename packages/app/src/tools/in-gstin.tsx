import { validateGstin, generateGstin } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Indian GSTIN",
    desc: "Validate a 15-character GSTIN format (embeds a PAN), or generate a sample. On-device.",
    input: "GSTIN",
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
      validate={validateGstin}
      generate={generateGstin}
      placeholder="22ABCDE1234F1Z5"
      strings={{ input: t.input, ...c }}
    />
  );
}
