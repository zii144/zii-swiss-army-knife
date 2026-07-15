import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Polish IBAN",
    desc: "Validate a Polish (or any) IBAN with the MOD-97 check. On-device.",
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
      placeholder="PL61 1090 1014 0000 0712 1981 2874"
      strings={{ input: t.input, ...c }}
    />
  );
}
