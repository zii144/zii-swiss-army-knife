import { validateEsPostal, generateEsPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Spanish postal code",
    desc: "Validate a 5-digit código postal (province 01–52), or generate a sample. On-device.",
    input: "Código postal",
  },
  es: { title: "Código postal", desc: "Valida un código postal de 5 dígitos.", input: "Código postal" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateEsPostal}
      generate={generateEsPostal}
      placeholder="28013"
      strings={{ input: t.input, ...c }}
    />
  );
}
