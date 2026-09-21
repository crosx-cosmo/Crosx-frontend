import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { Panel, Select, TableSkeleton, useMockLoad } from "./kit";
import {
  RANGE_OPTIONS,
  inr,
  num,
  seriesFor,
  type RangeKey,
  type SeriesPoint,
} from "@/lib/publisher-data";

type ChartPoint = SeriesPoint & {
  iClicks: number;
  iConversions: number;
  iEarnings: number;
};

const SERIES = [
  { key: "iClicks" as const, label: "Clicks", color: "var(--brand)" },
  { key: "iConversions" as const, label: "Conversions", color: "var(--foreground)" },
  { key: "iEarnings" as const, label: "Earnings", color: "var(--muted-foreground)" },
] as const;

/** Scale every metric to 0-100 so the three series share one readable timeline. */
function normalize(data: SeriesPoint[]): ChartPoint[] {
  const max = (pick: (p: SeriesPoint) => number) => Math.max(1, ...data.map((p) => pick(p) ?? 0));
  const mc = max((p) => p.clicks);
  const mv = max((p) => p.conversions);
  const me = max((p) => p.earnings);
  return data.map((p) => ({
    ...p,
    iClicks: (p.clicks / mc) * 100,
    iConversions: (p.conversions / mv) * 100,
    iEarnings: (p.earnings / me) * 100,
  }));
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 text-xs shadow-lux">
      <p className="font-display text-sm font-bold">{point.date}</p>
      <dl className="mt-1.5 grid gap-1">
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" /> Clicks
          </dt>
          <dd className="font-semibold tabular-nums">{num(point.clicks)}</dd>
        </div>
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-foreground" /> Conversions
          </dt>
          <dd className="font-semibold tabular-nums">{num(point.conversions)}</dd>
        </div>
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground" /> Earnings
          </dt>
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
  const raw = useMemo(() => seriesFor(range), [range]);
  const data = useMemo(() => normalize(raw), [raw]);
  const totals = useMemo(
    () =>
      raw.reduce(
        (acc, p) => ({
          clicks: acc.clicks + p.clicks,
          conversions: acc.conversions + p.conversions,
          earnings: acc.earnings + p.earnings,
        }),
        { clicks: 0, conversions: 0, earnings: 0 },
      ),
    [raw],
  );
  const loading = useMockLoad([range]);

  return (
    <Panel
      title="Performance Analytics"
      description={
        RANGE_OPTIONS.find((r) => r.key === range)?.caption ?? "Clicks, conversions and earnings"
      }
      action={
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
      }
    >
      {/* KPI summary */}
      <dl className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Clicks", value: num(totals.clicks), dot: "bg-brand" },
          { label: "Total Conversions", value: num(totals.conversions), dot: "bg-foreground" },
          { label: "Total Earnings", value: inr(totals.earnings), dot: "bg-muted-foreground" },
        ].map((k) => (
          <div key={k.label} className="plate rounded-2xl px-4 py-3">
            <dt className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span aria-hidden="true" className={`size-1.5 rounded-full ${k.dot}`} />
              {k.label}
            </dt>
            <dd className="mt-1 font-display text-lg font-bold tabular-nums text-foreground">
              {k.value}
            </dd>
          </div>
        ))}
      </dl>

      {loading ? (
        <div className="h-[16rem] sm:h-[20rem]">
          <TableSkeleton rows={5} />
        </div>
      ) : (
        <>
          <div className="h-[16rem] w-full sm:h-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  minTickGap={16}
                />
                <YAxis hide domain={[0, 110]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--hairline)" }} />
                {SERIES.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3.5, strokeWidth: 0 }}
                    animationDuration={220}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-0.5 w-5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Series are scaled to a shared axis for comparison. Hover any date for exact values.
          </p>
        </>
      )}
    </Panel>
  );
}
