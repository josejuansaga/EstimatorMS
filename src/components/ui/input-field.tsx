import { cn } from "@/lib/utils";

interface InputFieldProps {
  label: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function InputField({
  label,
  hint,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: InputFieldProps) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs text-slate-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-surface-700/60 px-3 py-2.5 text-sm text-white transition focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            prefix && "pl-7",
            suffix && "pr-10",
          )}
        />
        {suffix && (
          <span className="absolute right-3 text-xs text-slate-500">{suffix}</span>
        )}
      </div>
    </label>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => `${v}`,
}: SliderFieldProps) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-300">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-600 accent-brand-500"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-surface-700/60 px-3 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-800">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
