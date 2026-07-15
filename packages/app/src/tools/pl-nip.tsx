import { validateNip, generateNip } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Polish NIP",
    desc: "Validate a NIP checksum, or generate a sample. On-device.",
    input: "NIP",
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
      validate={validateNip}
      generate={generateNip}
      placeholder="5261040828"
      strings={{ input: t.input, ...c }}
    />
  );
}
