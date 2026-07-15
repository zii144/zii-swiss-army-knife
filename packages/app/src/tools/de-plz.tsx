import { validateDePlz, generateDePlz } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'German PLZ',
    desc: 'Validate a 5-digit Postleitzahl, or generate a sample. On-device.',
    input: 'PLZ',
  },
  de: {
    title: 'Postleitzahl',
    desc: 'Prüft eine 5-stellige PLZ oder erzeugt ein Beispiel. Auf dem Gerät.',
    input: 'PLZ',
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
      validate={validateDePlz}
      generate={generateDePlz}
      placeholder="10115"
      strings={{ input: t.input, ...c }}
    />
  );
}
