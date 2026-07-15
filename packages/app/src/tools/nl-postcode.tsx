import { validateNlPostcode, generateNlPostcode } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Dutch postcode",
    desc: "Validate a Dutch postcode (1234 AB), or generate a sample. On-device.",
    input: "Postcode",
  },
  nl: { title: "Postcode", desc: "Controleer een Nederlandse postcode (1234 AB).", input: "Postcode" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateNlPostcode}
      generate={generateNlPostcode}
      placeholder="1012 AB"
      strings={{ input: t.input, ...c }}
    />
  );
}
