import { validateNir, generateNir } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'French NIR',
    desc: 'Validate a numéro de sécurité sociale (mod-97 key), or generate a sample. On-device — never stored.',
    input: 'NIR',
  },
  fr: {
    title: 'Numéro de sécurité sociale',
    desc: 'Vérifie un NIR (clé mod 97) ou génère un exemple. Sur l’appareil — jamais stocké.',
    input: 'NIR',
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
      validate={validateNir}
      generate={generateNir}
      placeholder="1 85 05 99 123 456 78"
      strings={{ input: t.input, ...c }}
    />
  );
}
