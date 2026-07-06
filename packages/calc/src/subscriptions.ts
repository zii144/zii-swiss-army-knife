/** Subscription-cost normalization across billing cycles. Pure, offline. */

/** Supported billing cadences. */
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/** How many times each cycle bills per year. */
const CYCLES_PER_YEAR: Readonly<Record<BillingCycle, number>> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

/** Annualized cost of one subscription line. */
export function subscriptionAnnual(amount: number, cycle: BillingCycle): number {
  return Math.max(0, amount) * CYCLES_PER_YEAR[cycle];
}

/** Monthly-equivalent cost of one subscription line. */
export function subscriptionMonthly(amount: number, cycle: BillingCycle): number {
  return subscriptionAnnual(amount, cycle) / 12;
}

/** One subscription entry. */
export interface Subscription {
  name: string;
  amount: number;
  cycle: BillingCycle;
}

/** Combined monthly and annual spend across many subscriptions. */
export interface SubscriptionTotals {
  monthly: number;
  annual: number;
}

/** Sum the monthly-equivalent and annual cost of a list of subscriptions. */
export function subscriptionTotals(subs: readonly Subscription[]): SubscriptionTotals {
  let annual = 0;
  for (const s of subs) annual += subscriptionAnnual(s.amount, s.cycle);
  return { monthly: annual / 12, annual };
}
