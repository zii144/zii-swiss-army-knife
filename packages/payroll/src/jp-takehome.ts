/**
 * Japan take-home pay (手取り) estimate — 協会けんぽ 東京 令和6年度 (FY2024).
 *
 * Pure, offline, deterministic. Layered so each part is independently testable:
 *   1. 標準報酬月額 grade lookup (canonical government schedule)
 *   2. 社会保険料 (健康保険 / 介護保険 / 厚生年金 / 雇用保険) — EXACT, from the
 *      grade table × confirmed FY2024 rates with the 50-sen rounding rule
 *   3. 所得税 (annual, 給与所得控除 → 基礎控除 → speed table × 復興特別税)
 *   4. 住民税 (annual, 所得割 10% + 均等割, incl. 森林環境税)
 *
 * The社会保険 part is exact for 協会けんぽ 東京 FY2024. The tax part is an
 * estimate for a single earner with NO dependants or special deductions
 * (配偶者/扶養/生命保険料 等は未考慮). Rates/values are dated & sourced; this is a
 * planning 概算, not a payslip.
 */
import type { TaxBracket } from './tax';

/** A 標準報酬月額 grade: the 報酬月額 lower bound and the standard remuneration. */
interface Grade {
  /** 報酬月額 lower bound (以上); grade applies while salary < next grade's bound. */
  lower: number;
  /** 標準報酬月額 for this grade. */
  standard: number;
}

/**
 * 健康保険・厚生年金 標準報酬月額 grade table (50 grades). Standard-remuneration
 * values and 報酬月額 boundaries are the canonical national schedule (unchanged
 * since 2020, when pension grade 32 = ¥650,000 was added).
 * Source: 日本年金機構 / 協会けんぽ 保険料額表.
 */
const GRADES: readonly Grade[] = [
  { lower: 0, standard: 58_000 },
  { lower: 63_000, standard: 68_000 },
  { lower: 73_000, standard: 78_000 },
  { lower: 83_000, standard: 88_000 },
  { lower: 93_000, standard: 98_000 },
  { lower: 101_000, standard: 104_000 },
  { lower: 107_000, standard: 110_000 },
  { lower: 114_000, standard: 118_000 },
  { lower: 122_000, standard: 126_000 },
  { lower: 130_000, standard: 134_000 },
  { lower: 138_000, standard: 142_000 },
  { lower: 146_000, standard: 150_000 },
  { lower: 155_000, standard: 160_000 },
  { lower: 165_000, standard: 170_000 },
  { lower: 175_000, standard: 180_000 },
  { lower: 185_000, standard: 190_000 },
  { lower: 195_000, standard: 200_000 },
  { lower: 210_000, standard: 220_000 },
  { lower: 230_000, standard: 240_000 },
  { lower: 250_000, standard: 260_000 },
  { lower: 270_000, standard: 280_000 },
  { lower: 290_000, standard: 300_000 },
  { lower: 310_000, standard: 320_000 },
  { lower: 330_000, standard: 340_000 },
  { lower: 350_000, standard: 360_000 },
  { lower: 370_000, standard: 380_000 },
  { lower: 395_000, standard: 410_000 },
  { lower: 425_000, standard: 440_000 },
  { lower: 455_000, standard: 470_000 },
  { lower: 485_000, standard: 500_000 },
  { lower: 515_000, standard: 530_000 },
  { lower: 545_000, standard: 560_000 },
  { lower: 575_000, standard: 590_000 },
  { lower: 605_000, standard: 620_000 },
  { lower: 635_000, standard: 650_000 },
  { lower: 665_000, standard: 680_000 },
  { lower: 695_000, standard: 710_000 },
  { lower: 730_000, standard: 750_000 },
  { lower: 770_000, standard: 790_000 },
  { lower: 810_000, standard: 830_000 },
  { lower: 855_000, standard: 880_000 },
  { lower: 905_000, standard: 930_000 },
  { lower: 955_000, standard: 980_000 },
  { lower: 1_005_000, standard: 1_030_000 },
  { lower: 1_055_000, standard: 1_090_000 },
  { lower: 1_115_000, standard: 1_150_000 },
  { lower: 1_175_000, standard: 1_210_000 },
  { lower: 1_235_000, standard: 1_270_000 },
  { lower: 1_295_000, standard: 1_330_000 },
  { lower: 1_355_000, standard: 1_390_000 },
];

/** 厚生年金 caps at the ¥650,000 grade and floors at the ¥88,000 grade. */
const PENSION_MIN = 88_000;
const PENSION_MAX = 650_000;

