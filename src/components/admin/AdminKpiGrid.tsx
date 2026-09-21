import {
  CircleDollarSign,
  MousePointerClick,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kit";
import { ADMIN_TOTALS, inr, num } from "@/lib/admin-data";

const A = ADMIN_TOTALS;

export function AdminKpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      <KpiCard
        label="Total Revenue"
        value={A.totalRevenue}
        prefix="₹"
        icon={CircleDollarSign}
        trend="↑ 18.6%"
        support={`${inr(3_180_500)} this month`}
        caption="Gross advertiser billing"
        delay={0}
      />
      <KpiCard
        label="Net Earning"
        value={A.netEarning}
        prefix="₹"
        icon={TrendingUp}
        trend="↑ 12.9%"
        support="34.5% platform margin"
        caption="Revenue minus publisher payouts"
        delay={0.05}
      />
      <KpiCard
        label="Publishers"
        value={A.publishers}
        icon={Users}
        trend="↑ 6.4%"
        support={`${A.activePublishers} active · ${A.pendingPublishers} pending`}
        caption="Across all tiers"
        delay={0.1}
      />
      <KpiCard
        label="Campaigns"
        value={A.campaigns}
        icon={Target}
        trend="↑ 9.1%"
        support={`${A.activeCampaigns} live right now`}
        caption={`${A.approvalRequests} approval requests waiting`}
        delay={0.15}
      />
      <KpiCard
        label="Monthly Clicks"
        value={A.monthlyClicks}
        icon={MousePointerClick}
        trend="↑ 14.2%"
        support={`${num(A.conversions)} conversions`}
        caption={`${A.approvalRate}% approval rate`}
        delay={0.2}
      />
      <KpiCard
        label="Pending Payout"
        value={A.pendingPayout}
        prefix="₹"
        icon={Wallet}
        trend="Queued"
        trendTone="neutral"
        support={`Next cycle: ${A.nextPayoutDate}`}
        caption="16 withdrawal requests"
        delay={0.25}
      />
    </div>
  );
}
