import { validateKoPhone, generateKoPhone } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Korea phone',
    desc: 'Validate a Korean mobile (01x) or landline number, or generate a sample. On-device.',
    input: 'Phone',
  },
  ko: {
    title: '전화번호',
    desc: '휴대폰(01x) 또는 유선번호를 검증하거나 샘플을 생성합니다. 기기에서 실행.',
    input: '전화번호',
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
      validate={validateKoPhone}
      generate={generateKoPhone}
      placeholder="010-1234-5678"
      strings={{ input: t.input, ...c }}
    />
  );
}
