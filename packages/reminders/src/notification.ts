/** Notification building: applies leadDays to turn a fire date into a payload. */

import type { Reminder, Notification } from './types';
import { utcDateToIso } from './recurrence';

/** Subtract `days` whole days from a UTC Date, returning a new Date. */
function subtractUtcDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - days));
}

/**
 * Build a notification payload for a reminder firing on `fireDate`.
 *
 * `leadDays` (default 0) shifts the notify instant *earlier*: a 7-day lead on
 * an occurrence of 2026-06-10 notifies at 2026-06-03T00:00:00.000Z. The body
 * names the actual occurrence date so a lead-time alert is self-explanatory.
 */
export function buildNotification(reminder: Reminder, fireDate: Date): Notification {
  const lead = reminder.leadDays ?? 0;
  const notifyDate = lead > 0 ? subtractUtcDays(fireDate, lead) : fireDate;
  const occurrenceIso = utcDateToIso(fireDate);
  const body =
    lead > 0
      ? `${reminder.title} — due ${occurrenceIso} (in ${lead} day${lead === 1 ? '' : 's'})`
      : `${reminder.title} — due ${occurrenceIso}`;
  return {
    id: reminder.id,
    title: reminder.title,
    body,
    fireAtIso: notifyDate.toISOString(),
  };
}
