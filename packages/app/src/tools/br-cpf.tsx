import { validateCpf, generateCpf } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Brazilian CPF",
    desc: "Validate a CPF checksum, or generate a sample. On-device.",
    input: "CPF",
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
      validate={validateCpf}
      generate={generateCpf}
      placeholder="39053344705"
      strings={{ input: t.input, ...c }}
    />
  );
}
