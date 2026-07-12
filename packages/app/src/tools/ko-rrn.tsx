import { validateKoRrn, generateKoRrn } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { ID_COMMON } from './idStrings';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Korea RRN',
    desc: 'Validate a 주민등록번호 format/checksum only (never stored). Or generate a sample. On-device.',
    input: 'RRN',
  },
  ko: {
    title: '주민등록번호',
    desc: '주민등록번호 형식·체크섬만 검증합니다(저장하지 않음). 샘플 생성 가능. 기기에서 실행.',
    input: '주민등록번호',
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
      validate={validateKoRrn}
      generate={generateKoRrn}
      placeholder="900101-1234567"
      strings={{ input: t.input, ...c }}
    />
  );
}
