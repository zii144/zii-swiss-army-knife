import { useEffect, useState } from 'react';
import {
  subscriptionTotals,
  subscriptionMonthly,
  type BillingCycle,
  type Subscription,
} from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const STORAGE_KEY = 'zii:subscriptions';

const L = {
  en: {
    title: 'Subscription tracker',
    desc: 'Add your recurring subscriptions and see the true monthly and yearly cost. Saved on this device only — nothing is uploaded.',
    name: 'Name',
    amount: 'Amount',
    cycle: 'Billing',
    add: 'Add',
    remove: 'Remove',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    perMonth: 'Per month',
    perYear: 'Per year',
    empty: 'No subscriptions yet — add one above.',
    permo: '/mo',
  },
  'zh-TW': {
    title: '訂閱追蹤',
    desc: '加入你的定期訂閱，換算實際的每月與每年花費。僅儲存在本裝置，不會上傳。',
    name: '名稱',
    amount: '金額',
    cycle: '週期',
    add: '新增',
    remove: '刪除',
    weekly: '每週',
    monthly: '每月',
    quarterly: '每季',
    yearly: '每年',
    perMonth: '每月',
    perYear: '每年',
    empty: '尚無訂閱 — 於上方新增。',
    permo: '/月',
  },
  ja: {
    title: 'サブスク管理',
    desc: '定期購読を登録して、実際の月額・年額を確認できます。この端末内にのみ保存され、アップロードしません。',
    name: '名称',
    amount: '金額',
    cycle: '請求',
    add: '追加',
    remove: '削除',
    weekly: '毎週',
    monthly: '毎月',
    quarterly: '四半期',
    yearly: '毎年',
    perMonth: '月あたり',
    perYear: '年あたり',
    empty: 'まだありません — 上から追加してください。',
    permo: '/月',
  },
};

function load(): Subscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Subscription[]) : [];
  } catch {
    return [];
  }
}

function fmt(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SubscriptionTrackerTool({
  onBack,
  lang,
  backLabel,
  offlineLabel,
}: ToolViewProps) {
  const t = tr(L, lang);
  const [subs, setSubs] = useState<Subscription[]>(load);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [subs]);

  const totals = subscriptionTotals(subs);

  const add = (): void => {
    const value = Number(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;
    setSubs((prev) => [...prev, { name: name.trim(), amount: value, cycle }]);
    setName('');
    setAmount('');
  };

  const remove = (i: number): void => {
    setSubs((prev) => prev.filter((_, j) => j !== i));
  };

  const cycleLabel: Record<BillingCycle, string> = {
    weekly: t.weekly,
    monthly: t.monthly,
    quarterly: t.quarterly,
    yearly: t.yearly,
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field" style={{ flex: 2 }}>
          <span>{t.name}</span>
          <TextField value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="tool__field">
          <span>{t.amount}</span>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label className="tool__field">
          <span>{t.cycle}</span>
          <Select
            value={cycle}
            onChange={(v) => setCycle(v as BillingCycle)}
            options={[
              { value: 'weekly', label: t.weekly },
              { value: 'monthly', label: t.monthly },
              { value: 'quarterly', label: t.quarterly },
              { value: 'yearly', label: t.yearly },
            ]}
            ariaLabel={t.cycle}
          />
        </label>
      </div>
      <Button onClick={add}>{t.add}</Button>

      {subs.length > 0 ? (
        <div className="tool__result">
          <table className="tool__table" style={{ maxWidth: '30rem' }}>
            <tbody>
              {subs.map((s, i) => (
                <tr key={`${s.name}-${i}`}>
                  <td>{s.name}</td>
                  <td>{cycleLabel[s.cycle]}</td>
                  <td style={{ textAlign: 'right' }}>
                    {fmt(subscriptionMonthly(s.amount, s.cycle))}
                    {t.permo}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="tool__link" onClick={() => remove(i)}>
                      {t.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tool__inline">
            <div className="tool__stat">
              <span className="tool__stat-value">{fmt(totals.monthly)}</span>
              <span className="tool__stat-label">{t.perMonth}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{fmt(totals.annual)}</span>
              <span className="tool__stat-label">{t.perYear}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="tool__hint">{t.empty}</p>
      )}
    </ToolPage>
  );
}
