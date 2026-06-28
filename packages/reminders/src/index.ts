// @zii/reminders — Reminder engine (M10).
// Pure, offline, deterministic recurrence resolution with holiday-aware
// roll-forward (via @zii/calendar) and notification building.

export type { Recurrence, Reminder, Notification } from './types';
export { nextOccurrence, upcomingOccurrences, utcDateToIso } from './recurrence';
export { buildNotification } from './notification';
