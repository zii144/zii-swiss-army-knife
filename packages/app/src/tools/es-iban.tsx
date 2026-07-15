import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Spanish IBAN",
    desc: "Validate a Spanish (or any) IBAN with the MOD-97 check. On-device.",
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
      placeholder="ES91 2100 0418 4502 0005 1332"
      strings={{ input: t.input, ...c }}
    />
  );
}
