import { validatePesel, generatePesel } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Polish PESEL",
    desc: "Validate a PESEL checksum, or generate a sample. On-device.",
    input: "PESEL",
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
      validate={validatePesel}
      generate={generatePesel}
      placeholder="44051401359"
      strings={{ input: t.input, ...c }}
    />
  );
}
