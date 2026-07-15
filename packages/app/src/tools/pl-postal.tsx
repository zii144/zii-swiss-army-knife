import { validatePlPostal, generatePlPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Polish postal code",
    desc: "Validate a kod pocztowy (NN-NNN), or generate a sample. On-device.",
    input: "Kod pocztowy",
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
      validate={validatePlPostal}
      generate={generatePlPostal}
      placeholder="00-001"
      strings={{ input: t.input, ...c }}
    />
  );
}
