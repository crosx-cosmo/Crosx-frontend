import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel, Select, TableSkeleton, useMockLoad } from "@/components/dashboard/kit";
import {
  RANGE_OPTIONS,
  inr,
  num,
  seriesFor,
  type RangeKey,
  type SeriesPoint,
} from "@/lib/admin-data";

type ChartPoint = SeriesPoint & { iClicks: number; iConversions: number; iRevenue: number };

const SERIES = [
  { key: "iClicks" as const, label: "Clicks", color: "var(--brand)" },
  { key: "iConversions" as const, label: "Conversions", color: "var(--foreground)" },
  { key: "iRevenue" as const, label: "Revenue", color: "var(--muted-foreground)" },
] as const;

function normalize(data: SeriesPoint[]): ChartPoint[] {
  const max = (pick: (p: SeriesPoint) => number) => Math.max(1, ...data.map((p) => pick(p) ?? 0));
  const mc = max((p) => p.clicks);
  const mv = max((p) => p.conversions);
  const mr = max((p) => p.revenue);
  return data.map((p) => ({
    ...p,
    iClicks: (p.clicks / mc) * 100,
    iConversions: (p.conversions / mv) * 100,
    iRevenue: (p.revenue / mr) * 100,
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
            <span className="size-1.5 rounded-full bg-muted-foreground" /> Revenue
          </dt>
          <dd className="font-semibold tabular-nums text-brand">{inr(point.revenue)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function AdminAnalyticsPanel({
  range,
  onRange,
}: {
  range: RangeKey;
  onRange: (r: RangeKey) => void;
}) {
  const loading = useMockLoad([range]);
  const data = normalize(seriesFor(range));

  const totals = data.reduce(
    (acc, p) => ({
      clicks: acc.clicks + p.clicks,
      conversions: acc.conversions + p.conversions,
      revenue: acc.revenue + p.revenue,
      payout: acc.payout + p.payout,
    }),
    { clicks: 0, conversions: 0, revenue: 0, payout: 0 },
  );

  return (
    <Panel
      title="Platform Performance"
      description={`Normalised trend — ${RANGE_OPTIONS.find((r) => r.key === range)?.caption ?? ""}`}
      action={
        <Select
          value={range}
          onChange={(e) => onRange(e.target.value as RangeKey)}
          aria-label="Date range"
        >
          {RANGE_OPTIONS.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </Select>
      }
    >
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <>
          <dl className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Clicks", value: num(totals.clicks) },
              { label: "Conversions", value: num(totals.conversions) },
              { label: "Revenue", value: inr(totals.revenue) },
              { label: "Publisher Payout", value: inr(totals.payout) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-hairline bg-surface-2/35 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-base font-bold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="h-[16rem] w-full sm:h-[19rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} />
                {SERIES.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-4 flex flex-wrap gap-4">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                {s.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
