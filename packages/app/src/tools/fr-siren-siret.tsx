import { validateSiren, validateSiret, generateSiren, generateSiret } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'SIREN / SIRET',
    desc: 'Validate a 9-digit SIREN or 14-digit SIRET (Luhn), or generate a sample. On-device.',
    input: 'SIREN or SIRET',
  },
  fr: {
    title: 'SIREN / SIRET',
    desc: 'Vérifie un SIREN (9) ou SIRET (14) avec Luhn, ou génère un exemple. Sur l’appareil.',
    input: 'SIREN ou SIRET',
  },
};

function validate(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 9) return validateSiren(digits);
  if (digits.length === 14) return validateSiret(digits);
  return false;
}

function generate(seed: number): string {
  return seed % 2 === 0 ? generateSiren(seed) : generateSiret(seed);
}

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  const c = tr(ID_COMMON, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validate}
      generate={generate}
      placeholder="732829320"
      strings={{ input: t.input, ...c }}
    />
  );
}