/** Dated social-insurance + tax constants for one region/year. */
export interface JpTakeHomeConfig {
  label: string;
  source: string;
  /** 健康保険料率 (total, both sides). */
  healthRate: number;
  /** 介護保険料率 (total; added for age 40–64). */
  careRate: number;
  /** 厚生年金保険料率 (total). */
  pensionRate: number;
  /** 雇用保険料率 — employee share, on actual salary. */
  employmentRate: number;
  /** 給与所得控除 brackets (applied to annual gross). */
  incomeTaxBrackets: readonly TaxBracket[];
  /** 所得税 基礎控除. */
  incomeBasicDeduction: number;
  /** 住民税 基礎控除. */
  residentBasicDeduction: number;
  /** 復興特別所得税 multiplier. */
  reconstructionSurtax: number;
  /** 住民税 所得割 rate. */
  residentRate: number;
  /** 住民税 調整控除 (flat approximation for the ¥50,000 基礎控除 difference). */
  residentAdjustment: number;
  /** 住民税 均等割 + 森林環境税 (flat annual). */
  residentPerCapita: number;
}

/** 所得税 speed-table brackets on 課税所得. Source: NTA. */
const JP_INCOME_TAX_BRACKETS: readonly TaxBracket[] = [
  { upTo: 1_950_000, rate: 0.05 },
  { upTo: 3_300_000, rate: 0.1 },
  { upTo: 6_950_000, rate: 0.2 },
  { upTo: 9_000_000, rate: 0.23 },
  { upTo: 18_000_000, rate: 0.33 },
  { upTo: 40_000_000, rate: 0.4 },
  { upTo: null, rate: 0.45 },
];

/** 協会けんぽ 東京 令和6年度 (FY2024). */
export const JP_TAKEHOME_TOKYO_2024: JpTakeHomeConfig = {
  label: '協会けんぽ 東京 令和6年度',
  source: 'https://www.kyoukaikenpo.or.jp/',
  healthRate: 0.0998,
  careRate: 0.016,
  pensionRate: 0.183,
  employmentRate: 0.006,
  incomeTaxBrackets: JP_INCOME_TAX_BRACKETS,
  incomeBasicDeduction: 480_000,
  residentBasicDeduction: 430_000,
  reconstructionSurtax: 1.021,
  residentRate: 0.1,
  residentAdjustment: 2_500,
  residentPerCapita: 5_000,
};

/** 50-sen rounding: ≤50 銭 rounds down, >50 銭 rounds up. */
function roundYen50sen(value: number): number {
  return Math.ceil(value - 0.5);
}

/** 標準報酬月額 for a monthly salary, for 健康保険 (full 50-grade range). */
export function jpHealthStandardRemuneration(monthlySalary: number): number {
  const salary = Math.max(0, monthlySalary);
  let standard = GRADES[0]!.standard;
  for (const grade of GRADES) {
    if (salary >= grade.lower) standard = grade.standard;
    else break;
  }
  return standard;
}

/** 標準報酬月額 for 厚生年金 (clamped to the ¥88,000–¥650,000 range). */
export function jpPensionStandardRemuneration(monthlySalary: number): number {
  return Math.min(PENSION_MAX, Math.max(PENSION_MIN, jpHealthStandardRemuneration(monthlySalary)));
}

/** Employee-side social-insurance breakdown for one month. */
export interface JpSocialInsurance {
  health: number;
  care: number;
  pension: number;
  employment: number;
  total: number;
}

/**
 * Monthly employee social-insurance contributions. Health/care/pension use the
 * 標準報酬月額 × rate ÷ 2 with 50-sen rounding; employment insurance is on the
 * actual salary.
 */
export function jpSocialInsuranceMonthly(
  monthlySalary: number,
  opts: { age40to64?: boolean } = {},
  cfg: JpTakeHomeConfig = JP_TAKEHOME_TOKYO_2024,
): JpSocialInsurance {
  if (monthlySalary <= 0) {
    return { health: 0, care: 0, pension: 0, employment: 0, total: 0 };
  }
  const healthStd = jpHealthStandardRemuneration(monthlySalary);
  const pensionStd = jpPensionStandardRemuneration(monthlySalary);
  const health = roundYen50sen((healthStd * cfg.healthRate) / 2);
  const care = opts.age40to64 ? roundYen50sen((healthStd * cfg.careRate) / 2) : 0;
  const pension = roundYen50sen((pensionStd * cfg.pensionRate) / 2);
  const employment = roundYen50sen(Math.max(0, monthlySalary) * cfg.employmentRate);
  return { health, care, pension, employment, total: health + care + pension + employment };
}

