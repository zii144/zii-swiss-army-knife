import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Dutch IBAN",
    desc: "Validate a Dutch (or any) IBAN with the MOD-97 check. On-device.",
    input: "IBAN",
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
      validate={validateIban}
      placeholder="NL91 ABNA 0417 1643 00"
      strings={{ input: t.input, ...c }}
    />
  );
}
