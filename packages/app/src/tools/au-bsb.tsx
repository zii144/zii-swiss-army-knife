import { validateBsb, generateBsb } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Australian BSB',
    desc: 'Validate a 6-digit bank BSB, or generate a sample. On-device.',
    input: 'BSB',
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
      validate={validateBsb}
      generate={generateBsb}
      placeholder="062-000"
      strings={{ input: t.input, ...c }}
    />
  );
}