/** 給与所得控除: annual gross → deduction (FY2020+ schedule). */
export function jpEmploymentIncomeDeduction(annualGross: number): number {
  const g = Math.max(0, annualGross);
  if (g <= 1_625_000) return 550_000;
  if (g <= 1_800_000) return g * 0.4 - 100_000;
  if (g <= 3_600_000) return g * 0.3 + 80_000;
  if (g <= 6_600_000) return g * 0.2 + 440_000;
  if (g <= 8_500_000) return g * 0.1 + 1_100_000;
  return 1_950_000;
}

function progressive(brackets: readonly TaxBracket[], taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (const b of brackets) {
    const ceiling = b.upTo === null ? taxable : Math.min(b.upTo, taxable);
    if (ceiling > lower) tax += (ceiling - lower) * b.rate;
    lower = b.upTo === null ? taxable : b.upTo;
    if (b.upTo !== null && taxable <= b.upTo) break;
  }
  return tax;
}

/** Annual 所得税 (incl. 復興特別所得税), for a single earner. */
export function jpIncomeTaxAnnual(
  annualGross: number,
  annualSocialInsurance: number,
  cfg: JpTakeHomeConfig = JP_TAKEHOME_TOKYO_2024,
): number {
  const employmentIncome = Math.max(0, annualGross) - jpEmploymentIncomeDeduction(annualGross);
  const taxableRaw = employmentIncome - annualSocialInsurance - cfg.incomeBasicDeduction;
  const taxable = Math.floor(Math.max(0, taxableRaw) / 1000) * 1000; // 1,000円未満切捨
  const base = progressive(cfg.incomeTaxBrackets, taxable) * cfg.reconstructionSurtax;
  return Math.floor(base / 100) * 100; // 100円未満切捨
}

/** Annual 住民税 (所得割 + 均等割), for a single earner. */
export function jpResidentTaxAnnual(
  annualGross: number,
  annualSocialInsurance: number,
  cfg: JpTakeHomeConfig = JP_TAKEHOME_TOKYO_2024,
): number {
  const employmentIncome = Math.max(0, annualGross) - jpEmploymentIncomeDeduction(annualGross);
  const taxableRaw = employmentIncome - annualSocialInsurance - cfg.residentBasicDeduction;
  const taxable = Math.floor(Math.max(0, taxableRaw) / 1000) * 1000;
  if (taxable <= 0) return 0; // 非課税ライン以下では均等割も概ね免除の想定
  const incomeLevyRaw = taxable * cfg.residentRate - cfg.residentAdjustment;
  const incomeLevy = Math.floor(Math.max(0, incomeLevyRaw) / 100) * 100; // 100円未満切捨
  return incomeLevy + cfg.residentPerCapita;
}

/** Full monthly take-home breakdown. */
export interface JpTakeHomeResult {
  label: string;
  monthlyGross: number;
  annualGross: number;
  social: JpSocialInsurance;
  /** Monthly 所得税 (annual ÷ 12). */
  incomeTaxMonthly: number;
  /** Monthly 住民税 (annual ÷ 12). */
  residentTaxMonthly: number;
  /** Total monthly deductions. */
  deductionsMonthly: number;
  /** Monthly take-home. */
  takeHomeMonthly: number;
  /** Annual figures for reference. */
  annual: {
    social: number;
    incomeTax: number;
    residentTax: number;
    takeHome: number;
  };
}

/**
 * Estimate monthly take-home from monthly gross. Income/resident tax assume a
 * single earner with no dependants or special deductions.
 */
export function jpTakeHome(
  monthlyGross: number,
  opts: { age40to64?: boolean } = {},
  cfg: JpTakeHomeConfig = JP_TAKEHOME_TOKYO_2024,
): JpTakeHomeResult {
  const gross = Math.max(0, monthlyGross);
  const annualGross = gross * 12;
  const social = jpSocialInsuranceMonthly(gross, opts, cfg);
  const annualSocial = social.total * 12;
  const incomeTaxAnnual = jpIncomeTaxAnnual(annualGross, annualSocial, cfg);
  const residentTaxAnnual = jpResidentTaxAnnual(annualGross, annualSocial, cfg);
  const incomeTaxMonthly = Math.round(incomeTaxAnnual / 12);
  const residentTaxMonthly = Math.round(residentTaxAnnual / 12);
  const deductionsMonthly = social.total + incomeTaxMonthly + residentTaxMonthly;
  return {
    label: cfg.label,
    monthlyGross: gross,
    annualGross,
    social,
    incomeTaxMonthly,
    residentTaxMonthly,
    deductionsMonthly,
    takeHomeMonthly: Math.max(0, gross - deductionsMonthly),
    annual: {
      social: annualSocial,
      incomeTax: incomeTaxAnnual,
      residentTax: residentTaxAnnual,
      takeHome: Math.max(0, annualGross - annualSocial - incomeTaxAnnual - residentTaxAnnual),
    },
  };
}
