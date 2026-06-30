import { useState } from 'react';
import { bmi, type BmiCategory } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'BMI calculator',
    desc: 'Body mass index from your height and weight. Nothing leaves your device.',
    weight: 'Weight (kg)',
    height: 'Height (cm)',
    result: 'Your BMI',
    cat: {
      underweight: 'Underweight',
      normal: 'Normal',
      overweight: 'Overweight',
      obese: 'Obese',
    } as Record<BmiCategory, string>,
  },
  'zh-TW': {
    title: 'BMI 計算機',
    desc: '依身高體重計算身體質量指數，資料不離開你的裝置。',
    weight: '體重（公斤）',
    height: '身高（公分）',
    result: '你的 BMI',
    cat: {
      underweight: '過輕',
      normal: '正常',
      overweight: '過重',
      obese: '肥胖',
    } as Record<BmiCategory, string>,
  },
};

export default function BmiTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [kg, setKg] = useState(65);
  const [cm, setCm] = useState(170);

  let result: { value: number; category: BmiCategory } | null = null;
  let error: string | null = null;
  try {
    result = bmi(kg, cm);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.weight}</span>
          <TextField type="number" value={kg} onChange={(e) => setKg(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.height}</span>
          <TextField type="number" value={cm} onChange={(e) => setCm(Number(e.target.value))} />
        </label>
      </div>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.result}</p>
          <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '8rem' }}>
            <span className="tool__stat-value">{result.value}</span>
            <span className="tool__stat-label">{t.cat[result.category]}</span>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
