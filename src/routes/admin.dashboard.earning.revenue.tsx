import { createFileRoute } from "@tanstack/react-router";
import { Banknote, CircleDollarSign, Coins, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel } from "@/components/dashboard/kit";
import { FinanceBars, ShareList } from "@/components/admin/FinanceBars";
import { ADMIN_TOTALS, REVENUE_BY_ADVERTISER, num } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/earning/revenue")({
  component: Page,
  head: () =>
    dashboardHead(
      "Total Revenue — CrosX Admin",
      "Advertiser revenue booked across CrosX campaigns, by month and by advertiser.",
    ),
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Earning"
        title="Total Revenue"
        description="Gross revenue billed to advertisers, tracked month over month and split by account."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Revenue report export started (demo)")}>
            Export Report
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Revenue" value={ADMIN_TOTALS.totalRevenue} prefix="₹" icon={CircleDollarSign} trend="↑ 18.4%" support="Lifetime booked" delay={0} />
          <KpiCard label="Publisher Payouts" value={ADMIN_TOTALS.totalPaid} prefix="₹" icon={Banknote} trendTone="neutral" support="65.5% of revenue" delay={0.05} />
          <KpiCard label="Net Earning" value={ADMIN_TOTALS.netEarning} prefix="₹" icon={Coins} trend="↑ 21.2%" support="34.5% blended margin" delay={0.1} />
          <KpiCard label="Conversions Billed" value={ADMIN_TOTALS.conversions} icon={TrendingUp} trend="↑ 10.8%" support={`EPC ₹${ADMIN_TOTALS.epc}`} delay={0.15} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel title="Revenue by Month" description="Last eight billing cycles.">
            <FinanceBars metric="revenue" />
          </Panel>
          <Panel title="Revenue by Advertiser" description="Top eight accounts by booked revenue.">
            <ShareList
              items={REVENUE_BY_ADVERTISER.map((r) => ({
                label: r.advertiser,
                amount: r.revenue,
                share: r.share,
                caption: `${num(r.conversions)} conversions`,
              }))}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
