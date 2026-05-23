import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accent?: "emerald" | "blue" | "amber" | "rose";
}

const accentMap = {
  emerald: "from-brand-500/20 to-transparent text-brand-300",
  blue: "from-blue-500/20 to-transparent text-blue-300",
  amber: "from-amber-500/20 to-transparent text-amber-300",
  rose: "from-rose-500/20 to-transparent text-rose-300",
};

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "emerald",
}: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-800/80 p-4 backdrop-blur-sm">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
            {value}
          </p>
          {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <Icon className="h-5 w-5 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
