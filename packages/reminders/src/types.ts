/**
 * @zii/reminders — Reminder engine (Module **M10**) type surface.
 *
 * Recurrence kinds are a small, closed set so resolution stays deterministic
 * and exhaustively checkable. All date math is UTC-based to match the
 * convention used by `@zii/calendar` (it formats/compares via the UTC fields).
 */

/** How a reminder repeats. */
export type Recurrence =
  /** Fires exactly once, on the given ISO date (YYYY-MM-DD). */
  | { kind: 'once'; date: string }
  /** Fires every day. */
  | { kind: 'daily' }
  /** Fires weekly on `weekday` (0 = Sunday … 6 = Saturday). */
  | { kind: 'weekly'; weekday: number }
  /** Fires monthly on `day` (1–31; clamped to the month length). */
  | { kind: 'monthly'; day: number };

/** A reminder definition. */
export interface Reminder {
  id: string;
  title: string;
  recurrence: Recurrence;
  /** Notify this many days *before* the occurrence (default 0). */
  leadDays?: number;
  /**
   * When true, an occurrence that lands on a weekend or listed holiday rolls
   * forward to the next business day (via `@zii/calendar`'s `isBusinessDay`).
   */
  skipHolidays?: boolean;
}

/** A built, serialized notification payload. */
export interface Notification {
  id: string;
  title: string;
  body: string;
  /** When to fire, as an ISO instant (UTC midnight of the notify date). */
  fireAtIso: string;
}
