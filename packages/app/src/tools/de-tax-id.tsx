import { validateDeTaxId, generateDeTaxId } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'German tax ID',
    desc: 'Validate an 11-digit Identifikationsnummer (IdNr), or generate a sample. On-device.',
    input: 'IdNr',
  },
  de: {
    title: 'Steuerliche IdNr',
    desc: 'Prüft eine 11-stellige Identifikationsnummer oder erzeugt ein Beispiel. Auf dem Gerät.',
    input: 'IdNr',
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
      validate={validateDeTaxId}
      generate={generateDeTaxId}
      placeholder="12 345 678 901"
      strings={{ input: t.input, ...c }}
    />
  );
}
