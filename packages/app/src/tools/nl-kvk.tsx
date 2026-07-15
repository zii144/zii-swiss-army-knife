import { validateKvk, generateKvk } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Dutch KvK number",
    desc: "Validate an 8-digit KvK number, or generate a sample. On-device.",
    input: "KvK-nummer",
  },
  nl: { title: "KvK-nummer", desc: "Controleer een 8-cijferig KvK-nummer.", input: "KvK-nummer" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateKvk}
      generate={generateKvk}
      placeholder="12345678"
      strings={{ input: t.input, ...c }}
    />
  );
}
