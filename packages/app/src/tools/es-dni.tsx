import { validateEsDni, generateEsDni } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Spanish DNI / NIE",
    desc: "Validate a DNI or NIE checksum letter, or generate a sample DNI. On-device.",
    input: "DNI / NIE",
  },
  es: { title: "DNI / NIE", desc: "Valida la letra de control, o genera un ejemplo.", input: "DNI / NIE" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateEsDni}
      generate={generateEsDni}
      placeholder="12345678Z"
      strings={{ input: t.input, ...c }}
    />
  );
}
