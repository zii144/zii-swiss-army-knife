import { validateNzPostal, generateNzPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "New Zealand postcode",
    desc: "Validate a 4-digit postcode, or generate a sample. On-device.",
    input: "Postcode",
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
      validate={validateNzPostal}
      generate={generateNzPostal}
      placeholder="6011"
      strings={{ input: t.input, ...c }}
    />
  );
}
