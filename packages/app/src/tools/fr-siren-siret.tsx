import { validateSiren, validateSiret, generateSiret } from '@zii/id';
import { IdTool } from '../components/IdTool';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'French SIREN / SIRET',
    desc: 'Validate a French SIREN (9 digits) or SIRET (14 digits) with Luhn. On-device.',
    input: 'SIREN / SIRET',
    valid: 'Valid ✓',
    invalid: 'Invalid ✗',
    generate: 'Generate sample SIRET',
  },
};

function validate(value: string): boolean {
  const d = value.replace(/\D+/g, '');
  if (d.length === 9) return validateSiren(d);
  if (d.length === 14) return validateSiret(d);
  return false;
}

export default function Tool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool
      {...p}
      title={t.title}
      description={t.desc}
      validate={validate}
      generate={generateSiret}
      placeholder="73282932000074"
      strings={t}
    />
  );
}
