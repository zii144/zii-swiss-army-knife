import { validateKoPostal, generateKoPostal } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Korea postal code',
    desc: 'Validate a 5-digit Korean postal code, or generate a sample. On-device.',
    input: 'Postal code',
  },
  ko: {
    title: '우편번호',
    desc: '5자리 우편번호를 검증하거나 샘플을 생성합니다. 기기에서 실행.',
    input: '우편번호',
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
      validate={validateKoPostal}
      generate={generateKoPostal}
      placeholder="06236"
      strings={{ input: t.input, ...c }}
    />
  );
}
