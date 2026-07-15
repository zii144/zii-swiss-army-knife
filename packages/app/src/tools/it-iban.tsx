import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Italian IBAN",
    desc: "Validate an Italian (or any) IBAN with the MOD-97 check. On-device.",
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
      placeholder="IT60 X054 2811 1010 0000 0123 456"
      strings={{ input: t.input, ...c }}
    />
  );
}
