import type { CourtType, UsStateTier } from "./types";

/** MejorSet USA benchmark CAPEX per court (USD) */
export const COURT_CAPEX: Record<CourtType, number> = {
  indoor: 185_000,
  outdoor: 95_000,
};

/** Civil works, lighting, permits as % of court hardware */
export const CAPEX_MULTIPLIERS = {
  civilWorks: 0.22,
  lighting: 0.08,
  permits: 0.05,
  openingCosts: 0.12,
};

export const STATE_TIER_LABELS: Record<UsStateTier, string> = {
  tier1: "Tier 1 — CA, NY, FL, TX metros",
  tier2: "Tier 2 — Mid-size cities",
  tier3: "Tier 3 — Emerging markets",
};

export const STATE_TIER_OPEX_FACTOR: Record<UsStateTier, number> = {
  tier1: 1.15,
  tier2: 1.0,
  tier3: 0.88,
};

/** Seasonality factor for outdoor courts (annual revenue multiplier) */
export const OUTDOOR_SEASONALITY = 0.82;

export const DEFAULT_INPUT = {
  indoorCourts: 4,
  outdoorCourts: 2,
  stateTier: "tier2" as UsStateTier,
  hourlyRate: 55,
  hoursOpenPerDay: 14,
  utilizationPct: 45,
  membershipsMonthly: 120,
  membershipFee: 89,
  ancillaryRevenueMonthly: 8_500,
  rentMonthly: 18_000,
  staffMonthly: 28_000,
  utilitiesMonthly: 4_200,
  maintenanceMonthly: 2_800,
  marketingMonthly: 3_500,
  insuranceMonthly: 1_800,
  otherOpexMonthly: 2_000,
  loanAmount: 0,
  loanRatePct: 7.5,
  loanTermYears: 10,
  horizonYears: 7,
  opexGrowthPct: 3,
  revenueGrowthPct: 4,
};

export const SCENARIO_MULTIPLIERS = {
  conservative: { utilization: 0.85, revenue: 0.9 },
  base: { utilization: 1, revenue: 1 },
  optimistic: { utilization: 1.15, revenue: 1.12 },
};
