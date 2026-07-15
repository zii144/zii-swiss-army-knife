import { validateSgPostal, generateSgPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Singapore postal code",
    desc: "Validate a 6-digit postal code, or generate a sample. On-device.",
    input: "Postal code",
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
      validate={validateSgPostal}
      generate={generateSgPostal}
      placeholder="018956"
      strings={{ input: t.input, ...c }}
    />
  );
}
