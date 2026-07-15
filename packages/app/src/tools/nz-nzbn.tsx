import { validateNzbn, generateNzbn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "New Zealand NZBN",
    desc: "Validate a 13-digit NZBN check digit, or generate a sample. On-device.",
    input: "NZBN",
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
      validate={validateNzbn}
      generate={generateNzbn}
      placeholder="9429031503680"
      strings={{ input: t.input, ...c }}
    />
  );
}
