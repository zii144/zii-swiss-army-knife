import { validateIban } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'German IBAN',
    desc: 'Validate a German (or any) IBAN with the MOD-97 check. On-device.',
    input: 'IBAN',
  },
  de: {
    title: 'IBAN prüfen',
    desc: 'Prüft eine IBAN mit dem MOD-97-Verfahren. Auf dem Gerät.',
    input: 'IBAN',
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
      placeholder="DE89 3704 0044 0532 0130 00"
      strings={{ input: t.input, ...c }}
    />
  );
}
