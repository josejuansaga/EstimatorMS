export type CourtType = "indoor" | "outdoor";
export type UsStateTier = "tier1" | "tier2" | "tier3";
export type ScenarioKey = "conservative" | "base" | "optimistic";

export interface EstimateInput {
  indoorCourts: number;
  outdoorCourts: number;
  stateTier: UsStateTier;
  hourlyRate: number;
  hoursOpenPerDay: number;
  utilizationPct: number;
  membershipsMonthly: number;
  membershipFee: number;
  ancillaryRevenueMonthly: number;
  rentMonthly: number;
  staffMonthly: number;
  utilitiesMonthly: number;
  maintenanceMonthly: number;
  marketingMonthly: number;
  insuranceMonthly: number;
  otherOpexMonthly: number;
  loanAmount: number;
  loanRatePct: number;
  loanTermYears: number;
  horizonYears: number;
  opexGrowthPct: number;
  revenueGrowthPct: number;
}

export interface YearProjection {
  year: number;
  revenue: number;
  opex: number;
  debtService: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface EstimateMetrics {
  totalCapex: number;
  indoorCapex: number;
  outdoorCapex: number;
  annualRevenue: number;
  annualOpex: number;
  annualEbitda: number;
  paybackYears: number | null;
  roiPct: number;
  npv: number;
  irrPct: number | null;
  breakEvenMonths: number | null;
}

export interface EstimateOutput {
  metrics: EstimateMetrics;
  yearly: YearProjection[];
  scenarios: Record<ScenarioKey, EstimateMetrics>;
}
