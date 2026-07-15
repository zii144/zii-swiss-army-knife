import { validateNric, generateNric } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Singapore NRIC / FIN",
    desc: "Validate an NRIC/FIN checksum letter, or generate a sample. On-device.",
    input: "NRIC / FIN",
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
      validate={validateNric}
      generate={generateNric}
      placeholder="S1234567D"
      strings={{ input: t.input, ...c }}
    />
  );
}
