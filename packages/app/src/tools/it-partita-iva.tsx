import { validatePartitaIva, generatePartitaIva } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Italian partita IVA",
    desc: "Validate an 11-digit partita IVA checksum, or generate a sample. On-device.",
    input: "Partita IVA",
  },
  it: { title: "Partita IVA", desc: "Verifica la cifra di controllo, o genera un esempio.", input: "Partita IVA" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validatePartitaIva}
      generate={generatePartitaIva}
      placeholder="12345678903"
      strings={{ input: t.input, ...c }}
    />
  );
}
