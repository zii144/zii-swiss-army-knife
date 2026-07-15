import { validateCodiceFiscale, generateCodiceFiscale } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Italian codice fiscale",
    desc: "Validate a 16-character codice fiscale checksum, or generate a sample. On-device.",
    input: "Codice fiscale",
  },
  it: { title: "Codice fiscale", desc: "Verifica il carattere di controllo, o genera un esempio.", input: "Codice fiscale" },
};

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validateCodiceFiscale}
      generate={generateCodiceFiscale}
      placeholder="RSSMRA80A01H501U"
      strings={{ input: t.input, ...c }}
    />
  );
}
