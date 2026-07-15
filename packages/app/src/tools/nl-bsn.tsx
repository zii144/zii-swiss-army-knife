import { validateBsn, generateBsn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Dutch BSN",
    desc: "Validate a 9-digit burgerservicenummer (11-proef), or generate a sample. On-device.",
    input: "BSN",
  },
  nl: { title: "BSN", desc: "Controleer een BSN met de 11-proef, of genereer een voorbeeld.", input: "BSN" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateBsn}
      generate={generateBsn}
      placeholder="123456782"
      strings={{ input: t.input, ...c }}
    />
  );
}
