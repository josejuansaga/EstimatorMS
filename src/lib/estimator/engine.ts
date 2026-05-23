import {
  CAPEX_MULTIPLIERS,
  COURT_CAPEX,
  OUTDOOR_SEASONALITY,
  SCENARIO_MULTIPLIERS,
  STATE_TIER_OPEX_FACTOR,
} from "./assumptions";
import type {
  EstimateInput,
  EstimateMetrics,
  EstimateOutput,
  ScenarioKey,
  YearProjection,
} from "./types";

function calcCapex(indoorCourts: number, outdoorCourts: number) {
  const indoorBase = indoorCourts * COURT_CAPEX.indoor;
  const outdoorBase = outdoorCourts * COURT_CAPEX.outdoor;
  const hardware = indoorBase + outdoorBase;
  const multiplier =
    1 +
    CAPEX_MULTIPLIERS.civilWorks +
    CAPEX_MULTIPLIERS.lighting +
    CAPEX_MULTIPLIERS.permits +
    CAPEX_MULTIPLIERS.openingCosts;

  return {
    totalCapex: hardware * multiplier,
    indoorCapex: indoorBase * multiplier,
    outdoorCapex: outdoorBase * multiplier,
  };
}

function calcAnnualRevenue(
  input: EstimateInput,
  utilizationFactor = 1,
  revenueFactor = 1,
) {
  const totalCourts = input.indoorCourts + input.outdoorCourts;
  if (totalCourts === 0) return 0;

  const effectiveUtil = (input.utilizationPct / 100) * utilizationFactor;
  const bookableHoursYear =
    input.hoursOpenPerDay * 365 * totalCourts * effectiveUtil;

  const courtRevenue = bookableHoursYear * input.hourlyRate * revenueFactor;

  const membershipRevenue =
    input.membershipsMonthly * input.membershipFee * 12 * revenueFactor;

  const ancillary = input.ancillaryRevenueMonthly * 12 * revenueFactor;

  const outdoorShare =
    input.outdoorCourts / Math.max(totalCourts, 1);
  const seasonalityPenalty =
    1 - outdoorShare * (1 - OUTDOOR_SEASONALITY);

  return (courtRevenue + membershipRevenue + ancillary) * seasonalityPenalty;
}

function calcAnnualOpex(input: EstimateInput, yearIndex = 0) {
  const growth = Math.pow(1 + input.opexGrowthPct / 100, yearIndex);
  const tierFactor = STATE_TIER_OPEX_FACTOR[input.stateTier];
  const base =
    (input.rentMonthly +
      input.staffMonthly +
      input.utilitiesMonthly +
      input.maintenanceMonthly +
      input.marketingMonthly +
      input.insuranceMonthly +
      input.otherOpexMonthly) *
    12;

  return base * tierFactor * growth;
}

function calcDebtService(input: EstimateInput): number {
  if (input.loanAmount <= 0 || input.loanTermYears <= 0) return 0;
  const monthlyRate = input.loanRatePct / 100 / 12;
  const n = input.loanTermYears * 12;
  if (monthlyRate === 0) return input.loanAmount / input.loanTermYears;
  const payment =
    (input.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
  return payment * 12;
}

function projectCashFlows(
  input: EstimateInput,
  totalCapex: number,
  utilizationFactor = 1,
  revenueFactor = 1,
): YearProjection[] {
  const debtService = calcDebtService(input);
  const yearly: YearProjection[] = [];
  let cumulative = -totalCapex;

  for (let y = 1; y <= input.horizonYears; y++) {
    const revenue =
      calcAnnualRevenue(input, utilizationFactor, revenueFactor) *
      Math.pow(1 + input.revenueGrowthPct / 100, y - 1);
    const opex = calcAnnualOpex(input, y - 1);
    const netCashFlow = revenue - opex - debtService;
    cumulative += netCashFlow;

    yearly.push({
      year: y,
      revenue,
      opex,
      debtService,
      netCashFlow,
      cumulativeCashFlow: cumulative,
    });
  }

  return yearly;
}

function calcPayback(yearly: YearProjection[], totalCapex: number): number | null {
  let remaining = totalCapex;
  for (const row of yearly) {
    if (row.netCashFlow <= 0) continue;
    if (remaining <= row.netCashFlow) {
      return row.year - 1 + remaining / row.netCashFlow;
    }
    remaining -= row.netCashFlow;
  }
  return null;
}

function calcNpv(
  yearly: YearProjection[],
  totalCapex: number,
  discountRate = 0.1,
): number {
  let npv = -totalCapex;
  for (const row of yearly) {
    npv += row.netCashFlow / Math.pow(1 + discountRate, row.year);
  }
  return npv;
}

function calcIrr(
  yearly: YearProjection[],
  totalCapex: number,
): number | null {
  let low = -0.5;
  let high = 1.5;
  const npvAt = (rate: number) => {
    let npv = -totalCapex;
    for (const row of yearly) {
      npv += row.netCashFlow / Math.pow(1 + rate, row.year);
    }
    return npv;
  };

  if (npvAt(low) * npvAt(high) > 0) return null;

  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const v = npvAt(mid);
    if (Math.abs(v) < 1) return mid * 100;
    if (v > 0) low = mid;
    else high = mid;
  }
  return ((low + high) / 2) * 100;
}

function buildMetrics(
  input: EstimateInput,
  utilizationFactor = 1,
  revenueFactor = 1,
): EstimateMetrics {
  const { totalCapex, indoorCapex, outdoorCapex } = calcCapex(
    input.indoorCourts,
    input.outdoorCourts,
  );
  const yearly = projectCashFlows(
    input,
    totalCapex,
    utilizationFactor,
    revenueFactor,
  );
  const annualRevenue = yearly[0]?.revenue ?? 0;
  const annualOpex = yearly[0]?.opex ?? 0;
  const debtService = yearly[0]?.debtService ?? 0;
  const annualEbitda = annualRevenue - annualOpex;
  const totalNetCash = yearly.reduce((s, r) => s + r.netCashFlow, 0);
  const roiPct =
    totalCapex > 0 ? ((totalNetCash - totalCapex) / totalCapex) * 100 : 0;

  const paybackYears = calcPayback(yearly, totalCapex);
  const monthlyEbitda = annualEbitda / 12;
  const breakEvenMonths =
    monthlyEbitda > 0 ? totalCapex / monthlyEbitda : null;

  return {
    totalCapex,
    indoorCapex,
    outdoorCapex,
    annualRevenue,
    annualOpex,
    annualEbitda,
    paybackYears,
    roiPct,
    npv: calcNpv(yearly, totalCapex),
    irrPct: calcIrr(yearly, totalCapex),
    breakEvenMonths,
  };
}

export function runEstimate(input: EstimateInput): EstimateOutput {
  const { totalCapex } = calcCapex(input.indoorCourts, input.outdoorCourts);
  const yearly = projectCashFlows(input, totalCapex);
  const metrics = buildMetrics(input);

  const scenarios = (Object.keys(SCENARIO_MULTIPLIERS) as ScenarioKey[]).reduce(
    (acc, key) => {
      const m = SCENARIO_MULTIPLIERS[key];
      acc[key] = buildMetrics(input, m.utilization, m.revenue);
      return acc;
    },
    {} as Record<ScenarioKey, EstimateMetrics>,
  );

  return { metrics, yearly, scenarios };
}
