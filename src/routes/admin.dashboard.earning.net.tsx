import { createFileRoute } from "@tanstack/react-router";
import { Coins, Download, Percent, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel } from "@/components/dashboard/kit";
import { FinanceBars } from "@/components/admin/FinanceBars";
import { ADMIN_TOTALS, MONTHLY_FINANCE, inr } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/earning/net")({
  component: Page,
  head: () =>
    dashboardHead(
      "Total Earning — CrosX Admin",
      "CrosX net earning after publisher payouts, with monthly margin breakdown.",
    ),
});

function Page() {
  const margin = Math.round((ADMIN_TOTALS.netEarning / ADMIN_TOTALS.totalRevenue) * 1000) / 10;
  const latest = MONTHLY_FINANCE[MONTHLY_FINANCE.length - 1]!;
  const latestNet = latest.revenue - latest.paid;

  return (
    <>
      <PageHeader
        eyebrow="Earning"
        title="Total Earning"
        description="What CrosX keeps after publisher payouts — the true margin of the network."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Earning report export started (demo)")}>
            Export Report
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Net Earning" value={ADMIN_TOTALS.netEarning} prefix="₹" icon={Coins} trend="↑ 21.2%" support="Lifetime after payouts" delay={0} />
          <KpiCard label="Blended Margin" value={margin} suffix="%" decimals={1} icon={Percent} trend="↑ 1.8 pts" support="Revenue minus payouts" delay={0.05} />
          <KpiCard label="This Month" value={latestNet} prefix="₹" icon={TrendingUp} trend="↑ 12.4%" support="Sep 2026 to date" delay={0.1} />
          <KpiCard label="Earning per Conversion" value={Math.round(ADMIN_TOTALS.netEarning / ADMIN_TOTALS.conversions)} prefix="₹" icon={Coins} trendTone="neutral" support="Average contribution" delay={0.15} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel title="Net Earning by Month" description="Revenue minus publisher payouts, per cycle.">
            <FinanceBars metric="net" />
          </Panel>
          <Panel title="Margin Breakdown" description="How each cycle splits between payouts and CrosX earning.">
            <ul className="grid gap-3">
              {MONTHLY_FINANCE.map((m) => {
                const net = m.revenue - m.paid;
                const pct = Math.round((net / m.revenue) * 1000) / 10;
                return (
                  <li key={m.month} className="rounded-2xl border border-hairline bg-surface-2/35 p-3.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-[13px] font-semibold">{m.month} 2026</p>
                      <p className="text-[13px] font-bold tabular-nums text-brand">{inr(net)}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Revenue {inr(m.revenue)} · Payouts {inr(m.paid)} · Margin {pct}%
                    </p>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
