import { validateKoBrn, generateKoBrn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Korea business number',
    desc: 'Validate a 사업자등록번호 (10-digit NTS checksum), or generate a sample. On-device.',
    input: 'BRN',
  },
  ko: {
    title: '사업자등록번호',
    desc: '사업자등록번호(10자리) 체크섬을 검증하거나 샘플을 생성합니다. 기기에서 실행.',
    input: '사업자등록번호',
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
      validate={validateKoBrn}
      generate={generateKoBrn}
      placeholder="123-45-67890"
      strings={{ input: t.input, ...c }}
    />
  );
}
