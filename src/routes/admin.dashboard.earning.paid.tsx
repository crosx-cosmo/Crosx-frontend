import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Download, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { dashboardHead } from "@/components/dashboard/head";
import { ActionButton, KpiCard, Panel } from "@/components/dashboard/kit";
import { FinanceBars, ShareList } from "@/components/admin/FinanceBars";
import { ADMIN_TOTALS, PAID_BY_METHOD, PAYMENT_TOTALS } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard/earning/paid")({
  component: Page,
  head: () =>
    dashboardHead(
      "Total Paid — CrosX Admin",
      "Everything CrosX has paid out to publishers, by month and by payment method.",
    ),
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Earning"
        title="Total Paid"
        description="All settled publisher payouts, split by billing cycle and payment method."
        action={
          <ActionButton icon={Download} onClick={() => toast.success("Payout report export started (demo)")}>
            Export Report
          </ActionButton>
        }
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Paid" value={ADMIN_TOTALS.totalPaid} prefix="₹" icon={Banknote} trend="↑ 16.1%" support="Lifetime settled" delay={0} />
          <KpiCard label="Payouts Settled" value={PAYMENT_TOTALS.paidCount} icon={Wallet} trendTone="neutral" support="Across all cycles" delay={0.05} />
          <KpiCard label="Average Payout" value={PAYMENT_TOTALS.avgTicket} prefix="₹" icon={Banknote} trendTone="neutral" support="Per publisher request" delay={0.1} />
          <KpiCard label="Paid Publishers" value={ADMIN_TOTALS.activePublishers} icon={Users} trendTone="neutral" support="Earning this quarter" delay={0.15} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel title="Payouts by Month" description="Last eight settlement cycles.">
            <FinanceBars metric="paid" />
          </Panel>
          <Panel title="Payouts by Method" description="How publishers choose to be paid.">
            <ShareList
              items={PAID_BY_METHOD.map((m) => ({
                label: m.method,
                amount: m.amount,
                share: m.share,
              }))}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
