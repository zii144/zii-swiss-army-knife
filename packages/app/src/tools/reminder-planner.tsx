import { useMemo, useState } from 'react';
import {
  buildNotification,
  upcomingOccurrences,
  utcDateToIso,
  type Recurrence,
  type Reminder,
} from '@zii/reminders';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type RecurrenceKind = Recurrence['kind'];

const WEEKDAYS = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const L = {
  en: {
    title: 'Reminder planner',
    desc: 'Preview upcoming reminder dates from a recurrence rule. Runs on your device.',
    titleField: 'Title',
    recurrence: 'Recurrence',
    once: 'Once',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    date: 'Date',
    weekday: 'Weekday',
    dayOfMonth: 'Day of month',
    leadDays: 'Notify days before',
    skipHolidays: 'Skip weekends & holidays',
    upcoming: 'Next occurrences',
    notify: 'Notification preview',
    count: (n: number) => `${n} upcoming date${n === 1 ? '' : 's'}`,
  },
  'zh-TW': {
    title: '提醒規劃',
    desc: '依重複規則預覽 upcoming 提醒日期，於裝置上運算。',
    titleField: '標題',
    recurrence: '重複',
    once: '一次',
    daily: '每天',
    weekly: '每週',
    monthly: '每月',
    date: '日期',
    weekday: '星期',
    dayOfMonth: '每月第幾日',
    leadDays: '提前幾天通知',
    skipHolidays: '跳過週末與假日',
    upcoming: '接下來的日期',
    notify: '通知預覽',
    count: (n: number) => `接下來 ${n} 個日期`,
  },
};

const today = (): string => new Date().toISOString().slice(0, 10);

function buildRecurrence(
  kind: RecurrenceKind,
  date: string,
  weekday: number,
  dayOfMonth: number,
): Recurrence {
  switch (kind) {
    case 'once':
      return { kind: 'once', date };
    case 'daily':
      return { kind: 'daily' };
    case 'weekly':
      return { kind: 'weekly', weekday };
    case 'monthly':
      return { kind: 'monthly', day: dayOfMonth };
  }
}

export default function ReminderPlannerTool({
  onBack,
  lang,
  backLabel,
  offlineLabel,
}: ToolViewProps) {
  const t = tr(L, lang);
  const [title, setTitle] = useState('Pay rent');
  const [kind, setKind] = useState<RecurrenceKind>('monthly');
  const [date, setDate] = useState(today());
  const [weekday, setWeekday] = useState('1');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [leadDays, setLeadDays] = useState(1);
  const [skipHolidays, setSkipHolidays] = useState(true);

  const reminder: Reminder = useMemo(
    () => ({
      id: 'preview',
      title,
      recurrence: buildRecurrence(kind, date, Number(weekday), dayOfMonth),
      leadDays,
      skipHolidays,
    }),
    [title, kind, date, weekday, dayOfMonth, leadDays, skipHolidays],
  );

  const upcoming = useMemo(() => {
    try {
      return upcomingOccurrences(reminder, new Date(), 8, []);
    } catch {
      return [];
    }
  }, [reminder]);

  const firstNotify =
    upcoming[0] !== undefined ? buildNotification(reminder, upcoming[0]) : null;

  const kindOptions = [
    { value: 'once', label: t.once },
    { value: 'daily', label: t.daily },
    { value: 'weekly', label: t.weekly },
    { value: 'monthly', label: t.monthly },
  ];

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.titleField}</span>
        <TextField value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <div className="tool__field">
        <span>{t.recurrence}</span>
        <Select value={kind} options={kindOptions} onChange={(v) => setKind(v as RecurrenceKind)} ariaLabel={t.recurrence} />
      </div>
      {kind === 'once' ? (
        <label className="tool__field">
          <span>{t.date}</span>
          <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      ) : null}
      {kind === 'weekly' ? (
        <div className="tool__field">
          <span>{t.weekday}</span>
          <Select value={weekday} options={WEEKDAYS} onChange={setWeekday} ariaLabel={t.weekday} />
        </div>
      ) : null}
      {kind === 'monthly' ? (
        <label className="tool__field">
          <span>{t.dayOfMonth}</span>
          <TextField
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
          />
        </label>
      ) : null}
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.leadDays}</span>
          <TextField
            type="number"
            min={0}
            value={leadDays}
            onChange={(e) => setLeadDays(Number(e.target.value))}
          />
        </label>
      </div>
      <label className="tool__check">
        <input
          type="checkbox"
          checked={skipHolidays}
          onChange={() => setSkipHolidays((v) => !v)}
        />
        {t.skipHolidays}
      </label>

      <div className="tool__result">
        <p className="tool__hint">{t.count(upcoming.length)}</p>
        <div className="tool__field">
          <span>{t.upcoming}</span>
          <div className="tool__rows">
            {upcoming.map((d) => (
              <div key={utcDateToIso(d)} className="tool__row">
                <code className="tool__row-value">{utcDateToIso(d)}</code>
              </div>
            ))}
          </div>
        </div>
        {firstNotify ? (
          <div className="tool__field">
            <span>{t.notify}</span>
            <p>
              <strong>{firstNotify.title}</strong>
              <br />
              {firstNotify.body}
            </p>
          </div>
        ) : null}
      </div>
    </ToolPage>
  );
}
