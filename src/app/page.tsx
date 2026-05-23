"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  DollarSign,
  Percent,
  Sun,
  Target,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { CashFlowChart, CumulativeChart } from "@/components/dashboard/charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ScenarioTable } from "@/components/dashboard/scenario-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SelectField, SliderField } from "@/components/ui/input-field";
import { DEFAULT_INPUT, STATE_TIER_LABELS } from "@/lib/estimator/assumptions";
import { runEstimate } from "@/lib/estimator/engine";
import type { EstimateInput, UsStateTier } from "@/lib/estimator/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const [input, setInput] = useState<EstimateInput>(DEFAULT_INPUT);

  const result = useMemo(() => runEstimate(input), [input]);

  const patch = <K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const { metrics, yearly, scenarios } = result;
  const totalCourts = input.indoorCourts + input.outdoorCourts;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            MejorSet USA · ROI Estimator
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Padel Court ROI Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Model indoor and outdoor court investments across US markets. Adjust
            assumptions in real time — projections update instantly.
          </p>
        </div>
        <div className="flex gap-3 text-center">
          <CourtBadge
            icon={Warehouse}
            label="Indoor"
            count={input.indoorCourts}
            capex={metrics.indoorCapex}
          />
          <CourtBadge
            icon={Sun}
            label="Outdoor"
            count={input.outdoorCourts}
            capex={metrics.outdoorCapex}
          />
        </div>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total CAPEX"
          value={formatCurrency(metrics.totalCapex)}
          sub={`${totalCourts} courts · ${input.horizonYears}yr horizon`}
          icon={Building2}
          accent="blue"
        />
        <MetricCard
          label="Annual revenue"
          value={formatCurrency(metrics.annualRevenue)}
          sub={`${formatPercent(input.utilizationPct)} utilization`}
          icon={TrendingUp}
          accent="emerald"
        />
        <MetricCard
          label="Payback period"
          value={metrics.paybackYears ? `${metrics.paybackYears.toFixed(1)} years` : "Beyond horizon"}
          sub={metrics.breakEvenMonths ? `~${Math.ceil(metrics.breakEvenMonths)} mo EBITDA breakeven` : undefined}
          icon={Target}
          accent="amber"
        />
        <MetricCard
          label={`ROI (${input.horizonYears}yr)`}
          value={formatPercent(metrics.roiPct)}
          sub={metrics.irrPct ? `IRR ${formatPercent(metrics.irrPct)} · NPV ${formatCurrency(metrics.npv)}` : `NPV ${formatCurrency(metrics.npv)}`}
          icon={Percent}
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Courts & location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField
                label="Indoor courts"
                value={input.indoorCourts}
                onChange={(v) => patch("indoorCourts", Math.max(0, v))}
                min={0}
                max={20}
              />
              <InputField
                label="Outdoor courts"
                value={input.outdoorCourts}
                onChange={(v) => patch("outdoorCourts", Math.max(0, v))}
                min={0}
                max={20}
              />
              <SelectField
                label="US market tier"
                value={input.stateTier}
                onChange={(v) => patch("stateTier", v as UsStateTier)}
                options={(Object.keys(STATE_TIER_LABELS) as UsStateTier[]).map((k) => ({ value: k, label: STATE_TIER_LABELS[k] }))}
              />
              <InputField
                label="Projection horizon"
                suffix="years"
                value={input.horizonYears}
                onChange={(v) => patch("horizonYears", Math.min(15, Math.max(3, v)))}
                min={3}
                max={15}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue drivers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SliderField
                label="Court utilization"
                value={input.utilizationPct}
                onChange={(v) => patch("utilizationPct", v)}
                min={15}
                max={85}
                step={1}
                format={(v) => formatPercent(v, 0)}
              />
              <InputField
                label="Hourly court rate"
                prefix="$"
                value={input.hourlyRate}
                onChange={(v) => patch("hourlyRate", v)}
                min={25}
                max={120}
              />
              <InputField
                label="Hours open per day"
                value={input.hoursOpenPerDay}
                onChange={(v) => patch("hoursOpenPerDay", v)}
                min={8}
                max={18}
              />
              <InputField
                label="Active memberships"
                value={input.membershipsMonthly}
                onChange={(v) => patch("membershipsMonthly", v)}
                min={0}
              />
              <InputField
                label="Membership fee"
                prefix="$"
                suffix="/mo"
                value={input.membershipFee}
                onChange={(v) => patch("membershipFee", v)}
                min={0}
              />
              <InputField
                label="Ancillary revenue"
                prefix="$"
                suffix="/mo"
                value={input.ancillaryRevenueMonthly}
                onChange={(v) => patch("ancillaryRevenueMonthly", v)}
                min={0}
                step={500}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating expenses (monthly)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <InputField label="Rent / mortgage" prefix="$" value={input.rentMonthly} onChange={(v) => patch("rentMonthly", v)} min={0} step={500} />
              <InputField label="Staff" prefix="$" value={input.staffMonthly} onChange={(v) => patch("staffMonthly", v)} min={0} step={500} />
              <InputField label="Utilities" prefix="$" value={input.utilitiesMonthly} onChange={(v) => patch("utilitiesMonthly", v)} min={0} />
              <InputField label="Maintenance" prefix="$" value={input.maintenanceMonthly} onChange={(v) => patch("maintenanceMonthly", v)} min={0} />
              <InputField label="Marketing" prefix="$" value={input.marketingMonthly} onChange={(v) => patch("marketingMonthly", v)} min={0} />
              <InputField label="Insurance" prefix="$" value={input.insuranceMonthly} onChange={(v) => patch("insuranceMonthly", v)} min={0} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financing (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField
                label="Loan amount"
                prefix="$"
                value={input.loanAmount}
                onChange={(v) => patch("loanAmount", v)}
                min={0}
                step={10000}
              />
              <InputField
                label="Interest rate"
                suffix="%"
                value={input.loanRatePct}
                onChange={(v) => patch("loanRatePct", v)}
                min={0}
                max={15}
                step={0.25}
              />
              <InputField
                label="Loan term"
                suffix="years"
                value={input.loanTermYears}
                onChange={(v) => patch("loanTermYears", v)}
                min={1}
                max={25}
              />
            </CardContent>
          </Card>
        </aside>

        <main className="space-y-6 lg:col-span-8 xl:col-span-9">
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryPill label="EBITDA (Year 1)" value={formatCurrency(metrics.annualEbitda)} icon={DollarSign} />
            <SummaryPill label="Annual OPEX" value={formatCurrency(metrics.annualOpex)} icon={Building2} />
            <SummaryPill label="Court revenue mix" value={`${input.indoorCourts} in · ${input.outdoorCourts} out`} icon={Warehouse} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <CashFlowChart data={yearly} />
            <CumulativeChart data={yearly} />
          </div>

          <ScenarioTable scenarios={scenarios} />

          <p className="text-center text-[11px] text-slate-600">
            Projections are illustrative estimates based on MejorSet USA benchmarks.
            Not financial advice. Actual results depend on location, execution, and market conditions.
          </p>
        </main>
      </div>
    </div>
  );
}

function CourtBadge({
  icon: Icon,
  label,
  count,
  capex,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  capex: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-800/60 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold text-white">{count}</p>
      <p className="text-[10px] text-slate-500">{formatCurrency(capex)} CAPEX</p>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-800/50 px-4 py-3">
      <Icon className="h-4 w-4 text-brand-400" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
