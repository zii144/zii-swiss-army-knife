import { validatePtNif, generatePtNif } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Portuguese NIF",
    desc: "Validate a NIF checksum, or generate a sample. On-device.",
    input: "NIF",
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
      validate={validatePtNif}
      generate={generatePtNif}
      placeholder="123456789"
      strings={{ input: t.input, ...c }}
    />
  );
}
