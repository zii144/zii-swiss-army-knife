import { validateUen, generateUen } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Singapore UEN",
    desc: "Validate a Unique Entity Number format, or generate a sample. On-device.",
    input: "UEN",
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
      validate={validateUen}
      generate={generateUen}
      placeholder="201912345A"
      strings={{ input: t.input, ...c }}
    />
  );
}
