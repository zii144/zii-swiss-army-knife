import { z } from 'zod';

/** Markets the suite targets (kept in sync with @zii/registry's Market). */
export const MarketSchema = z.enum(['tw', 'hk', 'jp', 'en-us', 'en-gb', 'en-ca', 'en-au', 'global']);
export type Market = z.infer<typeof MarketSchema>;

export const UnitsSchema = z.enum(['metric', 'imperial', 'mixed']);

const TaxBracketSchema = z.object({
  /** Upper bound of this bracket, or null for the top bracket. */
  upTo: z.number().nullable(),
  rate: z.number(),
});

/** Payroll rules are intentionally extensible per jurisdiction (M9 rule modules). */
const PayrollRulesSchema = z
  .object({
    socialInsurance: z.record(z.string(), z.number()).optional(),
    pensionEmployerRate: z.number().optional(),
    pensionEmployeeRate: z.number().optional(),
    notes: z.string().optional(),
  })
  .passthrough();

const TaxRulesSchema = z
  .object({
    incomeBrackets: z.array(TaxBracketSchema).optional(),
    salesTaxRate: z.number().optional(),
    deductions: z.record(z.string(), z.number()).optional(),
  })
  .passthrough();

const HolidaySchema = z.object({ date: z.string(), name: z.string() });

const HolidaysSchema = z.object({
  source: z.string().optional(),
  list: z.array(HolidaySchema).default([]),
  /** e.g. Taiwan abolished make-up workdays in 2025 — config, not code. */
  makeUpWorkdays: z.boolean().default(false),
});

const IdConfigSchema = z.object({ validators: z.array(z.string()).default([]) });

const AddressConfigSchema = z.object({
  postcode: z.string().optional(),
  order: z.enum(['big-endian', 'little-endian']).optional(),
});

/**
 * A versioned, dated locale pack. Top-level is `.strict()` so an unknown key
 * fails loudly rather than being silently ignored (DEVELOPMENT-PLAN.md §4.3).
 */
export const LocalePackSchema = z
  .object({
    market: MarketSchema,
    year: z.number().int(),
    effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'effectiveDate must be YYYY-MM-DD'),
    dateFormat: z.string(),
    calendars: z.array(z.string()).default(['gregorian']),
    currency: z.string().length(3),
    units: UnitsSchema,
    payroll: PayrollRulesSchema.optional(),
    tax: TaxRulesSchema.optional(),
    holidays: HolidaysSchema.optional(),
    id: IdConfigSchema.optional(),
    address: AddressConfigSchema.optional(),
    dataSources: z.record(z.string(), z.string()).default({}),
    tools: z.object({ enabled: z.array(z.string()).default([]) }).default({ enabled: [] }),
    toggles: z.record(z.string(), z.boolean()).default({}),
  })
  .strict();

export type LocalePack = z.infer<typeof LocalePackSchema>;

/** Parse + validate; throws a ZodError on invalid input. */
export function parseLocalePack(data: unknown): LocalePack {
  return LocalePackSchema.parse(data);
}

/** Non-throwing variant. */
export function safeParseLocalePack(data: unknown) {
  return LocalePackSchema.safeParse(data);
}
