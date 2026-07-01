import { useState } from 'react';
import { chineseZodiac, type ZodiacAnimal } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const NAMES: Record<string, Record<ZodiacAnimal, string>> = {
  en: {
    rat: 'Rat', ox: 'Ox', tiger: 'Tiger', rabbit: 'Rabbit', dragon: 'Dragon', snake: 'Snake',
    horse: 'Horse', goat: 'Goat', monkey: 'Monkey', rooster: 'Rooster', dog: 'Dog', pig: 'Pig',
  },
  'zh-TW': {
    rat: '鼠', ox: '牛', tiger: '虎', rabbit: '兔', dragon: '龍', snake: '蛇',
    horse: '馬', goat: '羊', monkey: '猴', rooster: '雞', dog: '狗', pig: '豬',
  },
};

const L = {
  en: {
    title: 'Chinese zodiac',
    desc: 'Find the Chinese zodiac animal for a birth year. On-device. (Approximate near Lunar New Year.)',
    year: 'Birth year',
    result: 'Zodiac',
  },
  'zh-TW': {
    title: '生肖',
    desc: '依出生年份查詢生肖，於裝置上運算。（農曆年初附近以實際農曆為準。）',
    year: '出生年',
    result: '生肖',
  },
};

export default function ZodiacTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [year, setYear] = useState(new Date().getFullYear());
  const animal = chineseZodiac(year);
  const names = NAMES[lang] ?? NAMES.en!;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.year}</span>
        <TextField type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </label>
      <div className="tool__result">
        <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '8rem' }}>
          <span className="tool__stat-value">{names[animal]}</span>
          <span className="tool__stat-label">{t.result}</span>
        </div>
      </div>
    </ToolPage>
  );
}
