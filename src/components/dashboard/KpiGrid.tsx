import {
  BadgeIndianRupee,
  MousePointerClick,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { KpiCard } from "./kit";
import { ACCOUNT_TOTALS, inr, num } from "@/lib/publisher-data";

const A = ACCOUNT_TOTALS;

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      <KpiCard
        label="Total Campaigns"
        value={A.totalCampaigns}
        icon={Target}
        trend="↑ 14.3%"
        support="+6 this month"
        caption="Compared to Jul 2026"
        delay={0}
      />
      <KpiCard
        label="Active Campaigns"
        value={A.activeCampaigns}
        icon={Zap}
        trend="↑ 16.7%"
        support="+3 this week"
        caption="43.7% of total"
        delay={0.05}
      />
      <KpiCard
        label="Monthly Clicks"
        value={A.monthlyClicks}
        icon={MousePointerClick}
        trend="↑ 12.4%"
        support={`${num(A.weeklyClicks)} this week`}
        caption="Across all active campaigns"
        delay={0.1}
      />
      <KpiCard
        label="Conversions"
        value={A.conversions}
        icon={TrendingUp}
        trend="↑ 8.1%"
        support={`${num(A.weeklyConversions)} this week`}
        caption="87.4% approval rate"
        delay={0.15}
      />
      <KpiCard
        label="Estimated Earnings"
        value={A.earnings}
        prefix="₹"
        icon={BadgeIndianRupee}
        trend="↑ 15.2%"
        support={`${inr(A.weeklyEarnings)} this week`}
        caption="Confirmed + pending revenue"
        delay={0.2}
      />
      <KpiCard
        label="Pending Payout"
        value={A.pendingPayout}
        prefix="₹"
        icon={Wallet}
        trend="Processing"
        trendTone="neutral"
        support={`Next payout: ${A.nextPayoutDate}`}
        caption="Auto-settled every 15 days"
        delay={0.25}
      />
    </div>
  );
}
