import { validateIrd, generateIrd } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "New Zealand IRD number",
    desc: "Validate an IRD number checksum, or generate a sample. On-device.",
    input: "IRD number",
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
      validate={validateIrd}
      generate={generateIrd}
      placeholder="49091850"
      strings={{ input: t.input, ...c }}
    />
  );
}
