import { validateIfsc, generateIfsc } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Indian IFSC",
    desc: "Validate an 11-character IFSC (AAAA0XXXXXX), or generate a sample. On-device.",
    input: "IFSC",
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
      validate={validateIfsc}
      generate={generateIfsc}
      placeholder="SBIN0001234"
      strings={{ input: t.input, ...c }}
    />
  );
}
