import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Panel, Select, StatusBadge } from "@/components/dashboard/kit";
import { EASE_LUX } from "@/lib/motion-presets";
import { CAMPAIGNS, PUBLISHERS, inr, num } from "@/lib/admin-data";

type Mode = "campaigns" | "publishers";

export function TopEntitiesPanel() {
  const [mode, setMode] = useState<Mode>("campaigns");

  const rows = useMemo(() => {
    if (mode === "campaigns") {
      const top = [...CAMPAIGNS].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
      const max = top[0]?.revenue ?? 1;
      return top.map((c) => ({
        key: c.id,
        title: c.name,
        meta: `${c.advertiser} • ${c.geo}`,
        share: Math.round((c.revenue / max) * 100),
        clicks: c.clicks,
        conversions: c.conversions,
        revenue: c.revenue,
      }));
    }
    const top = [...PUBLISHERS].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
    const max = top[0]?.revenue ?? 1;
    return top.map((p) => ({
      key: p.id,
      title: p.name,
      meta: `${p.company} • ${p.tier}`,
      share: Math.round((p.revenue / max) * 100),
      clicks: p.clicks,
      conversions: p.conversions,
      revenue: p.revenue,
    }));
  }, [mode]);

  return (
    <Panel
      title="Top Performers"
      description="Ranked by revenue generated in the current period."
      action={
        <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)} aria-label="Ranking">
          <option value="campaigns">Top Campaigns</option>
          <option value="publishers">Top Publishers</option>
        </Select>
      }
    >
      <ol className="grid gap-3.5">
        {rows.map((r, i) => (
          <li
            key={r.key}
            className="rounded-2xl border border-hairline bg-surface-2/35 p-3.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45 sm:p-4"
          >
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/12 font-display text-[13px] font-black text-brand">
                {i + 1}
              </span>
              <Link
                to={mode === "campaigns" ? "/admin/dashboard/campaigns/all" : "/admin/dashboard/publishers/all"}
                className="min-w-0"
              >
                <p className="truncate font-display text-[15px] font-bold tracking-tight">
                  {r.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{r.meta}</p>
              </Link>
              <StatusBadge tone="brand" className="shrink-0">
                {r.share}%
              </StatusBadge>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.share}%` }}
                transition={{ duration: 0.85, delay: 0.1 + i * 0.06, ease: EASE_LUX }}
                className="h-full rounded-full bg-brand"
              />
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 text-center sm:text-left">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Clicks
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{num(r.clicks)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Conversions
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{num(r.conversions)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Revenue
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold tabular-nums text-brand">
                  {inr(r.revenue)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
