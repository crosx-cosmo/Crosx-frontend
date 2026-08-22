import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Panel, Select, StatusBadge } from "./kit";
import { usePublisherMock } from "./mock-store";
import { EASE_LUX } from "@/lib/motion-presets";
import { inr, num } from "@/lib/publisher-data";

type SortKey = "revenue" | "conversions" | "clicks";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "revenue", label: "Highest Earnings" },
  { key: "conversions", label: "Highest Conversions" },
  { key: "clicks", label: "Most Clicks" },
];

export function TopCampaigns() {
  const { activeCampaigns } = usePublisherMock();
  const [sort, setSort] = useState<SortKey>("revenue");

  const rows = useMemo(
    () => [...activeCampaigns].sort((a, b) => b[sort] - a[sort]).slice(0, 6),
    [activeCampaigns, sort],
  );

  return (
    <Panel
      title="Top Performing Campaigns"
      description="Ranked by your selected metric for this period."
      action={
        <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort">
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </Select>
      }
    >
      <ol className="grid gap-3.5">
        {rows.map((c, i) => (
          <li
            key={c.slug}
            className="rounded-2xl border border-hairline bg-surface-2/35 p-3.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45 sm:p-4"
          >
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/12 font-display text-[13px] font-black text-brand">
                {i + 1}
              </span>
              <Link
                to="/publisher/dashboard/campaigns/$slug"
                params={{ slug: c.slug }}
                className="min-w-0"
              >
                <p className="truncate font-display text-[15px] font-bold tracking-tight">
                  {c.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.category} • {c.geo}
                </p>
              </Link>
              <StatusBadge tone="brand" className="shrink-0">
                {c.share}%
              </StatusBadge>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.share}%` }}
                transition={{ duration: 0.85, delay: 0.1 + i * 0.06, ease: EASE_LUX }}
                className="h-full rounded-full bg-brand"
              />
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 text-center sm:text-left">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Clicks
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{num(c.clicks)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Conversions
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{num(c.conversions)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Revenue
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums text-brand">
                  {inr(c.revenue)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
