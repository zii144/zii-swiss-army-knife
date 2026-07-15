import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Portuguese IBAN",
    desc: "Validate a Portuguese (or any) IBAN with the MOD-97 check. On-device.",
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
      placeholder="PT50 0002 0123 1234 5678 9015 4"
      strings={{ input: t.input, ...c }}
    />
  );
}
