import { validateEsCif, generateEsCif } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Spanish CIF",
    desc: "Validate a Spanish company tax ID (CIF) checksum, or generate a sample. On-device.",
    input: "CIF",
  },
  es: { title: "CIF", desc: "Valida el dígito de control de un CIF.", input: "CIF" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateEsCif}
      generate={generateEsCif}
      placeholder="B12345674"
      strings={{ input: t.input, ...c }}
    />
  );
}
