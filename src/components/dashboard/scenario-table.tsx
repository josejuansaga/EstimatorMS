"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { EstimateMetrics, ScenarioKey } from "@/lib/estimator/types";

const labels: Record<ScenarioKey, string> = {
  conservative: "Conservative",
  base: "Base case",
  optimistic: "Optimistic",
};

const styles: Record<ScenarioKey, string> = {
  conservative: "text-amber-300",
  base: "text-brand-300",
  optimistic: "text-blue-300",
};

export function ScenarioTable({
  scenarios,
}: {
  scenarios: Record<ScenarioKey, EstimateMetrics>;
}) {
  const rows: { key: keyof EstimateMetrics; label: string; format: (v: number) => string }[] = [
    { key: "annualRevenue", label: "Annual revenue", format: formatCurrency },
    { key: "annualEbitda", label: "EBITDA", format: formatCurrency },
    { key: "paybackYears", label: "Payback", format: (v) => (v ? `${v.toFixed(1)} yrs` : "—") },
    { key: "roiPct", label: "ROI", format: (v) => formatPercent(v) },
    { key: "npv", label: "NPV (10%)", format: formatCurrency },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-500">
                <th className="pb-3 pr-4 font-medium">Metric</th>
                {(Object.keys(labels) as ScenarioKey[]).map((k) => (
                  <th key={k} className={`pb-3 pr-4 font-medium ${styles[k]}`}>
                    {labels[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-400">{row.label}</td>
                  {(Object.keys(labels) as ScenarioKey[]).map((k) => {
                    const val = scenarios[k][row.key];
                    const display = typeof val === "number" ? row.format(val) : "—";
                    return (
                      <td key={k} className="py-3 pr-4 font-medium text-white">
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
