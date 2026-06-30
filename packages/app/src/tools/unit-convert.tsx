import { useState } from 'react';
import { convert, type Unit } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Dim = 'length' | 'mass' | 'temperature' | 'volume';

const UNITS: Record<Dim, Unit[]> = {
  length: ['m', 'km', 'mi', 'ft', 'in', 'yd'],
  mass: ['kg', 'g', 'lb', 'oz', 'st'],
  temperature: ['C', 'F', 'K'],
  volume: ['l', 'ml', 'usGal', 'impGal', 'usPint', 'impPint', 'usCup'],
};

const L = {
  en: {
    title: 'Unit converter',
    desc: 'Convert length, mass, temperature and volume. US and imperial units are kept distinct.',
    dimension: 'Category',
    value: 'Value',
    from: 'From',
    to: 'To',
    length: 'Length',
    mass: 'Mass',
    temperature: 'Temperature',
    volume: 'Volume',
  },
  'zh-TW': {
    title: '單位換算',
    desc: '換算長度、重量、溫度與體積，美制與英制分開處理。',
    dimension: '類別',
    value: '數值',
    from: '從',
    to: '到',
    length: '長度',
    mass: '重量',
    temperature: '溫度',
    volume: '體積',
  },
};

export default function UnitConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [dim, setDim] = useState<Dim>('length');
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<Unit>('m');
  const [to, setTo] = useState<Unit>('ft');

  const onDim = (d: Dim): void => {
    const units = UNITS[d];
    setDim(d);
    setFrom(units[0] ?? 'm');
    setTo(units[1] ?? units[0] ?? 'm');
  };

  let result: number | null = null;
  let error: string | null = null;
  try {
    result = convert(value, from, to);
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
      <label className="tool__field">
        <span>{t.dimension}</span>
        <select value={dim} onChange={(e) => onDim(e.target.value as Dim)}>
          <option value="length">{t.length}</option>
          <option value="mass">{t.mass}</option>
          <option value="temperature">{t.temperature}</option>
          <option value="volume">{t.volume}</option>
        </select>
      </label>
      <label className="tool__field">
        <span>{t.value}</span>
        <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </label>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.from}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)}>
            {UNITS[dim].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label className="tool__field">
          <span>{t.to}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)}>
            {UNITS[dim].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : (
        <div className="tool__result">
          <p>
            <strong>
              {value} {from} = {result?.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
              {to}
            </strong>
          </p>
        </div>
      )}
    </ToolPage>
  );
}
