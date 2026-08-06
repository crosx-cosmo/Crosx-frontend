import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

type RangeKey = "today" | "7d" | "month" | "last-month" | "custom";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
  { key: "month", label: "This Month" },
  { key: "last-month", label: "Last Month" },
  { key: "custom", label: "Custom Date" },
];

type Point = { label: string; clicks: number; conversion: number; leads: number };

function seedSeries(points: number, labelFor: (i: number) => string, scale: number): Point[] {
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin(i / 1.8) * 0.22 + Math.cos(i / 3.4) * 0.14;
    const clicks = Math.round(scale * (1 + wave) + scale * 0.18);
    return {
      label: labelFor(i),
      clicks,
      conversion: Math.round(clicks * 0.16),
      leads: Math.round(clicks * 0.09),
    };
  });
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildData(range: RangeKey): Point[] {
  switch (range) {
    case "today":
      return seedSeries(12, (i) => `${String(i * 2).padStart(2, "0")}:00`, 640);
    case "7d":
      return seedSeries(7, (i) => DAY_LABELS[i]!, 6200);
    case "month":
      return seedSeries(15, (i) => `${i * 2 + 1}`, 8400);
    case "last-month":
      return seedSeries(15, (i) => `${i * 2 + 1}`, 7300);
    default:
      return seedSeries(10, (i) => `D${i + 1}`, 5600);
  }
}

const SERIES = [
  { key: "clicks", name: "Clicks", color: "var(--brand)" },
  { key: "conversion", name: "Conversion", color: "var(--foreground)" },
  { key: "leads", name: "Leads", color: "var(--brand-soft)" },
] as const;

export function AnalyticsChart() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const data = useMemo(() => buildData(range), [range]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_LUX }}
      className="glass rounded-2xl p-4 sm:p-6"
      aria-label="Traffic analytics"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-tight">Performance Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clicks, conversion and leads across your selected period.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5",
                range === r.key
                  ? "border-brand/60 bg-brand/15 text-foreground"
                  : "border-hairline bg-surface-2/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {r.key === "custom" && <CalendarDays className="size-3.5" aria-hidden="true" />}
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {range === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: EASE_LUX }}
          className="mt-4 flex flex-wrap items-end gap-3 overflow-hidden"
        >
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 rounded-xl border border-input bg-surface-2/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
            />
          </label>
        </motion.div>
      )}

      <div className="mt-6 h-[18rem] w-full sm:h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="var(--grid-line)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={52}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--hairline)",
                borderRadius: "0.875rem",
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)", paddingTop: 8 }}
            />
            {SERIES.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                animationDuration={700}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
