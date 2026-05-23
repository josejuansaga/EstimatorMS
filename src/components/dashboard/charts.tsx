"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { YearProjection } from "@/lib/estimator/types";

const tooltipStyle = {
  backgroundColor: "#1a2332",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "12px",
};

export function CashFlowChart({ data }: { data: YearProjection[] }) {
  const chartData = data.map((d) => ({
    year: `Y${d.year}`,
    revenue: Math.round(d.revenue),
    opex: Math.round(d.opex),
    net: Math.round(d.netCashFlow),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual cash flow projection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opex" name="OPEX" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net cash" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CumulativeChart({ data }: { data: YearProjection[] }) {
  const chartData = data.map((d) => ({
    year: `Y${d.year}`,
    cumulative: Math.round(d.cumulativeCashFlow),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative cash position</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#10b981" fill="url(#cumGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
