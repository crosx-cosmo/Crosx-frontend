import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { Panel, Segmented, Select, TableSkeleton, useMockLoad } from "./kit";
import {
  RANGE_OPTIONS,
  inr,
  num,
  seriesFor,
  type RangeKey,
  type SeriesPoint,
} from "@/lib/publisher-data";

type MetricKey = "clicks" | "conversions" | "earnings";

const METRICS: { key: MetricKey; label: string }[] = [
  { key: "clicks", label: "Clicks" },
  { key: "conversions", label: "Conversions" },
  { key: "earnings", label: "Earnings" },
];

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: SeriesPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 text-xs shadow-lux">
      <p className="font-display text-sm font-bold">{point.date}</p>
      <dl className="mt-1.5 grid gap-1">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Clicks</dt>
          <dd className="font-semibold tabular-nums">{num(point.clicks)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Conversions</dt>
          <dd className="font-semibold tabular-nums">{num(point.conversions)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Earnings</dt>
          <dd className="font-semibold tabular-nums text-brand">{inr(point.earnings)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function AnalyticsPanel({
  range,
  onRange,
}: {
  range: RangeKey;
  onRange: (r: RangeKey) => void;
}) {
  const [metric, setMetric] = useState<MetricKey>("clicks");
  const data = useMemo(() => seriesFor(range), [range]);
  const loading = useMockLoad([range]);

  return (
    <Panel
      title="Performance Analytics"
      description={
        RANGE_OPTIONS.find((r) => r.key === range)?.caption ?? "Clicks, conversions and earnings"
      }
      action={
        <>
          <Segmented options={METRICS} value={metric} onChange={setMetric} />
          <div className="relative">
            <CalendarDays
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Select
              value={range}
              onChange={(e) => onRange(e.target.value as RangeKey)}
              aria-label="Date range"
              className="pl-9"
            >
              {RANGE_OPTIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
        </>
      }
    >
      {loading ? (
        <div className="h-[16rem] sm:h-[20rem]">
          <TableSkeleton rows={5} />
        </div>
      ) : (
        <div className="h-[16rem] w-full sm:h-[20rem]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="metric-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--grid-line)" vertical={false} />
              <XAxis
                dataKey="day"
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
                width={54}
                tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--hairline)" }} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="var(--brand)"
                strokeWidth={2.5}
                fill="url(#metric-grad)"
                animationDuration={280}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}
