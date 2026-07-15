import { validateFrPostal, generateFrPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'French postal code',
    desc: 'Validate a 5-digit code postal, or generate a sample. On-device.',
    input: 'Code postal',
  },
  fr: {
    title: 'Code postal',
    desc: 'Vérifie un code postal à 5 chiffres, ou génère un exemple. Sur l’appareil.',
    input: 'Code postal',
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
      validate={validateFrPostal}
      generate={generateFrPostal}
      placeholder="75001"
      strings={{ input: t.input, ...c }}
    />
  );
}
