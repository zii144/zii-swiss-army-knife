import { validateCnpj, generateCnpj } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Brazilian CNPJ",
    desc: "Validate a CNPJ checksum, or generate a sample. On-device.",
    input: "CNPJ",
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
      validate={validateCnpj}
      generate={generateCnpj}
      placeholder="11444777000161"
      strings={{ input: t.input, ...c }}
    />
  );
}
