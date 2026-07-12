import { validateAadhaar, generateAadhaar } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Indian Aadhaar",
    desc: "Validate a 12-digit Aadhaar number (Verhoeff checksum), or generate a sample. On-device — format only.",
    input: "Aadhaar",
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
      validate={validateAadhaar}
      generate={generateAadhaar}
      placeholder="234567890123"
      strings={{ input: t.input, ...c }}
    />
  );
}
