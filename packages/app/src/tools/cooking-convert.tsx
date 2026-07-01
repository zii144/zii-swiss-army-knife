import { useState } from 'react';
import { convertCooking, type CookingUnit, type Ingredient } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const INGREDIENTS: Ingredient[] = ['water', 'flour', 'sugar'];
const UNITS: CookingUnit[] = ['cup', 'gram', 'ml'];

const L = {
  en: {
    title: 'Cooking converter',
    desc: 'Convert cups, grams and millilitres for common ingredients (density-aware).',
    ingredient: 'Ingredient',
    amount: 'Amount',
    from: 'From',
    to: 'To',
    water: 'Water',
    flour: 'Flour',
    sugar: 'Sugar',
    cup: 'Cup (US)',
    gram: 'Gram',
    ml: 'Millilitre',
  },
  'zh-TW': {
    title: '烹飪單位換算',
    desc: '依食材密度換算杯、公克與毫升。',
    ingredient: '食材',
    amount: '數量',
    from: '從',
    to: '到',
    water: '水',
    flour: '麵粉',
    sugar: '糖',
    cup: '杯（美制）',
    gram: '公克',
    ml: '毫升',
  },
};

export default function CookingConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [ingredient, setIngredient] = useState<Ingredient>('flour');
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState<CookingUnit>('cup');
  const [to, setTo] = useState<CookingUnit>('gram');

  let result: number | null = null;
  let error: string | null = null;
  try {
    result = convertCooking(amount, ingredient, from, to);
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
      <div className="tool__field">
        <span>{t.ingredient}</span>
        <Select
          value={ingredient}
          options={INGREDIENTS.map((i) => ({ value: i, label: t[i] }))}
          onChange={(v) => setIngredient(v as Ingredient)}
          ariaLabel={t.ingredient}
        />
      </div>
      <label className="tool__field">
        <span>{t.amount}</span>
        <TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </label>
      <div className="tool__inline">
        <div className="tool__field">
          <span>{t.from}</span>
          <Select
            value={from}
            options={UNITS.map((u) => ({ value: u, label: t[u] }))}
            onChange={(v) => setFrom(v as CookingUnit)}
            ariaLabel={t.from}
          />
        </div>
        <div className="tool__field">
          <span>{t.to}</span>
          <Select
            value={to}
            options={UNITS.map((u) => ({ value: u, label: t[u] }))}
            onChange={(v) => setTo(v as CookingUnit)}
            ariaLabel={t.to}
          />
        </div>
      </div>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : (
        <div className="tool__result">
          <p>
            <strong>
              {amount} {t[from]} = {result?.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
              {t[to]}
            </strong>
          </p>
        </div>
      )}
    </ToolPage>
  );
}
