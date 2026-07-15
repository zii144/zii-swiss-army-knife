import { validateCep, generateCep } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Brazilian CEP",
    desc: "Validate an 8-digit CEP, or generate a sample. On-device.",
    input: "CEP",
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
      validate={validateCep}
      generate={generateCep}
      placeholder="01310100"
      strings={{ input: t.input, ...c }}
    />
  );
}
