import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LinkIcon, Target, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import {
  ActionButton,
  CardsSkeleton,
  EmptyState,
  KpiCard,
  Panel,
  SearchField,
  Select,
  StatusBadge,
  useMockLoad,
} from "@/components/dashboard/kit";
import { usePublisherMock } from "@/components/dashboard/mock-store";
import { TrackingLinkModal } from "@/components/dashboard/TrackingLinkModal";
import { inr, num } from "@/lib/publisher-data";

export const Route = createFileRoute("/publisher/dashboard/campaigns/active")({
  component: Page,
  head: () =>
    dashboardHead(
      "Active Campaign — CrosX Publisher",
      "Monitor the CrosX campaigns you are actively promoting with live clicks, conversions and earnings.",
    ),
});

type SortKey = "revenue" | "conversions" | "clicks";

function Page() {
  const { activeCampaigns } = usePublisherMock();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("revenue");
  const [linkSlug, setLinkSlug] = useState<string | null>(null);
  const loading = useMockLoad([]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...activeCampaigns]
      .filter((c) => term === "" || c.name.toLowerCase().includes(term))
      .sort((a, b) => b[sort] - a[sort]);
  }, [activeCampaigns, query, sort]);

  const totals = useMemo(
    () =>
      activeCampaigns.reduce(
        (acc, c) => ({
          clicks: acc.clicks + c.clicks,
          conversions: acc.conversions + c.conversions,
          revenue: acc.revenue + c.revenue,
        }),
        { clicks: 0, conversions: 0, revenue: 0 },
      ),
    [activeCampaigns],
  );

  return (
    <>
      <PageHeader
        eyebrow="Live traffic"
        title="Active Campaigns"
        description="Every campaign you are currently promoting, with live performance and instant tracking links."
        action={
          <ActionButton icon={Target}>
            <Link to="/publisher/dashboard/campaigns/all">Browse Marketplace</Link>
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Active Campaigns"
            value={activeCampaigns.length}
            icon={Zap}
            support="Currently promoting"
            delay={0}
          />
          <KpiCard
            label="Total Clicks"
            value={totals.clicks}
            icon={Target}
            support="Lifetime on active offers"
            delay={0.05}
          />
          <KpiCard
            label="Conversions"
            value={totals.conversions}
            icon={Zap}
            support="Approved + pending"
            delay={0.1}
          />
          <KpiCard
            label="Revenue"
            value={totals.revenue}
            prefix="₹"
            icon={Zap}
            support="From active campaigns"
            delay={0.15}
          />
        </div>

        <Panel
          title={`${rows.length} active campaigns`}
          description="Sorted by your chosen performance metric."
          action={
            <>
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search active..."
                className="w-full sm:w-52"
              />
              <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="revenue">Highest Earnings</option>
                <option value="conversions">Highest Conversions</option>
                <option value="clicks">Most Clicks</option>
              </Select>
            </>
          }
        >
          {loading ? (
            <CardsSkeleton count={4} />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No active campaigns yet"
              description="Join a campaign from the marketplace to start generating clicks and earnings."
            />
          ) : (
            <ul className="grid gap-4 xl:grid-cols-2">
              {rows.map((c) => (
                <li
                  key={c.slug}
                  className="glass grid gap-4 rounded-2xl p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-lux sm:p-5"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <Link
                      to="/publisher/dashboard/campaigns/$slug"
                      params={{ slug: c.slug }}
                      className="min-w-0"
                    >
                      <p className="truncate font-display text-base font-bold tracking-tight">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.category} • ₹{c.payout} per conversion
                      </p>
                    </Link>
                    <StatusBadge tone="success" dot>
                      Live
                    </StatusBadge>
                  </div>

                  <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { label: "Clicks", value: num(c.clicks) },
                      { label: "Conversions", value: num(c.conversions) },
                      { label: "CR", value: `${c.cr.toFixed(2)}%` },
                      { label: "Revenue", value: inr(c.revenue) },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-hairline bg-surface-2/40 p-3"
                      >
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="mt-0.5 text-[13px] font-bold tabular-nums">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <Link
                      to="/publisher/dashboard/campaigns/$slug"
                      params={{ slug: c.slug }}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-hairline bg-surface-2/50 px-3.5 text-[13px] font-semibold transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/50"
                    >
                      View Details
                    </Link>
                    <ActionButton
                      variant="solid"
                      icon={LinkIcon}
                      onClick={() => setLinkSlug(c.slug)}
                    >
                      Get Link
                    </ActionButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <TrackingLinkModal
        open={linkSlug !== null}
        onClose={() => setLinkSlug(null)}
        campaignSlug={linkSlug ?? undefined}
      />
    </>
  );
}
